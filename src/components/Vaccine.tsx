//import
import DOMPurify from "dompurify";
import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
//structure of vaccine
interface Vaccine {
  id: string;
  batchNo: string;
  name: string;
  date: string;
  animal_id: string;
}

function Vaccine() {
  //token
  const cookies = new Cookies();
  const token = cookies.get("token");
    //use navigate
    const navigate = useNavigate();
   //States
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [chosenAnimalId, setChosenAnimalId] = useState<string>("");
  const [animals, setAnimals] = useState<{ id: string; animalId: string }[]>(
    []
  );
  const [chosenVaccineId, setChosenVaccineId] = useState<string>("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  //States store data
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  //States store data
  const [newVaccine, setNewVaccine] = useState<Vaccine>({
    id: "",
    batchNo: "",
    name: "",
    date: "",
    animal_id: "",
  });
  //State for error store data
  const [formError, setFormError] = useState({
    batchNo: "",
    name: "",
    date: "",
    animal_id: "",
  });
  // Function to clear update and delete messages after a specified time
  const clearMessages = () => {
    //clear messages
    setShowMessage(null);
    setFormError({
      batchNo: "",
      name: "",
      date: "",
      animal_id: "",
    });
  };

  useEffect(() => {
    getAnimals();
    if (chosenAnimalId) {
      getVaccineByAnimals(chosenAnimalId);
    }
  }, [chosenAnimalId]);
  // Handle changes in input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
     //Sanitize value
    const sanitizedData = DOMPurify.sanitize(value);
    setNewVaccine((prevState) => ({
      ...prevState,
      [name]: sanitizedData,
    }));
  };

  //Add vaccine data with fetch
  const addVaccine = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Object to track input errors
    let inputError = {
      batchNo: "",
      name: "",
      date: "",
      animal_id: "",
    };

    //check if all fields empty
    if (
      !newVaccine.batchNo &&
      !newVaccine.name &&
      !newVaccine.date &&
      !chosenAnimalId
    ) { //error messages when empty fields
      setFormError({
        ...inputError,
        animal_id: "Välj ett djur",
        batchNo: "Fyll i ett batchnummer",
        name: "Fyll i namnet på vaccinet",
        date: "Fyll i ett datum",
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

    //Check if batchno empty
    if (!newVaccine.batchNo) {
      setFormError({
        ...inputError,
        batchNo: "Fyll i ett batchnummer",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if name empty
    if (!newVaccine.name) {
      setFormError({
        ...inputError,
        name: "Fyll i namnet på vaccinet",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if date empty
    if (!newVaccine.date) {
      setFormError({
        ...inputError,
        date: "Fyll i ett datum",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }

    //Sanitize input fields with DOMPurify
    const sanitizedBatchNo = DOMPurify.sanitize(newVaccine.batchNo);
    const sanitizedName = DOMPurify.sanitize(newVaccine.name);
    const sanitizedDate = DOMPurify.sanitize(newVaccine.date);
  //Update state with sanitized values
    setNewVaccine({
      id: newVaccine.id,
      batchNo: sanitizedBatchNo,
      name: sanitizedName,
      date: sanitizedDate,
      animal_id: chosenAnimalId,
    });
//fetch (post)
    try {
      const response = await fetch(
        `http://localhost:8000/api/vaccines/animals/${chosenAnimalId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },  //Send with sanitized data
          body: JSON.stringify({
            batchNo: sanitizedBatchNo,
            name: sanitizedName,
            date: sanitizedDate,
            animal_id: chosenAnimalId,
          }),
        }
      );
    //await response
      const responseData = await response.json();
      //if response ok, clear form
      if (response.ok) {
        setNewVaccine({
          id: responseData.id,
          batchNo: "",
          name: "",
          date: "",
          animal_id: chosenAnimalId,
        });
        //get all vaccine from animal
        getVaccineByAnimals(chosenAnimalId);
        //show message
        setShowMessage("Vaccineringen är tillagd");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
      console.log(responseData);
    } catch (error) {
      setShowMessage("Fel vid lagring av vaccinering");
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      console.log(error);
    }
  };
  //Trigger that Shows the last vaccines from the chosen id (animal)
  const changeAnimal = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    //change state after chosen animal
    setChosenAnimalId(value);
  };
  //Gets all vaccines from the animal with fetch
  const getVaccineByAnimals = async (chosenAnimalId: string) => {
    //fetch get
    try {
      const response = await fetch(
        `http://localhost:8000/api/vaccines/animals/${chosenAnimalId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      ); //if response ok, set vaccine
      if (response.ok) {
        const jsonData = await response.json();
        setVaccines(jsonData);
      } else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning av vaccin");
    }
  };
  // Get's all animals with animalId´s and the id:s from the database
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
  //Delete vaccine with Id
  const deleteVaccine = async (chosenVaccineId: string) => {
    //fetch delete
    try {
      const response = await fetch(`http://localhost:8000/api/vaccines/${chosenVaccineId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });//if response ok
      if (response.ok) {
        //get all vaccine from chosen animals
        getVaccineByAnimals(chosenAnimalId)
        //change show to false and show message
        setShow(false);
        setShowMessage("Vaccineringen är raderad");
      } else {
        throw new Error("Vaccineringen kunde inte raderas");
      }
    } catch (error) {
      console.error("Något gick fel:", error);
    }
  };

  //change url and add id
  const navigateToVaccine = (id: string) => {
    //navigate to handle with id from chosen vaccine
    navigate(`/handle/${id}`);
    //change states
    setShow(true);
    //save id
    setChosenVaccineId(id);
  };


  return (
    <div>
        {/*form for adding vaccine*/}
      <form
        className="form-control handleForm form-control-sm border-2 p-5 mx-auto w-50 "
        onSubmit={addVaccine}
        noValidate //The formdata is not automaticallly validated by the browser
      > 
        <h2>Vaccinering</h2>
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
          <label htmlFor="batchNo" className="form-label">
            Batchnummer:
          </label>
          <input
            type="text"
            id="batchNo"
            name="batchNo"
            className="form-control"
            value={newVaccine.batchNo}
            onChange={handleInputChange}
          />
          <p className="error-message">{formError.batchNo}</p>
        </div>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Namn:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={newVaccine.name}
            onChange={handleInputChange}
          />
          <p className="error-message">{formError.name}</p>
        </div>
        <div className="form-group">
          <label htmlFor="date" className="form-label">
            Datum och tid för vaccin:
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            placeholder="yyyy-mm-dd hh-MM"
            className="form-control"
            value={newVaccine.date}
            onChange={handleInputChange}
          />
          <p className="error-message">{formError.date}</p>
        </div>
        <button type="submit" className="button w-50 mt-2">
          Lägg till
        </button>
      </form>
         {/*Show messages to form */}
         {showMessage && (
          <p className="alert alert-light text-center mt-2">{showMessage}</p>
        )}
        {/*Table to write calves*/}
      <h2> Senaste Vaccinationerna för:</h2>
      <table className="table table-responsive table-hover">
        <thead>
          <tr>
            <th>Djur-Id</th>
            <th>Namn</th>
            <th>Batchnummer</th>
            <th>Datum</th>
            <th>Hantera</th>
          </tr>
        </thead>
        <tbody>
           {/**Loop and Write vaccine */}
          {vaccines.map((vaccine) => (
            <tr key={vaccine.id}>
              <td>{vaccine.id}</td>
              <td>{vaccine.name}</td>
              <td>{vaccine.batchNo}</td>
              <td>{vaccine.date}</td>
              <td>
                 {/**Change url when clicking at delete */}
                 <button
                  className="btn btn-danger"
                  onClick={() => navigateToVaccine(vaccine.id)}
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
                Är du säker på att du vill radera kalvningen?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-alert"
                  onClick={() => deleteVaccine(chosenVaccineId)}
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

export default Vaccine;
