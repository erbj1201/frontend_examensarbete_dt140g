//import
import DOMPurify from "dompurify";
import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
//structure of milk
interface Milk {
  id: string;
  kgMilk: string;
  milkDate: string;
  animal_id: string;
}

function Milk() {
  //cookies
  const cookies = new Cookies();
  const token = cookies.get("token");
  //use navigate
  const navigate = useNavigate();
  //states
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [chosenAnimalId, setChosenAnimalId] = useState<string>("");
  const [chosenMilkId, setChosenMilkId] = useState<string>("");
  const [editMilk, setEditMilk] = useState(false);
  const [animals, setAnimals] = useState<{ id: string; animalId: string }[]>(
    []
  );
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [milks, setMilks] = useState<Milk[]>([]);
  //States store data
  const [newMilk, setNewMilk] = useState<Milk>({
    id: "",
    kgMilk: "",
    milkDate: "",
    animal_id: "",
  });
// state data in edit form
  const [inputData, setInputData] = useState({
    id: "",
    kgMilk: "",
    milkDate: "",
    animal_id: "",
  });

  //State for error store data
  const [formError, setFormError] = useState({
    kgMilk: "",
    milkDate: "",
    animal_id: "",
  });

  // Function to clear update and delete messages after a specified time
  const clearMessages = () => {
    //clear messages
    setShowMessage(null);
    setFormError({
      kgMilk: "",
      milkDate: "",
      animal_id: "",
    });
  };
  // Fetch all milks and animals with useEffect
  useEffect(() => {
    getAnimals();
    if (chosenAnimalId) {
      getMilkByAnimals(chosenAnimalId);
    }
  }, [chosenAnimalId]);

  //Handle changes in the input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    //Sanitize value
    const sanitizedData = DOMPurify.sanitize(value);
    setNewMilk((prevState) => ({
      ...prevState,
      [name]: sanitizedData,
    }));
  };


  //Add Milk data with fetch
  const addMilk = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Object to track input errors
    let inputError = {
      kgMilk: "",
      milkDate: "",
      animal_id: "",
    };
    //check if all fields empty
    if (!newMilk.kgMilk && !newMilk.milkDate && !chosenAnimalId) {
      //error messages when empty fields
      setFormError({
        ...inputError,
        kgMilk: "Fyll i mängden mjölk (kg/mjölk)",
        milkDate: "Fyll i datum för mjölkning",
        animal_id: "Välj ett djur",
      });
      // Clear message after 3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if animal_id empty
    if (!chosenAnimalId) {
      setFormError({
        ...inputError,
        animal_id: "Välj ett djur",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if date empty
    if (!newMilk.kgMilk) {
      setFormError({
        ...inputError,
        kgMilk: "Fyll i mängden mjölk (kg/mjölk)",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if type empty
    if (!newMilk.milkDate) {
      setFormError({
        ...inputError,
        milkDate: "Fyll i datum för mjölkning",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }

    //Sanitize input fields with DOMPurify
    const sanitizedKgMilk = DOMPurify.sanitize(newMilk.kgMilk);
    const sanitizedMilkDate = DOMPurify.sanitize(newMilk.milkDate);

    //Update state with sanitized values
    setNewMilk({
      id: newMilk.id,
      kgMilk: sanitizedKgMilk,
      milkDate: sanitizedMilkDate,
      animal_id: chosenAnimalId,
    }); //fetch post
    try {
      const response = await fetch(
        `http://localhost:8000/api/milks/animals/${chosenAnimalId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }, //send sanitized data
          body: JSON.stringify({
            kgMilk: sanitizedKgMilk,
            milkDate: sanitizedMilkDate,
            animal_id: chosenAnimalId,
          }),
        }
      ); //await response
      const responseData = await response.json();
      //if response ok, clear form
      if (response.ok) {
        setNewMilk({
          id: responseData.id,
          kgMilk: "",
          milkDate: "",
          animal_id: chosenAnimalId,
        });
        //get all milk from animal
        getMilkByAnimals(chosenAnimalId);
        //show message
        setShowMessage("Mjölkningen är tillagd");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
      console.log(responseData);
    } catch (error) {
      //error message
      setShowMessage("Fel vid lagring av mjölkning");
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      console.log(error);
    }
  };

  //Trigger that shows the last milks from the chosen id (animal).
  const changeAnimal = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    //set chosen animal
    setChosenAnimalId(value);
  };
  // Gets all milk from the animal with fetch
  const getMilkByAnimals = async (chosenAnimalId: string) => {
    //fetch get
    try {
      const response = await fetch(
        `http://localhost:8000/api/milks/animals/${chosenAnimalId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      ); //if response ok
      if (response.ok) {
        const jsonData = await response.json();
        //set milks
        setMilks(jsonData);
      } else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning av mjölk");
    }
  };

  // Get all animals with their animalId´s and id:s from the database
  const getAnimals = async () => {
    //Fetch get
    try {
      const response = await fetch(`http://localhost:8000/api/animals`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }); //if response ok
      if (response.ok) {
        const jsonData = await response.json();
        //Map function to transform objects in the array.
        const animalIds = jsonData.map((animal: any) => ({
          id: animal.id,
          animalId: animal.animalId,
        })); //set animal
        setAnimals(animalIds);
      } else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning");
    }
  };
//edit input fields in form
  const editData = () => {
    setEditMilk(true);
    setInputData({
      id: newMilk.id,
      kgMilk: newMilk.kgMilk,
      milkDate: newMilk.milkDate,
      animal_id: chosenAnimalId,
    });
  };
  //change url and add id
  const navigateToMilk = (id: string) => {
    //navigate to handle with id from chosen medicine
    navigate(`/handle/${id}`);
    //change states
    setShow(true);
    //save id
    setChosenMilkId(id);
  };

  //Update milk

  const updateMilk = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Sanitize input fields
    const { id, kgMilk, milkDate } = inputData;
    const sanitizedKgMilk = DOMPurify.sanitize(kgMilk);
    const sanitizedMilkDate = DOMPurify.sanitize(milkDate);

    /* Control if input fields are empty */
    // if kgMilk is empty
    if (!sanitizedKgMilk) {
      setFormError({
        ...formError,
        kgMilk: "Fyll i mängden mjölk (kg/mjölk)",
      });
      setTimeout(clearMessages, 3000);
      return;
    }

    // if milkkDate is empty
    if (!sanitizedMilkDate) {
      setFormError({
        ...formError,
        milkDate: "Fyll i datum för mjölkning",
      });
      setTimeout(clearMessages, 3000);
      return;
    }
    setNewMilk({
      id: chosenMilkId,
      kgMilk: sanitizedKgMilk,
      milkDate: sanitizedMilkDate,
      animal_id: chosenAnimalId
    })
    try {
      const response = await fetch(`http://localhost:8000/api/milks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          kgMilk: sanitizedKgMilk,
          milkDate: sanitizedMilkDate,
        })
      });
      const responseData = await response.json();
      console.log(responseData);

      //if response ok
      if (response.ok) {
        setShowMessage("Ändringarna är sparade");
        //Clear message after 3 seconds
        setTimeout(clearMessages, 3000);
        setEditMilk(false);
        //Write the data of the changed animal in table directly
        getMilkByAnimals(chosenAnimalId);
      }
      else {
        setShowMessage("Mjölkningen kunde inte ändras");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
    } catch {
      console.error("Något gick fel:");
    }
  }
  //Delete Milk with id
  const deleteMilk = async (id: string) => {
    //fetch delete
    try {
      const response = await fetch(`http://localhost:8000/api/milks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }); //if response ok
      if (response.ok) {
        //get all milks from animal
        getMilkByAnimals(chosenAnimalId);
        //change show to false and show message
        setShow(false);
        setShowMessage("Mjölkning är raderad");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      } else {
        setShowMessage("Mjölkningen kunde inte raderas");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
    } catch (error) {
      console.error("Något gick fel:", error);
    }
  };

  return (

    <div>
      {/* Boolean, if Edit milk true show edit form, else show form for add milk */}
      {/*form for changing milk*/}
      {editMilk ? (
        <div>
          <form className="form-control handleForm form-control-sm border-2 p-5 mx-auto w-50 "
            onSubmit={(e) => updateMilk(e)}
              noValidate>
            <h2>Ändra Mjölkning</h2>
            <div className="form-group">
              <label htmlFor="animal_id" className="form-label">
                SE-nummer:
              </label>
              <select
                id="animal_id"
                name="animal_id"
                className="form-control"
                value={chosenAnimalId}
              >
                <option value="inget">Välj ett djur</option>
                {animals.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.animalId}
                  </option>
                ))}
              </select>
              <p className="error-message">{formError.animal_id}</p>
            </div>
            <div className="form-group">
              <label htmlFor="kgMilk" className="form-label">
                Mjölk i kg:
              </label>
              <input
                type="text"
                id="kgMilk"
                name="kgMilk"
                className="form-control"
                value={newMilk.kgMilk}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.kgMilk}</p>
            </div>
            <div className="form-group">
              <label htmlFor="milkDate" className="form-label">
                Datum för mjölkning:
              </label>
              <input
                type="datetime-local"
                id="milkDate"
                name="milkDate"
                className="form-control"
                value={newMilk.milkDate}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.milkDate}</p>
            </div>
            <button className="w-50 mt-2" onClick={editData}>Ändra</button>
          </form>
           {/**Messages to form */}
      {showMessage && (
        <p className="alert alert-light text-center mt-2">{showMessage}</p>
      )}
        </div>
      ) : (
        /* form for adding milk */
        <div>
          <form
            className="form-control handleForm form-control-sm border-2 p-5 mx-auto w-50 "
            onSubmit={addMilk}
          >
            <h2>Mjölkning</h2>
            <div className="form-group">
              <label htmlFor="animal_id" className="form-label">
                SE-nummer:
              </label>
              <select
                id="animal_id"
                name="animal_id"
                className="form-control"
                value={chosenAnimalId}
                onChange={changeAnimal}
              >
                <option value="inget">Välj ett djur</option>
                {animals.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.animalId}
                  </option>
                ))}
              </select>
              <p className="error-message">{formError.animal_id}</p>
            </div>
            <div className="form-group">
              <label htmlFor="kgMilk" className="form-label">
                Mjölk i kg:
              </label>
              <input
                type="text"
                id="kgMilk"
                name="kgMilk"
                className="form-control"
                value={newMilk.kgMilk}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.kgMilk}</p>
            </div>
            <div className="form-group">
              <label htmlFor="milkDate" className="form-label">
                Datum för mjölkning:
              </label>
              <input
                type="datetime-local"
                id="milkDate"
                name="milkDate"
                className="form-control"
                value={newMilk.milkDate}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.milkDate}</p>
            </div>
            <button type="submit" className="button w-50 mt-2">
              Lägg till
            </button>
          </form>


          {/*Show messages to form */}
          {showMessage && (
            <p className="alert alert-light text-center mt-2">{showMessage}</p>
          )}
        </div>
      )}
      <h2>Senaste mjölkningarna för:</h2>
      <table className="table table-responsive table-hover">
        <thead>
          <tr>
            <th>Djur-Id</th>
            <th>Mjölkning</th>
            <th>Datum</th>
            <th>Hantera</th>
          </tr>
        </thead>
        <tbody>
          {/**Write milks */}
          {milks.map((milk) => (
            <tr key={milk.id}>
              <td>{milk.animal_id}</td>
              <td>{milk.kgMilk} Kg</td>
              <td>{milk.milkDate}</td>
              <td>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    setEditMilk(true); // Update editMilk-state to true to edit
                    setNewMilk({
                      id: milk.id,
                      kgMilk: milk.kgMilk,
                      milkDate: milk.milkDate,
                      animal_id: milk.animal_id
                    });
                  }}
                >
                  Ändra
                </button>
                {/**Change url when clicking at delete */}
                <button
                  className="btn btn-danger"
                  onClick={() => navigateToMilk(milk.id)}
                >
                  Radera
                </button>
              </td>
            </tr>

          ))}
        </tbody>
      </table>

      {/**Popup for deleating */}
      {show && (
        <div className="modal" role="dialog" style={{ display: "block" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Vill du radera?</h5>
              </div>
              <div className="modal-body">
                Är du säker på att du vill radera medicineringen?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-alert"
                  onClick={() => deleteMilk(chosenMilkId)}
                >
                  Ja
                </button>
                <button
                  type="button"
                  className="btn-alert"
                  onClick={handleClose}
                >
                  Nej
                </button>
              </div>
            </div>
          </div>

        </div>

      )}
    </div>
  );
}
export default Milk;
