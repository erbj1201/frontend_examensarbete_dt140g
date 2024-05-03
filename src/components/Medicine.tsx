//import
import DOMPurify from "dompurify";
import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

//structure of medicine
interface Medicine {
  id: string;
  date: string;
  type: string;
  amount: string;
  recurrent: string;
  animal_id: string;
}

function Medicine() {
  //cookies
  const cookies = new Cookies();
  const token = cookies.get("token");
  //use navigate
  const navigate = useNavigate();
  //States
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [chosenAnimalId, setChosenAnimalId] = useState<string>("");
  const [chosenMedicineId, setChosenMedicinelId] = useState<string>("");
  const [editMedicine, setEditMedicine] = useState(false);
  const [animals, setAnimals] = useState<{ id: string; animalId: string }[]>(
    []
  );
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  //States store data
  const [newMedicine, setNewMedicine] = useState<Medicine>({
    id: "",
    date: "",
    type: "",
    amount: "",
    recurrent: "",
    animal_id: "",
  });
  // state data in edit form
  const [inputData, setInputData] = useState({
    id: "",
    date: "",
    type: "",
    amount: "",
    recurrent: "",
    animal_id: "",
  }
  );

  //State for error store data
  const [formError, setFormError] = useState({
    date: "",
    type: "",
    amount: "",
    recurrent: "",
    animal_id: "",
  });
  // Function to clear update and delete messages after a specified time
  const clearMessages = () => {
    //clear messages
    setShowMessage(null);
    setFormError({
      date: "",
      type: "",
      amount: "",
      recurrent: "",
      animal_id: "",
    });
  };
  // Fetch all medicines and animals with useEffect
  useEffect(() => {
    //getAnimals
    getAnimals();
    if (chosenAnimalId) {
      getMedicinesByAnimals(chosenAnimalId);
    }
  }, [chosenAnimalId]);

  //Handle changes in the input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    //Sanitize value
    const sanitizedData = DOMPurify.sanitize(value);
    setNewMedicine((prevState) => ({
      ...prevState,
      [name]: sanitizedData,
    }));
  }

  //Add Medicine data with fetch
  const addMedicine = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Object to track input errors
    let inputError = {
      date: "",
      type: "",
      amount: "",
      recurrent: "",
      animal_id: "",
    };
    //check if all fields empty
    if (
      !newMedicine.date &&
      !newMedicine.type &&
      !newMedicine.amount &&
      !newMedicine.recurrent &&
      !chosenAnimalId
    ) { //error messages when empty fields
      setFormError({
        ...inputError,
        animal_id: "Välj ett djur",
        date: "Fyll i datum och tid",
        type: "Fyll i typ av medicin",
        amount: "Fyll i medicinens mängd/dos",
        recurrent: "Fyll i om medicineringen är återkommande eller inte",
      });
      // Clear message after  3 seconds
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
    if (!newMedicine.date) {
      setFormError({
        ...inputError,
        date: "Fyll i datum och tid",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if type empty
    if (!newMedicine.type) {
      setFormError({
        ...inputError,
        type: "Fyll i typ av medicin",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if amount empty
    if (!newMedicine.amount) {
      setFormError({
        ...inputError,
        amount: "Fyll i medicinens mängd/dos",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }

    if (!newMedicine.recurrent) {
      setFormError({
        ...inputError,
        recurrent: "Fyll i om medicineringen är återkommande eller inte",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }

    //Sanitize input fields with DOMPurify
    const sanitizedDate = DOMPurify.sanitize(newMedicine.date);
    const sanitizedType = DOMPurify.sanitize(newMedicine.type);
    const sanitizedAmount = DOMPurify.sanitize(newMedicine.amount);

    //Update state with sanitized values
    setNewMedicine({
      id: newMedicine.id,
      date: sanitizedDate,
      type: sanitizedType,
      amount: sanitizedAmount,
      recurrent: newMedicine.recurrent,
      animal_id: chosenAnimalId,
    });
    //fetch post
    try {
      const response = await fetch(
        `http://localhost:8000/api/medicines/animals/${chosenAnimalId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }, //send sanitized data
          body: JSON.stringify({
            date: sanitizedDate,
            type: sanitizedType,
            amount: sanitizedAmount,
            recurrent: newMedicine.recurrent,
            animal_id: chosenAnimalId,
          }),
        }
      );
      //await response
      const responseData = await response.json();
      //if response ok, clear form
      if (response.ok) {
        setNewMedicine({
          id: responseData.id,
          date: "",
          type: "",
          amount: "",
          recurrent: "",
          animal_id: chosenAnimalId,
        });
        //get all medicine from chosen animal
        getMedicinesByAnimals(chosenAnimalId);
        //show message
        setShowMessage("Medicineringen är tillagd");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
      console.log(responseData);
    } catch (error) {
      //error message
      setShowMessage("Fel vid lagring av medicinering");
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      console.log(error);
    }
  };

  //Trigger that shows the last medicines from the chosen id (animal).
  const changeAnimal = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    //set chosen animal
    setChosenAnimalId(value);
  };
  // Gets all medicine from the animal with fetch
  const getMedicinesByAnimals = async (chosenAnimalId: string) => {
    //fetch get
    try {
      const response = await fetch(
        `http://localhost:8000/api/medicines/animals/${chosenAnimalId}`,
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
        //set medicines
        setMedicines(jsonData);
      } else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning av medicinering");
    }
  };
  // Get all animals with their animalId´s and id:s from the database
  const getAnimals = async () => {
  
    //fetch get
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
    setEditMedicine(true);
    setInputData({
      id: newMedicine.id,
      date: newMedicine.date,
      type: newMedicine.type,
      amount: newMedicine.amount,
      recurrent: newMedicine.recurrent,
      animal_id: chosenAnimalId,
    });
  };

  const goBack = () => {
    setEditMedicine(false);
    setNewMedicine({
    id: "",
    date: "",
    type: "",
    amount: "",
    recurrent: "",
    animal_id: "",
  });
};

  //change url and add id
  const navigateToMedicine = (id: string) => {
    //navigate to handle with id from chosen medicine
    navigate(`/handle/${id}`);
    //change states
    setShow(true);
    //save id
    setChosenMedicinelId(id);
  };

  const updateMedicine = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Sanitize input fields
    const { id, date, type, amount, recurrent } = inputData;
    const sanitizedDate = DOMPurify.sanitize(date);
    const sanitizedType = DOMPurify.sanitize(type);
    const sanitizedAmount = DOMPurify.sanitize(amount);
    const sanitizedRecurrent = DOMPurify.sanitize(recurrent);

    // Control if input fields are empty 
    if (!sanitizedDate) {
      setFormError({
        ...formError,
        date: "Fyll i datum och tid",
      });
      setTimeout(clearMessages, 3000);
      return;
    }

    if (!sanitizedType) {
      setFormError({
        ...formError,
        type: "Fyll i typ av medicin",
      });
      setTimeout(clearMessages, 3000);
      return;
    }

    if (!sanitizedAmount) {
      setFormError({
        ...formError,
        amount: "Fyll i medicinens mängd/dos",
      });
      setTimeout(clearMessages, 3000);
      return;
    }

    if (!sanitizedRecurrent) {
      setFormError({
        ...formError,
        recurrent: "Fyll i om medicineringen är återkommande eller inte",
      });
      setTimeout(clearMessages, 3000);
      return;
    }
    setNewMedicine({
      id: chosenMedicineId,
      date: sanitizedDate,
      type: sanitizedType,
      amount: sanitizedAmount,
      recurrent: sanitizedRecurrent,
      animal_id: chosenAnimalId
    })
    try {
      const response = await fetch(`http://localhost:8000/api/medicines/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          date: sanitizedDate,
          type: sanitizedType,
          amount: sanitizedAmount,
          recurrent: sanitizedRecurrent,
        })
      });
      if (response.ok) {
        //Clean input fields
        setNewMedicine({
          id: newMedicine.id,
          date: "",
          type: "",
          amount: "",
          recurrent: "",
          animal_id: chosenAnimalId
        })
        //get all medicine from animal
        getMedicinesByAnimals(chosenAnimalId);
        setShowMessage("Ändringarna är sparade");
        //Clear message after 3 seconds
        setTimeout(clearMessages, 3000);
        setEditMedicine(false);
      }
      else {
        setShowMessage("Medicinen kunde inte ändras");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
    } catch {
      console.error("Något gick fel:");
    }
  }

  //Delete Milk with id
  const deleteMedicine = async (chosenMedicineId: string) => {
    //fetch (delete)
    try {
      const response = await fetch(
        `http://localhost:8000/api/medicines/${chosenMedicineId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      ); //if response ok
      if (response.ok) {
        //get all medicine from animal
        getMedicinesByAnimals(chosenAnimalId);
        //change show to false and show message
        setShow(false);
        setShowMessage("Medicineringen är raderad");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      } else {
        setShowMessage("Medicineringen kunde inte raderas");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
    } catch (error) {
      console.error("Något gick fel:", error);
    }
  };

  return (
    <div>
      {/* Boolean, if Edit medicine = true, show Edit form. Else show form form add medicine*/}
      {/* Form for chaging medicine */}
      {editMedicine ? (
        <div>
          <form className="form-control form-control-sm handleForm border border-dark shadow mx-auto"
            onSubmit={(e) => updateMedicine(e)}
            noValidate>
            <h2>Ändra Medicinering</h2>
            <div className="form-group">
              <label htmlFor="animal_id" className="form-label">
                SE-nummer:
              </label>
              <select
                id="animal_id"
                name="animal_id"
                className="form-select form-select-sm shadow-sm border-dark"
                value={chosenAnimalId}
                onChange={changeAnimal}
              >
                <option value="">Välj ett djur</option>
                {animals.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.animalId}
                  </option>
                ))}
              </select>
              <p className="error-message">{formError.animal_id}</p>
            </div>
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Datum och tid för medicinering:
              </label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                className="form-control form-select-sm shadow-sm border-dark"
                value={newMedicine.date}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.date}</p>
            </div>
            <div className="form-group">
              <label htmlFor="type" className="form-label">
                Typ av medicin:
              </label>
              <input
                type="text"
                id="type"
                name="type"
                className="form-control form-control-sm shadow-sm border-dark"
                value={newMedicine.type}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.type}</p>
            </div>
            <div className="form-group">
              <label htmlFor="amount" className="form-label">
                Mängd/dos av medicin:
              </label>
              <input
                type="text"
                id="amount"
                name="amount"
                className="form-control form-control-sm  shadow-sm border-dark"
                value={newMedicine.amount}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.amount}</p>
            </div>
            <div className="form-group">
            <label htmlFor="recurrent" className="form-label">
            Ska medicineringen återkomma?
            </label>
            <select
              id="recurrent"
              name="recurrent"
              className="form-select form-control-sm shadow-sm border-dark"
              value={newMedicine.recurrent}
              onChange={handleInputChange}>
                
              <option value="1">Ja</option>
              <option value="0">Nej</option>
            </select>
          </div>
          
            <p className="error-message">{formError.recurrent}</p>
            <button className="button shadow-sm w-50 mt-2" onClick={editData}>
              Ändra
            </button>
            <button className="button shadow-sm w-50 mt-2" onClick={goBack}>
             Avbryt
            </button>
          </form>
          {/**Messages to form */}
          {showMessage && (
            <p className="alert alert-light text-center mt-2">{showMessage}</p>
          )}
        </div>
      ) : (
        /*form for adding medicine*/
        <div>
          <form
            className="form-control handleForm form-control-sm border border-dark shadow mx-auto"
            onSubmit={addMedicine}
            noValidate
          >
            <h2>Medicinering</h2>
            <div className="form-group">
              <label htmlFor="animal_id" className="form-label">
                SE-nummer:
              </label>
              <select
                id="animal_id"
                name="animal_id"
                className="form-select form-select-sm shadow-sm border-dark"
                value={chosenAnimalId}
                onChange={changeAnimal}
              >
                <option value="">Välj ett djur</option>
                {animals.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.animalId}
                  </option>
                ))}
              </select>
              <p className="error-message">{formError.animal_id}</p>
            </div>
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Datum och tid för medicinering:
              </label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                className="form-control form-control-sm shadow-sm border-dark"
                value={newMedicine.date}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.date}</p>
            </div>
            <div className="form-group">
              <label htmlFor="type" className="form-label">
                Typ av medicin:
              </label>
              <input
                type="text"
                id="type"
                name="type"
                className="form-control form-control-sm shadow-sm border-dark"
                value={newMedicine.type}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.type}</p>
            </div>
            <div className="form-group">
              <label htmlFor="amount" className="form-label">
                Mängd/dos av medicin:
              </label>
              <input
                type="text"
                id="amount"
                name="amount"
                className="form-control form-control-sm shadow-sm border-dark"
                value={newMedicine.amount}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.amount}</p>
            </div>
            <div className="form-group">
              <label htmlFor="recurrent" className="form-label">
              Ska medicineringen återkomma?
              </label>
              <select
                id="recurrent"
                name="recurrent"
                className="form-select form-select-sm shadow-sm border-dark"
                value={newMedicine.recurrent}
                onChange={handleInputChange}>
                  <option disabled value="">Välj ja/nej</option>
                <option value="1">Ja</option>
                <option value="0">Nej</option>
              </select>
            </div>
            <p className="error-message">{formError.recurrent}</p>
            <button type="submit" className="button shadow-sm w-50 mt-2">
              Lägg till
            </button>
          </form>

          {/**Messages to form */}
          {showMessage && (
            <p className="alert alert-light text-center mt-2">{showMessage}</p>
          )}
        </div>
      )}
      <h2 className="p-5 mx-auto">Senaste medicineringarna för valt djur:</h2>
      <table className="table table-responsive table-hover w-75 mx-auto">
        <thead>
          <tr>
            <th>Djur-Id</th>
            <th>Datum & tid</th>
            <th>Medicintyp</th>
            <th>Mängd</th>
            <th>Återkommande</th>
            <th>Hantera</th>
          </tr>
        </thead>
        <tbody>
          {/**Write medicines */}
          {medicines.map((medicine) => (
            <tr key={medicine.id}>
              <td>{medicine.animal_id}</td>
              <td>{medicine.date}</td>
              <td>{medicine.type}</td>
              <td>{medicine.amount}</td>
              {/**Check if medicine.recurrent is true or false */}
              <td>{medicine.recurrent ? "Ja" : "Nej"}</td>
              <td>
                <button
                  className="button"
                  onClick={() => {
                    setEditMedicine(true); // Update editMilk-state to true to edit
                    setNewMedicine({
                      id: medicine.id,
                      date: medicine.date,
                      type: medicine.type,
                      amount: medicine.amount,
                      recurrent: medicine.recurrent,
                      animal_id: medicine.animal_id
                    });
                  }}
                >
                  Ändra
                </button>
                {/**Change url when clicking at delete */}
                <button
                  className="button shadow-sm"
                  onClick={() => navigateToMedicine(medicine.id)}
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
                  onClick={() => deleteMedicine(chosenMedicineId)}
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
export default Medicine;
