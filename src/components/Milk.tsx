//import
import DOMPurify from "dompurify";
import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

//Structure of milk
interface Milk {
  id: string;
  kgMilk: string;
  milkDate: string;
  animal_id: string;
}
//Structure of Herd
interface Herd {
  id: number;
  herdId: string;
  address: string;
  userid: number;
}

function Milk() {
  //Cookies
  const cookies = new Cookies();
  const token = cookies.get("token");
  // Get userid from sessionstorage
  const userid = sessionStorage.getItem("userid");
  //Use navigate
  const navigate = useNavigate();
  //States
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [chosenMilkId, setChosenMilkId] = useState<string>("");
  const [chosenHerdId, setChosenHerdId] = useState<string>("");
  const [herds, setHerds] = useState<Herd[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("AllAnimals");
  const [selectedAnimal, setSelectedAnimal] = useState<string>("");
  //Show/Hide dropdown with Herds
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //Show/Hide Table
  const [showTable, setShowTable] = useState<boolean>(true);
  //Show/ Hide edit milk form
  const [editMilk, setEditMilk] = useState(false);
  const [animals, setAnimals] = useState<any[]>([]);
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
    //Clear messages
    setShowMessage(null);
    setFormError({
      kgMilk: "",
      milkDate: "",
      animal_id: "",
    });
  };
  // Fetch all milks and animals with useEffect
  useEffect(() => {
    getAnimalsByUser(userid);
    fetchHerdsAnimals(userid);
    if (chosenHerdId) {
      getMilksByHerd(chosenHerdId);
    }
    if (selectedAnimal) {
      getMilkByAnimals(selectedAnimal);
    }
  }, [selectedAnimal, userid, chosenHerdId]);

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
    if (!newMilk.kgMilk && !newMilk.milkDate && !selectedAnimal) {
      //error messages when empty fields
      setFormError({
        ...inputError,
        kgMilk: "Fyll i mängden mjölk (kg/mjölk)",
        milkDate: "Fyll i datum för mjölkning",
        animal_id: "Välj djuridentitet",
      });
      // Clear message after 3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if animal_id empty
    if (!selectedAnimal) {
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
      animal_id: selectedAnimal,
    });
    //Fetch post milk for specific animal
    try {
      const response = await fetch(
        `http://localhost:8000/api/milks/animals/${selectedAnimal}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }, //Send sanitized data
          body: JSON.stringify({
            kgMilk: sanitizedKgMilk,
            milkDate: sanitizedMilkDate,
            animal_id: selectedAnimal,
          }),
        }
      ); //Await response
      const responseData = await response.json();
      //if response ok, clear form
      if (response.ok) {
        setNewMilk({
          id: responseData.id,
          kgMilk: "",
          milkDate: "",
          animal_id: selectedAnimal,
        });
        //Get all milk from animal
        getMilkByAnimals(selectedAnimal);
        //Show message
        setShowMessage("Mjölkningen är tillagd");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
      console.log(responseData);
    } catch (error) {
      //Error message
      setShowMessage("Fel vid lagring av mjölkning");
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      console.log(error);
    }
  };

  // Gets all milk from the animal with fetch
  const getMilkByAnimals = async (selectedAnimal: string) => {
    //Fetch get chosen animal
    try {
      const response = await fetch(
        `http://localhost:8000/api/milks/animals/${selectedAnimal}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      ); //If response ok
      if (response.ok) {
        const jsonData = await response.json();
        //Set milks
        setMilks(jsonData);
      } else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning av mjölk");
    }
  };

  // Get all animals by User
  const getAnimalsByUser = async (userid: string | null) => {
    //Fetch get animals by user
    try {
      const response = await fetch(
        `http://localhost:8000/api/animals/users/${userid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      ); //If response ok
      if (response.ok) {
        const jsonData = await response.json();
        //set animal
        setAnimals(jsonData);
      } else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning");
    }
  };
//find animal
  const findAnimalId = (animalId: string) => {
    const animal = animals.find((animal) => animal.id === animalId);
    return animal ? animal.animalId : "Okänt"; // returnera animalId eller "Okänt" om djuret inte hittades
  };

  //Edit input fields in form
  const editData = () => {
    setEditMilk(true);
    setInputData({
      id: newMilk.id,
      kgMilk: newMilk.kgMilk,
      milkDate: newMilk.milkDate,
      animal_id: selectedAnimal,
    });
  };
  //Cancel in edit form
  const goBack = () => {
    setEditMilk(false);
    setNewMilk({
      id: "",
      kgMilk: "",
      milkDate: "",
      animal_id: "",
    });
  };
  //Change the url and add id
  const navigateToMilk = (id: string) => {
    //Navigate to handle with id from chosen medicine
    navigate(`/handle/${id}`);
    //Change states
    setShow(true);
    //Save id
    setChosenMilkId(id);
  };

  //Update milk
  const updateMilk = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { id, kgMilk, milkDate } = inputData;

    // Control if input fields are empty
    if (!newMilk.kgMilk && !newMilk.milkDate && !selectedAnimal) {
      setFormError({
        ...formError,
        kgMilk: "Fyll i mängden mjölk (kg/mjölk)",
        milkDate: "Fyll i datum för mjölkning",
      });
      setTimeout(clearMessages, 3000);
      return;
    }
    // If kgMilk is empty
    if (!newMilk.kgMilk) {
      setFormError({
        ...formError,
        kgMilk: "Fyll i mängden mjölk (kg/mjölk)",
      });
      setTimeout(clearMessages, 3000);
      return;
    }
    // If milkkDate is empty
    if (!newMilk.milkDate) {
      setFormError({
        ...formError,
        milkDate: "Fyll i datum för mjölkning",
      });
      setTimeout(clearMessages, 3000);
      return;
    }
    //Sanitize input
    const sanitizedKgMilk = DOMPurify.sanitize(kgMilk);
    const sanitizedMilkDate = DOMPurify.sanitize(milkDate);
    //Set milk
    setNewMilk({
      id: chosenMilkId,
      kgMilk: sanitizedKgMilk,
      milkDate: sanitizedMilkDate,
      animal_id: selectedAnimal,
    });
    //fetch put for milks
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
        }),
      });
      const responseData = await response.json();
      console.log(responseData);

      //If response ok
      if (response.ok) {
        //Clean input fields
        setNewMilk({
          id: newMilk.id,
          kgMilk: "",
          milkDate: "",
          animal_id: selectedAnimal,
        });
        setShowMessage("Mjölkningen är ändrad");
        //Clear message after 3 seconds
        setTimeout(clearMessages, 3000);
        setEditMilk(false);
        //And if animal is chosen
        if (selectedAnimal) {
          //Write the data of the changed animal in table directly
          getMilkByAnimals(selectedAnimal);
        } else {
          getMilksByHerd(selectedOption);
        }
      } else {
        setShowMessage("Mjölkningen kunde inte ändras");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
    } catch {
      console.error("Något gick fel:");
    }
  };

  // Fetch animals by selected herd (get)
  const getMilksByHerd = async (chosenHerdId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/milks/herds/${chosenHerdId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      //response
      const pickedMilks = await response.json();
      if (response.ok) {
        setMilks(pickedMilks);
        //get errors
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHerdsAnimals = async (userid: string | null) => {
    try {
      setIsLoading(true);
      // Fetch all user herds (get)
      const herdsResponse = await fetch(
        `http://localhost:8000/api/herds/users/${userid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      const herdsData = await herdsResponse.json();
      if (herdsResponse.ok) {
        setHerds(herdsData);
        //If user has one herd, the id of selected herd is set to chosenHerdId
        if (herdsData.length === 1) {
          setChosenHerdId(herdsData[0].id);
        } else {
            target: {
              value: selectedOption
          };
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle select change in select for herds
  const handleSelectChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOptionValue = event.target.value;
    //update after choosen herd
    setSelectedOption(selectedOptionValue);
    // If select liston "AllAnimals", no table shows
    if (selectedOptionValue === "AllAnimals") {
      setShowTable(false);
      // If "AllAnimals" is selected, set animals to all animals
      await fetchHerdsAnimals(userid);
    } else {
      setShowTable(true);
      console.log(selectedOptionValue);
      // Fetch animals by selected herd
      getMilksByHerd(selectedOptionValue);
    }
  };
  //Delete Milk with id
  const deleteMilk = async (id: string) => {
    //Fetch delete
    try {
      const response = await fetch(`http://localhost:8000/api/milks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }); //If response ok
      if (response.ok) {
        //And if animal is chosen
        if (selectedAnimal) {
          //Get all milks from animal
          getMilkByAnimals(selectedAnimal);
          //If no animal chosen, get all milks by selected herd
        } else {
          getMilksByHerd(selectedOption);
        }
        //Change show to false and show message
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
      {/*Form for changing milk*/}
      {editMilk ? (
        <div>
          <form
            className="form-control handleForm form-control-sm shadow-sm border-dark p-5 mx-auto"
            onSubmit={(e) => updateMilk(e)}
            noValidate
          >
            <h2 className="py-3">Ändra mjölkning</h2>
            <div key={newMilk.id} className="form-group">
              <label htmlFor="animal_id" className="form-label">
                Djuridentitet:
              </label>
              <select
                id="animal_id"
                name="animal_id"
                className="form-select form-select-sm shadow-sm border-dark"
                value={selectedAnimal}
                disabled
              >
                <option value="">
                  Välj ett djur
                </option>
                {animals.map((animal) => (
          <option key={animal.id} value={animal.id}>
            {findAnimalId(animal.id)} {/* Använd findAnimalId för att hitta animalId baserat på animal_id */}
          </option>
                ))}
              </select>
              <p className="error-message text-danger fw-bold">
                {formError.animal_id}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="kgMilk" className="form-label">
                Mjölk i kg:
              </label>
              <input
                type="text"
                id="kgMilk"
                name="kgMilk"
                className="form-control form-control-sm border-dark"
                value={newMilk.kgMilk}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.kgMilk}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="milkDate" className="form-label">
                Datum för mjölkning:
              </label>
              <input
                type="datetime-local"
                id="milkDate"
                name="milkDate"
                className="form-control form-control-sm border-dark"
                value={newMilk.milkDate}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.milkDate}
              </p>
            </div>
            <div className="form-btn-div d-flex justify-content-around">
              <button className="button shadow-sm mt-2" onClick={editData}>
                Spara ändringar
              </button>
              <button className="button shadow-sm mt-2" onClick={goBack}>
                Avbryt
              </button>
            </div>
          </form>
          {/**Messages to form */}
        </div>
      ) : (
        /* form for adding milk */
        <div>
          <form
            className="form-control handleForm form-control-sm shadow-sm border-dark p-5 mx-auto "
            onSubmit={addMilk}
            noValidate
          >
            <h2 className="py-3">Lägg till mjölkning</h2>
            <div className="form-group">
              <label htmlFor="animal_id" className="form-label">
                Djuridentitet
              </label>
              <select
                id="animal_id"
                name="animal_id"
                className="form-control form-select-sm border-dark"
                onChange={(e) => setSelectedAnimal(e.target.value)}
                value={selectedAnimal}
              >
                <option disabled value="">
                  Välj ett djur
                </option>
                {animals.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.animalId}
                  </option>
                ))}
              </select>
              <p className="error-message text-danger fw-bold">
                {formError.animal_id}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="kgMilk" className="form-label">
                Mjölk i kg:
              </label>
              <input
                type="text"
                id="kgMilk"
                name="kgMilk"
                className="form-control form-control-sm border-dark"
                value={newMilk.kgMilk}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.kgMilk}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="milkDate" className="form-label">
                Datum för mjölkning:
              </label>
              <input
                type="datetime-local"
                id="milkDate"
                name="milkDate"
                className="form-control form-control-sm  border-dark"
                value={newMilk.milkDate}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.milkDate}
              </p>
            </div>
            <button type="submit" className="button mt-2">
              Lägg till
            </button>
          </form>

          {/*Show messages to form */}
          {showMessage && (
            <p className="alert mx-auto alert-success text-dark text-center mt-2">
              {showMessage}
            </p>
          )}
        </div>
      )}
      {/* This shows if user has more than one herd */}
      {!isLoading && herds.length > 1 && (
        <div>
          <form className="fit-content-width form-control-sm mx-auto">
            <div className="form-group w-75 mx-auto m-3">
              <label className="form-label" htmlFor="herds">
                Besättningar:
              </label>
              <br />
              <select
                id="herds"
                name="herds"
                className="form-select border-dark"
                onChange={handleSelectChange}
                value={selectedOption}
              >
                <option disabled value="AllAnimals">
                  Välj en besättning
                </option>
                {herds.map((herd) => (
                  <option key={herd.id} value={herd.id}>
                    Besättning: {herd.herdId}, {herd.address}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>
      )}
      {/* This shows if there is no milk registrated in any animal in herd */}
      {(showTable && milks.length < 1) || selectedAnimal == "0" ? (
        <p>Ingen information finns registrerad</p>
      ) : (
        /* Else show table with milks */
        <div>
          <h2 className="p-3 mx-auto">Senaste mjölkningarna: </h2>
          <table className="table table-responsive-sm table-hover w-75 mx-auto">
            <thead className= "d-sm-table-header-group">
              <tr>
                <th>Djuridentitet</th>
                <th>Mjölkning</th>
                <th>Datum</th>
                <th>Hantera</th>
              </tr>
            </thead>
            <tbody>
              {/**Write milks */}
              {milks.map((milk) => {
                //Get milk that matches animal_id in database
                const animal = animals.find(
                  (animal) => animal.id === milk.animal_id
                );
                return (
                  <tr key={milk.id}>
                    {/* Ternary operator */}
                    {/* Display block for mobile */}                   
                     <td className="d-block d-sm-none td-handle" data-label="Djuridentitet">{animal ? animal.animalId : "Okänt"}</td>
                    <td className="d-block d-sm-none" data-label="Kg">{milk.kgMilk}</td>
                    <td className="d-block d-sm-none" data-label="Datum & tid">{milk.milkDate}</td>
                    <td className="d-block d-sm-none" data-label="Hantera"> <button
                        className="button"
                        onClick={() => {
                          setEditMilk(true); // Update editMilk-state to true to edit
                          setNewMilk({
                            id: milk.id,
                            kgMilk: milk.kgMilk,
                            milkDate: milk.milkDate,
                            animal_id: milk.animal_id,
                          });
                        }}
                      >
                        Ändra
                      </button>
                      {/**Change url when clicking at delete */}
                      <button
                        className="button"
                        onClick={() => navigateToMilk(milk.id)}>
                        Radera
                      </button></td>
                    
                   {/* Table for desktop */}
                   <td className="d-none d-sm-table-cell" data-label="Djuridentitet">{animal ? animal.animalId : "Okänt"}</td>
                    <td className="d-none d-sm-table-cell" data-label="Kg">{milk.kgMilk}</td>
                    <td className="d-none d-sm-table-cell" data-label="Datum & tid">{milk.milkDate}</td>
                    <td className="d-none d-sm-table-cell" data-label="Hantera">
                      <button
                        className="button"
                        onClick={() => {
                          setEditMilk(true); // Update editMilk-state to true to edit
                          setNewMilk({
                            id: milk.id,
                            kgMilk: milk.kgMilk,
                            milkDate: milk.milkDate,
                            animal_id: milk.animal_id,
                          });
                        }}
                      >
                        Ändra
                      </button>
                      {/**Change url when clicking at delete */}
                      <button
                        className="button"
                        onClick={() => navigateToMilk(milk.id)}>
                        Radera
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {/**Popup for deleting */}
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
