/* Webbutvecklingsprogrammet
Självständigt arbete DT140G
Erika Vestin & Sofia Dahlberg */
/*Vaccine component*/
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

interface Herd {
  id: number;
  herdId: string;
  address: string;
  userid: number;
}

function Vaccine() {
  //token
  const cookies = new Cookies();
  const token = cookies.get("token");
   // Get userid from sessionstorage
   const userid = sessionStorage.getItem("userid");
  //use navigate
  const navigate = useNavigate();
  //States
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [chosenVaccineId, setChosenVaccineId] = useState<string>("");
  const [chosenHerdId, setChosenHerdId] = useState<string>("");
  const [herds, setHerds] = useState<Herd[]>([]); 
  const [selectedOption, setSelectedOption] = useState<string>("AllAnimals");
  const [selectedAnimal, setSelectedAnimal] = useState<string>("");
   //Show/Hide dropdown with Herds
  const [isLoading, setIsLoading] = useState<boolean>(false);
   //Show/Hide Table
  const [showTable, setShowTable] = useState<boolean>(true);
  const [editVaccine, setEditVaccine] = useState(false);
  const [animals, setAnimals] = useState<any[]>([]);
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

  // State data in edit form
  const [inputData, setInputData] = useState({
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
    getAnimalsByUser(userid);
    fetchHerdsAnimals(userid);
    if (chosenHerdId) {
      getVaccinesByHerd(chosenHerdId);
    } 
    if (selectedAnimal) {
      getVaccinesByAnimals(selectedAnimal);
    }
  }, [selectedAnimal, userid, chosenHerdId]);

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
      !selectedAnimal
    ) {
      //error messages when empty fields
      setFormError({
        ...inputError,
        animal_id: "Välj djuridentitet",
        batchNo: "Fyll i ett batchnummer",
        name: "Fyll i namnet på vaccinet",
        date: "Fyll i ett datum",
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
      animal_id: selectedAnimal,
    });
    //fetch (post)
    try {
      const response = await fetch(
        `http://localhost:8000/api/vaccines/animals/${selectedAnimal}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }, //Send with sanitized data
          body: JSON.stringify({
            batchNo: sanitizedBatchNo,
            name: sanitizedName,
            date: sanitizedDate,
            animal_id: selectedAnimal,
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
          animal_id: selectedAnimal,
        });
        //get all vaccine from animal
        getVaccinesByAnimals(selectedAnimal);
        //show message
        setShowMessage("Vaccineringen är tillagd");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
    } catch (error) {
      setShowMessage("Fel vid lagring av vaccinering");
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      console.log(error);
    }
  };
  //Gets all vaccines from the animal with fetch
  const getVaccinesByAnimals = async (selectedAnimal: string) => {
    //fetch get
    try {
      const response = await fetch(
        `http://localhost:8000/api/vaccines/animals/${selectedAnimal}`,
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
  const getAnimalsByUser = async (userid: string | null) => {
    //fetch get
    try {
      const response = await fetch(`http://localhost:8000/api/animals/users/${userid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }); //if response ok
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

  const findAnimalId = (animalId: string) => {
    const animal = animals.find((animal) => animal.id === animalId);
    return animal ? animal.animalId : "Okänt"; // returnera animalId eller "Okänt" om djuret inte hittades
  };

  const editData = () => {
       setEditVaccine(true);
    setInputData({
      id: newVaccine.id,
      batchNo: newVaccine.batchNo,
      name: newVaccine.name,
      date: newVaccine.date,
      animal_id: selectedAnimal
    });
  };
  const goBack = () => {
    setEditVaccine(false);
    setNewVaccine({
      id: "",
      batchNo: "",
      name: "",
      date: "",
      animal_id: "",
    });
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

  const updateVaccine = async (e: React.FormEvent<HTMLFormElement>) => {
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
      !selectedAnimal
    ) {
      //error messages when empty fields
      setFormError({
        ...inputError,
        animal_id: "Välj djuridentitet",
        batchNo: "Fyll i ett batchnummer",
        name: "Fyll i namnet på vaccinet",
        date: "Fyll i ett datum",
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
    const { id, batchNo, name, date } = inputData;
    const sanitizedBatchNo = DOMPurify.sanitize(batchNo);
    const sanitizedName = DOMPurify.sanitize(name);
    const sanitizedDate = DOMPurify.sanitize(date);
    //Update state with sanitized values
    setNewVaccine({
      id: chosenVaccineId,
      batchNo: sanitizedBatchNo,
      name: sanitizedName,
      date: sanitizedDate,
      animal_id: selectedAnimal,
    });
    try {
      const response = await fetch(`http://localhost:8000/api/vaccines/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          batchNo: sanitizedBatchNo,
          name: sanitizedName,
          date: sanitizedDate,
        }),
      });
      if (response.ok) {
        setNewVaccine({
          id: newVaccine.id,
          batchNo: "",
          name: "",
          date: "",
          animal_id: selectedAnimal,
        });
        setShowMessage("Vaccineringen är ändrad");
        //Clear message after 3 seconds
        setTimeout(clearMessages, 3000);
        setEditVaccine(false);
         //And if animal is chosen
         if(selectedAnimal){
          //get all vaccine from animal
        getVaccinesByAnimals(selectedAnimal);
         } else{
          getVaccinesByHerd(selectedOption);
         }
      } else {
        setShowMessage("Vaccineringen kunde inte ändras");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
    } catch {
      console.error("Något gick fel:");
    }
  };

 

 // Fetch animals by selected herd (get)
 const getVaccinesByHerd = async (chosenHerdId: string| null) => {

  try {
    setIsLoading(true);
    const response = await fetch(
      `http://localhost:8000/api/vaccines/herds/${chosenHerdId}`,
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
    const pickedVaccines = await response.json();
    if (response.ok) {
      setVaccines(pickedVaccines);
   
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
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      }
    );
    const herdsData = await herdsResponse.json();
    if (herdsResponse.ok){
    setHerds(herdsData);
 
  
    if (herdsData.length === 1) {
      setChosenHerdId(herdsData[0].id);

    }
     else {
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
}

 // Handle select change in select for herds
  const handleSelectChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOptionValue = event.target.value;
    //update after choosen herd
    setSelectedOption(selectedOptionValue);
    if (selectedOptionValue === "AllAnimals") {
      setShowTable(false);
      // If "AllAnimals" is selected, set animals to all animals
      await fetchHerdsAnimals(userid);
    } else {
      setShowTable(true);
      // Fetch animals by selected herd
      getVaccinesByHerd(selectedOptionValue);
    }
  };
   //Delete vaccine with Id
   const deleteVaccine = async (chosenVaccineId: string) => {
    //fetch delete
    try {
      const response = await fetch(
        `http://localhost:8000/api/vaccines/${chosenVaccineId}`,
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
        //And if animal is chosen
        if(selectedAnimal){
        //get all vaccine from chosen animals
        getVaccinesByAnimals(selectedAnimal);
        //if no animal chosen, get all vaccines by selected herd
      } else { 
        getVaccinesByHerd(selectedOption);
      }
        //change show to false and show message
        setShow(false);
        setShowMessage("Vaccineringen är raderad");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      } else {
        throw new Error("Vaccineringen kunde inte raderas");
      }
    } catch (error) {
      console.error("Något gick fel:", error);
    }
  };


  return (
    <div>
      {/* Boolean, if Edit vaccine = true, show Edit form. Else show form form add medicine*/}
      {/* Form for changing vaccine */}
      {editVaccine ? (
        <div>
          <form
            className="form-control handleForm form-control-sm border border-dark p-5 shadow mx-auto"
            onSubmit={(e) => updateVaccine(e)}
            noValidate //The formdata is not automaticallly validated by the browser
          >
            
            <h2 className="py-3">Ändra vaccinering</h2>
            <div key={newVaccine.id} className="form-group">
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
                 <option value="">Välj ett djur</option>
        {animals.map((animal) => (
          <option key={animal.id} value={animal.id}>
            {findAnimalId(animal.id)} {/* Använd findAnimalId för att hitta animalId baserat på animal_id */}
          </option>
                ))}
              </select>
              <p className="error-message text-danger fw-bold">
                {formError.animal_id} </p>
            </div>
          
            <div className="form-group">
              <label htmlFor="batchNo" className="form-label">
                Batchnummer:
              </label>
              <input
                type="text"
                id="batchNo"
                name="batchNo"
                className="form-control form-control-sm border-dark"
                value={newVaccine.batchNo}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.batchNo}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Namn:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control form-control-sm border-dark"
                value={newVaccine.name}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.name}
              </p>
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
                className="form-control form-control-sm border-dark"
                value={newVaccine.date}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.date}
              </p>
            </div>
            <div className="form-btn-div d-flex justify-content-around">
              <button
                type="submit"
                className="button shadow-sm mt-2"
                onClick={editData}
              >
                Spara ändringar
              </button>
              <button className="button shadow-sm mt-2" onClick={goBack}>
                Avbryt
              </button>
            </div>
          </form>
          {/*Show messages to form */}
        </div>
      ) : (
        <div>
          {/*form for adding vaccine*/}
          <form
            className="form-control handleForm form-control-sm border p-5 border-dark shadow mx-auto"
            onSubmit={addVaccine}
            noValidate //The formdata is not automaticallly validated by the browser
          >
            <h2 className="py-3">Lägg till vaccinering</h2>
            <div className="form-group">
              <label htmlFor="animal_id" className="form-label">
                Djuridentitet:
              </label>
              <select
                id="animal_id"
                name="animal_id"
                className="form-select form-select-sm border-dark"
                value={selectedAnimal}
                onChange={(e) => setSelectedAnimal(e.target.value)}
              >
                <option value="">Välj ett djur</option>
                {animals?.map((animal) => (
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
              <label htmlFor="batchNo" className="form-label">
                Batchnummer:
              </label>
              <input
                type="text"
                id="batchNo"
                name="batchNo"
                className="form-control form-control-sm  border-dark"
                value={newVaccine.batchNo}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.batchNo}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Namn:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control form-control-sm border-dark"
                value={newVaccine.name}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.name}
              </p>
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
                className="form-control form-control-sm border-dark"
                value={newVaccine.date}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.date}
              </p>
            </div>
            <button type="submit" className="button shadow-sm mt-2">
              Lägg till
            </button>
          </form>
          <div className="alertMessage mx-auto">
          {/*Show messages to form */}
          {showMessage && (
            <p className="alert mx-auto alert-success text-dark mx-auto text-center mt-2">
              {showMessage}
            </p>
          )}
        </div>
        </div>
      )}
      {!isLoading && herds.length > 1 && (
        <div>
          <form className="fit-content-width form-control-sm mx-auto">
            <div className="form-group w-75 mx-auto m-5">
              <label className="form-label" htmlFor="herds">Besättningar:</label>
              <br />
              <select
                id="herds"
                name="herds"
                className="form-select border-dark"
                onChange={handleSelectChange}
                value={selectedOption}
              >
                <option disabled value="AllAnimals">Välj en besättning</option>
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
      {(showTable && vaccines.length < 1 ) || selectedAnimal == "0"  ? (

        <p>Ingen information finns registrerad</p>
       
      ) : (
<div>
      {/*Table to write calves*/}
      <h2 className="p-5 mx-auto"> Senaste vaccinationerna för valt djur:</h2>
      <table className="table table-responsive-sm table-hover mx-auto shadow-sm table-hover tableHandle">
        <thead className= "table-thead d-sm-table-header-group shadow-sm border-top">
          <tr>
            <th>Djuridentitet</th>
            <th>Namn</th>
            <th>Batchnummer</th>
            <th>Datum</th>
            <th>Hantera</th>
          </tr>
        </thead>
        <tbody>
          {/**Loop and Write vaccine */}
          {vaccines.map((vaccine) => {
              //Get  vaccine that matches animal_id in database
            const animal = animals?.find(
              (animal) => animal.id === vaccine.animal_id
            );
            return (
            <tr key={vaccine.id}>
                 {/* Display block for mobile */}   
               <td className="d-block d-sm-none td-handle" data-label="Djuridentitet">{animal ? animal.animalId : "Okänt"}</td>
               <td className="d-block d-sm-none" data-label="Namn">{vaccine.name}</td>
               <td className="d-block d-sm-none" data-label="Batchnummer">{vaccine.batchNo}</td>
               <td className="d-block d-sm-none" data-label="Datum & tid">{vaccine.date}</td>
               <td className="d-block d-sm-none" data-label="Hantera">
                <button
                  className="button"
                  onClick={() => {
                    setEditVaccine(true); // Update editMilk-state to true to edit
                    setNewVaccine({
                      id: vaccine.id,
                      batchNo: vaccine.batchNo,
                      name: vaccine.name,
                      date: vaccine.date,
                      animal_id: vaccine.animal_id,
                    });
                  }}
                >
                  Ändra
                </button>
                {/**Change url when clicking at delete */}
                <button
                  className="button"
                  onClick={() => navigateToVaccine(vaccine.id)}
                >
                  Radera
                </button>
              </td>
              
                   {/* Table for desktop */}
                   <td className="d-none d-sm-table-cell animalId"data-label="Djuridentitet">{animal ? animal.animalId : "Okänt"}</td>
                   <td className="d-none d-sm-table-cell" data-label="Namn">{vaccine.name}</td>
               <td className="d-none d-sm-table-cell"data-label="Batchnummer">{vaccine.batchNo}</td>
               <td className="d-none d-sm-table-cell" data-label="Datum & tid">{vaccine.date}</td>
                 
              <td className= "d-none d-sm-table-cell" data-label="Hantera">
                <button
                  className="button"
                  onClick={() => {
                    setEditVaccine(true); // Update editMilk-state to true to edit
                    setNewVaccine({
                      id: vaccine.id,
                      batchNo: vaccine.batchNo,
                      name: vaccine.name,
                      date: vaccine.date,
                      animal_id: vaccine.animal_id,
                    });
                  }}
                >
                  Ändra
                </button>
                {/**Change url when clicking at delete */}
                <button
                  className="button"
                  onClick={() => navigateToVaccine(vaccine.id)}
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
