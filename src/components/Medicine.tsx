//import
import DOMPurify from "dompurify";
import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

//Structure of medicine
interface Medicine {
  id: string;
  date: string;
  type: string;
  amount: string;
  recurrent: string;
  animal_id: string;
}
//Structure of Herd
interface Herd {
  id: number;
  herdId: string;
  address: string;
  userid: number;
}

function Medicine() {
  //Cookies
  const cookies = new Cookies();
  const token = cookies.get("token");
  //Use navigate
  const navigate = useNavigate();
  // Get userid from sessionstorage
  const userid = sessionStorage.getItem("userid");
  //States
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [chosenAnimalId, setChosenAnimalId] = useState<string>("");
  const [chosenMedicineId, setChosenMedicinelId] = useState<string>("");
  const [chosenHerdId, setChosenHerdId] = useState<string>("");
  const [herds, setHerds] = useState<Herd[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("AllAnimals");
  const [selectedAnimal, setSelectedAnimal] = useState<string>("");
  //Show/Hide dropdown with Herds
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //Show/Hide Table
  const [showTable, setShowTable] = useState<boolean>(true);
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
  // State data in edit form
  const [inputData, setInputData] = useState({
    id: "",
    date: "",
    type: "",
    amount: "",
    recurrent: "",
    animal_id: "",
  });

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
    //Clear messages
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
    getAnimalsByUser(userid);
    fetchHerdsAnimals(userid);
    if (chosenHerdId) {
      getMedicinesByHerd(chosenHerdId);
    }
    if (selectedAnimal) {
      getMedicinesByAnimals(selectedAnimal);
    }
  }, [selectedAnimal, userid, chosenHerdId]);

  //Handle changes in the input field
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    //Sanitize value
    const sanitizedData = DOMPurify.sanitize(value);
    setNewMedicine((prevState) => ({
      ...prevState,
      [name]: sanitizedData,
    }));
  };

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
    //Check if all fields empty
    if (
      !newMedicine.date &&
      !newMedicine.type &&
      !newMedicine.amount &&
      !newMedicine.recurrent &&
      !selectedAnimal
    ) {
      //Error messages when empty fields
      setFormError({
        ...inputError,
        animal_id: "Välj djuridentitet",
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
    if (!selectedAnimal) {
      setFormError({
        ...inputError,
        animal_id: "Välj djuridentitet",
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
      animal_id: selectedAnimal,
    });
    //Fetch post
    try {
      const response = await fetch(
        `http://localhost:8000/api/medicines/animals/${selectedAnimal}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }, //Send sanitized data
          body: JSON.stringify({
            date: sanitizedDate,
            type: sanitizedType,
            amount: sanitizedAmount,
            recurrent: newMedicine.recurrent,
            animal_id: selectedAnimal,
          }),
        }
      );
      //Await response
      const responseData = await response.json();
      //if response ok, clear form
      if (response.ok) {
        setNewMedicine({
          id: responseData.id,
          date: "",
          type: "",
          amount: "",
          recurrent: "",
          animal_id: selectedAnimal,
        });
        //Get all medicine from chosen animal
        getMedicinesByAnimals(selectedAnimal);
        //Show message
        setShowMessage("Medicineringen är tillagd");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
      console.log(responseData);
    } catch (error) {
      //Error message
      setShowMessage("Fel vid lagring av medicinering");
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      console.log(error);
    }
  };

  //Trigger that shows the last medicines from the chosen id (animal).
  const changeAnimal = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    //Set chosen animal
    setSelectedAnimal(value);
  };
  // Gets all medicine from the animal with fetch
  const getMedicinesByAnimals = async (chosenAnimalId: string) => {
    //Fetch (get medicine)
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
      ); //If response ok
      if (response.ok) {
        const jsonData = await response.json();
        //Set medicines
        setMedicines(jsonData);
      } else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning av medicinering");
    }
  };
  // Get all animals by User
  const getAnimalsByUser = async (userid: string | null) => {
    //Fetch (get animals)
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
        //Map function to transform objects in the array.
        const animalIds = jsonData.map((animal: any) => ({
          id: animal.id,
          animalId: animal.animalId,
        })); //Set animal
        setAnimals(animalIds);
      } else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning");
    }
  };
  //Edit input fields in form
  const editData = () => {
    setEditMedicine(true);
    setInputData({
      id: newMedicine.id,
      date: newMedicine.date,
      type: newMedicine.type,
      amount: newMedicine.amount,
      recurrent: newMedicine.recurrent,
      animal_id: selectedAnimal,
    });
  };
//Cancel 
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

  //Change url and add id
  const navigateToMedicine = (id: string) => {
    //Navigate to handle with id from chosen medicine
    navigate(`/handle/${id}`);
    //Change states
    setShow(true);
    //Save id
    setChosenMedicinelId(id);
  };

  const updateMedicine = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    // Control if input fields are empty
    if (
      !newMedicine.date &&
      !newMedicine.type &&
      newMedicine.amount &&
      !newMedicine.recurrent
    ) {
      setFormError({
        ...formError,
        date: "Fyll i datum och tid",
        type: "Fyll i typ av medicin",
        amount: "Fyll i medicinens mängd/dos",
        recurrent: "Fyll i om medicineringen är återkommande eller inte",
      });
      setTimeout(clearMessages, 3000);
      return;
    }

    if (!newMedicine.date) {
      setFormError({
        ...formError,
        date: "Fyll i datum och tid",
      });
      setTimeout(clearMessages, 3000);
      return;
    }

    if (!newMedicine.type) {
      setFormError({
        ...formError,
        type: "Fyll i typ av medicin",
      });
      setTimeout(clearMessages, 3000);
      return;
    }

    if (!newMedicine.amount) {
      setFormError({
        ...formError,
        amount: "Fyll i medicinens mängd/dos",
      });
      setTimeout(clearMessages, 3000);
      return;
    }

    if (!newMedicine.recurrent) {
      setFormError({
        ...formError,
        recurrent: "Fyll i om medicineringen är återkommande eller inte",
      });
      setTimeout(clearMessages, 3000);
      return;
    }
    //Sanitize input fields
    const { id, date, type, amount, recurrent } = inputData;
    const sanitizedDate = DOMPurify.sanitize(date);
    const sanitizedType = DOMPurify.sanitize(type);
    const sanitizedAmount = DOMPurify.sanitize(amount);
    const sanitizedRecurrent = DOMPurify.sanitize(recurrent);

    setNewMedicine({
      id: chosenMedicineId,
      date: sanitizedDate,
      type: sanitizedType,
      amount: sanitizedAmount,
      recurrent: sanitizedRecurrent,
      animal_id: selectedAnimal,
    }); // fetch (post medicines)
    try {
      const response = await fetch(
        `http://localhost:8000/api/medicines/${id}`,
        {
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
          }),
        }
      ); //If response ok
      if (response.ok) {
        //Clean input fields
        setNewMedicine({
          id: newMedicine.id,
          date: "",
          type: "",
          amount: "",
          recurrent: "",
          animal_id: selectedAnimal,
        });
        setShowMessage("Medicineringen är ändrad");
        //Clear message after 3 seconds
        setTimeout(clearMessages, 3000);
        setEditMedicine(false);
         //And if animal is chosen
         if (selectedAnimal) {
          //Write the data of the changed animal in table directly
          getMedicinesByAnimals(selectedAnimal);
        } else {
          getMedicinesByHerd(selectedOption);
        }
      } else {
        setShowMessage("Medicineringen kunde inte ändras");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
    } catch {
      console.error("Något gick fel:");
    }
  };

    // Fetch animals by selected herd (get)
    const getMedicinesByHerd = async (chosenHerdId: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/medicines/herds/${chosenHerdId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        //Response
        const pickedMedicines = await response.json();
        if (response.ok) {
          setMedicines(pickedMedicines);
          //Get errors
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
            const event = {
              target: {
                value: selectedOption,
              },
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
    //Update after choosen herd
    setSelectedOption(selectedOptionValue);
    // If select liston "AllAnimals", no table shows
    if (selectedOptionValue === "AllAnimals") {
      setShowTable(false);
      // If "AllAnimals" is selected, set animals to all animals
      await fetchHerdsAnimals(userid);
    } else {
      setShowTable(true);
      // Fetch animals by selected herd
      getMedicinesByHerd(selectedOptionValue);
    }
  };

  //Delete Medicine with id
  const deleteMedicine = async (chosenMedicineId: string) => {
    //Fetch (delete medicine)
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
      ); //If response ok
      if (response.ok) {
        //And if animal is chosen
        if (selectedAnimal) {
        //Get all medicine from animal
        getMedicinesByAnimals(selectedAnimal);
      } else {
        getMedicinesByHerd(selectedOption);
      }
        //Change show to false and show message
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
      {/* Form for changing medicine */}
      {editMedicine ? (
        <div>
          <form
            className="form-control form-control-sm handleForm border border-dark shadow mx-auto"
            onSubmit={(e) => updateMedicine(e)}
            noValidate
          >
            <h2 className="py-3">Ändra medicinering</h2>
            <div className="form-group">
              <label htmlFor="animal_id" className="form-label">
                Djuridentitet:
              </label>
              <select
                id="animal_id"
                name="animal_id"
                className="form-select form-select-sm shadow-sm border-dark"
                value={chosenAnimalId}
              >
                <option value="">Välj ett djur</option>
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
              <p className="error-message text-danger fw-bold">
                {formError.date}
              </p>
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
              <p className="error-message text-danger fw-bold">
                {formError.type}
              </p>
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
              <p className="error-message text-danger fw-bold">
                {formError.amount}
              </p>
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
                onChange={handleInputChange}
              >
                <option value="1">Ja</option>
                <option value="0">Nej</option>
              </select>
              <p className="error-message text-danger fw-bold">
                {formError.recurrent}
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
          {showMessage && (
            <p className="alert mx-auto alert-success text-dark w-25 text-center mt-2">
              {showMessage}
            </p>
          )}
        </div>
      ) : (
        /*Form for adding medicine*/
        <div>
          <form
            className="form-control handleForm form-control-sm border border-dark shadow mx-auto"
            onSubmit={addMedicine}
            noValidate
          >
            <h2 className="py-3">Lägg till medicinering</h2>
            <div className="form-group">
              <label htmlFor="animal_id" className="form-label">
                Djuridentitet:
              </label>
              <select
                id="animal_id"
                name="animal_id"
                className="form-select form-select-sm shadow-sm border-dark"
                value= {selectedAnimal}
                onChange={(e) => setSelectedAnimal(e.target.value)}
              >
                <option value="">Välj ett djur</option>
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
              <p className="error-message text-danger fw-bold">
                {formError.date}
              </p>
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
              <p className="error-message text-danger fw-bold">
                {formError.type}
              </p>
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
              <p className="error-message text-danger fw-bold">
                {formError.amount}
              </p>
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
                onChange={handleInputChange}
              >
                <option disabled value="">
                  Välj ja/nej
                </option>
                <option value="1">Ja</option>
                <option value="0">Nej</option>
              </select>
              <p className="error-message text-danger fw-bold">
                {formError.recurrent}
              </p>
            </div>
            <button type="submit" className="button shadow-sm mt-2">
              Lägg till
            </button>
          </form>

          {/**Messages to form */}
          {showMessage && (
            <p className="alert mx-auto alert-success text-dark w-25 text-center mt-2">
              {showMessage}
            </p>
          )}
        </div>
      )}
 {/* Shows if user has more than one herd */}
 {!isLoading && herds.length > 1 && (
        <div>
          <form className="form-control form-control-sm border-0 mx-auto">
            <div className="form-group mx-auto">
              <label className="form-label" htmlFor="herds">
                Besättningar:
              </label>
              <br />
              <select
                id="herds"
                name="herds"
                className="form-select w-25 shadow-sm border-dark"
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
      {/* Shows if there is no medicine registrated in any animal in herd */}
      {(showTable && medicines.length < 1) || chosenAnimalId == "0" ? (
        <p>Ingen information finns registrerad</p>
      ) : (
         /* Else show table with medicines */
        <div>
      <h2 className="p-5 mx-auto">Senaste medicineringarna för valt djur:</h2>
      <table className="table table-responsive table-hover w-75 mx-auto">
        <thead>
          <tr>
            <th>Djuridentitet</th>
            <th>Datum & tid</th>
            <th>Medicintyp</th>
            <th>Mängd</th>
            <th>Återkommande</th>
            <th>Hantera</th>
          </tr>
        </thead>
        <tbody>
          {/**Write medicines */}
          {medicines.map((medicine) => {
              //Get medicine that matches animal_id in database
             const animal = animals.find(
              (animal) => animal.id === medicine.animal_id
            );
            return (
  <tr key={medicine.id}>
        <td>{animal ? animal.animalId : "Okänt"}</td>
    <td>{medicine.date}</td>
    <td>{medicine.type}</td>
    <td>{medicine.amount}</td>
    {/**Check if medicine.recurrent is true or false */}
    <td>{medicine.recurrent ? "Ja" : "Nej"}</td>
    <td>
      <button
        className="button"
        onClick={() => {
          setEditMedicine(true); // Update editMedicine-state to true to edit
          setNewMedicine({
            id: medicine.id,
            date: medicine.date,
            type: medicine.type,
            amount: medicine.amount,
            recurrent: medicine.recurrent,
            animal_id: medicine.animal_id,
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
