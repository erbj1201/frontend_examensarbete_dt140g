//import
import DOMPurify from "dompurify";
import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
//structure of calf
interface Calf {
  id: string;
  animalId: string;
  earNo: string;
  breed: string;
  name: string;
  expectedBirthDate: string;
  birthDate: string;
  sex: string;
  category: string;
  animal_id: string;
}
function Calf() {
  //Cookies
  const cookies = new Cookies();
  const token = cookies.get("token");
  //use navigate
  const navigate = useNavigate();
  //states
  const [chosenAnimalId, setChosenAnimalId] = useState<string>("");
  const [animals, setAnimals] = useState<{ id: string; animalId: string }[]>(
    []
  );
  const [calves, setCalves] = useState<Calf[]>([]);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [chosenCalfId, setChosenCalfId] = useState<string>("");
  const [show, setShow] = useState(false);
  const [editCalf, setEditCalf] = useState(false);
  const handleClose = () => setShow(false);
  //States store data
  const [newCalf, setNewCalf] = useState<Calf>({
    id: "",
    animalId: "",
    earNo: "",
    breed: "",
    name: "",
    expectedBirthDate: "",
    birthDate: "",
    sex: "",
    category: "",
    animal_id: "",
  });

  // state data in edit form
  const [inputData, setInputData] = useState({
    id: "",
    animalId: "",
    earNo: "",
    breed: "",
    name: "",
    expectedBirthDate: "",
    birthDate: "",
    sex: "",
    category: "",
    animal_id: "",
  }
  );

  // Function to error store Data
  const [formError, setFormError] = useState({
    animalId: "",
    earNo: "",
    breed: "",
    name: "",
    expectedBirthDate: "",
    birthDate: "",
    sex: "",
    category: "",
    animal_id: "",
  });

  // Clear update and delete messages after a specified time
  const clearMessages = () => {
    //clear messages
    setShowMessage(null);
    setFormError({
      animalId: "",
      earNo: "",
      breed: "",
      name: "",
      expectedBirthDate: "",
      birthDate: "",
      sex: "",
      category: "",
      animal_id: "",
    });
  };
  //Fetch all calved and animals with useEffect
  useEffect(() => {
    getAnimals();
    if (chosenAnimalId) {
      getCalvesByAnimals(chosenAnimalId);
    }
  }, [chosenAnimalId]);

  // Handle changes in input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    //Sanitize value
    const sanitizedData = DOMPurify.sanitize(value);
    setNewCalf((prevState) => ({
      ...prevState,
      [name]: sanitizedData,
    }));
  };

  //Add Calf data with fetch
  const addCalf = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Object to track input errors
    let inputError = {
      animalId: "",
      earNo: "",
      breed: "",
      name: "",
      expectedBirthDate: "",
      birthDate: "",
      sex: "",
      category: "",
      animal_id: "",
    };
    //check if all fields empty
    if (
      !newCalf.animalId &&
      !newCalf.earNo &&
      !newCalf.breed &&
      !newCalf.name &&
      !newCalf.expectedBirthDate &&
      !newCalf.birthDate &&
      !chosenAnimalId &&
      !newCalf.sex &&
      !newCalf.category
    ) { //error messages when empty fields
      setFormError({
        ...inputError,
        animalId: "Skriv dit ett id för kalven",
        earNo: "Skriv ett öronnummer",
        breed: "Skriv en ras",
        name: "Skriv ett namn",
        expectedBirthDate: "Skriv det förväntade födelsedatumet",
        birthDate: "Skriv födelsedatum",
        sex: "Välj kön",
        category: "Välj kategori",
        animal_id: "Välj kalvens mamma",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }

    //Check if animalId empty
    if (!newCalf.animalId) {
      setFormError({
        ...inputError,
        animalId: "Skriv dit ett id för kalven",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if earNo empty
    if (!newCalf.earNo) {
      setFormError({
        ...inputError,
        earNo: "Skriv ett öronnummer",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if breed empty
    if (!newCalf.breed) {
      setFormError({
        ...inputError,
        breed: "Skriv en ras",
      });
      //Check if name empty
      if (!newCalf.name) {
        setFormError({
          ...inputError,
          name: "Skriv ett namn",
        });
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
        return;
      }
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if expectedBirthDate empty
    if (!newCalf.expectedBirthDate) {
      setFormError({
        ...inputError,
        expectedBirthDate: "Skriv förväntat födelsedatum",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if birthDate empty
    if (!newCalf.birthDate) {
      setFormError({
        ...inputError,
        birthDate: "Skriv födelsedatum",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if sex is empty
    if (!newCalf.sex) {
      setFormError({
        ...inputError,
        sex: "Välj kön",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if category is empty
    if (!newCalf.category) {
      setFormError({
        ...inputError,
        category: "Välj kategori",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if animal_id empty
    if (!chosenAnimalId) {
      setFormError({
        ...inputError,
        animal_id: "Välj kalvens mamma",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }

    //Sanitize input fields with DOMPurify
    const sanitizedAnimalId = DOMPurify.sanitize(newCalf.animalId);
    const sanitizedEarNo = DOMPurify.sanitize(newCalf.earNo);
    const sanitizedBreed = DOMPurify.sanitize(newCalf.breed);
    const sanitizedName = DOMPurify.sanitize(newCalf.name);
    const sanitizedExpectedBirth = DOMPurify.sanitize(
      newCalf.expectedBirthDate
    );
    const sanitizedBirthDate = DOMPurify.sanitize(newCalf.birthDate);

    //Update state with sanitized values
    setNewCalf({
      id: newCalf.id,
      animalId: sanitizedAnimalId,
      earNo: sanitizedEarNo,
      breed: sanitizedBreed,
      name: sanitizedName,
      expectedBirthDate: sanitizedExpectedBirth,
      birthDate: sanitizedBirthDate,
      sex: newCalf.sex,
      category: newCalf.category,
      animal_id: chosenAnimalId,
    });
    //fetch (post)
    try {
      const response = await fetch(
        `http://localhost:8000/api/calves/animals/${chosenAnimalId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }, //Send with sanitized data
          body: JSON.stringify({
            animalId: sanitizedAnimalId,
            earNo: sanitizedEarNo,
            breed: sanitizedBreed,
            name: sanitizedName,
            expectedBirthDate: sanitizedExpectedBirth,
            birthDate: sanitizedBirthDate,
            sex: newCalf.sex,
            category: newCalf.category,
            animal_id: chosenAnimalId,
          }),
        }
      );
      const responseData = await response.json();
      //if response ok, clear form
      if (response.ok) {
        setNewCalf({
          id: responseData.id,
          animalId: "",
          earNo: "",
          breed: "",
          name: "",
          expectedBirthDate: "",
          birthDate: "",
          sex: "",
          category: "",
          animal_id: chosenAnimalId,
        });
        //get all calves for chosen animal
        getCalvesByAnimals(chosenAnimalId);
        //show message
        setShowMessage("Kalven är tillagd");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
    } catch (error) {
      console.log(error);
      //error message
      setShowMessage("Fel vid lagring av kalv");
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
    }
  };
  //Trigger that shows the last calves from the chosen id (animal).
  const changeAnimal = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    //change state after chosen animal
    setChosenAnimalId(value);
  };

  // Gets all calf from the animal with fetch
  const getCalvesByAnimals = async (chosenAnimalId: string) => {
    //fetch (get)
    try {
      const response = await fetch(
        `http://localhost:8000/api/calves/animals/${chosenAnimalId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      ); //if response ok, set calves
      if (response.ok) {
        const jsonData = await response.json();
        setCalves(jsonData);
      } else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning av mjölk");
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
    setEditCalf(true);
    setInputData({
      id: newCalf.id,
      animalId: newCalf.animalId,
      earNo: newCalf.earNo,
      breed: newCalf.breed,
      name: newCalf.name,
      expectedBirthDate: newCalf.expectedBirthDate,
      birthDate: newCalf.birthDate,
      sex: newCalf.sex,
      category: newCalf.category,
      animal_id: chosenAnimalId,
    });
  };

  const updateCalf = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Sanitize input fields with DOMPurify

    const { id, animalId, earNo, breed, name, expectedBirthDate, birthDate, sex, category } = inputData;
    const sanitizedAnimalId = DOMPurify.sanitize(animalId);
    const sanitizedEarNo = DOMPurify.sanitize(earNo);
    const sanitizedBreed = DOMPurify.sanitize(breed);
    const sanitizedName = DOMPurify.sanitize(name);
    const sanitizedExpectedBirthDate = DOMPurify.sanitize(expectedBirthDate);
    const sanitizedBirthDate = DOMPurify.sanitize(birthDate);
    const sanitizedSex = DOMPurify.sanitize(sex);
    const sanitizedCategory = DOMPurify.sanitize(category);

    //Check if animalId empty
    if (!sanitizedAnimalId) {
      setFormError({
        ...formError,
        animalId: "Skriv dit ett id för kalven",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }

    //Check if earNo empty
    if (!sanitizedEarNo) {
      setFormError({
        ...formError,
        earNo: "Skriv ett öronnummer",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }

    //Check if breed empty
    if (!sanitizedBreed) {
      setFormError({
        ...formError,
        breed: "Skriv en ras",
      });
    }

    //Check if name empty
    if (!sanitizedName) {
      setFormError({
        ...formError,
        name: "Skriv ett namn",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if expectedBirthDate empty
    if (!sanitizedExpectedBirthDate) {
      setFormError({
        ...formError,
        expectedBirthDate: "Skriv förväntat födelsedatum",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if birthDate empty
    if (!sanitizedBirthDate) {
      setFormError({
        ...formError,
        birthDate: "Skriv födelsedatum",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }

    //Check if animal_id empty
    if (!chosenAnimalId) {
      setFormError({
        ...formError,
        animal_id: "Välj kalvens mamma",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    setNewCalf({
      id: chosenCalfId,
      animalId: sanitizedAnimalId,
      earNo: sanitizedEarNo,
      breed: sanitizedBreed,
      name: sanitizedName,
      expectedBirthDate: sanitizedExpectedBirthDate,
      birthDate: sanitizedBirthDate,
      sex: sanitizedSex,
      category: sanitizedCategory,
      animal_id: chosenAnimalId
    })
    try {
      const response = await fetch(`http://localhost:8000/api/calves/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          id: chosenCalfId,
          animalId: sanitizedAnimalId,
          earNo: sanitizedEarNo,
          breed: sanitizedBreed,
          name: sanitizedName,
          expectedBirthDate: sanitizedExpectedBirthDate,
          birthDate: sanitizedBirthDate,
          sex: sanitizedSex,
          category: sanitizedCategory,
          animal_id: chosenAnimalId
        })
      });

      if (response.ok) {
        //Clean input fields
        setNewCalf({
          id: newCalf.id,
          animalId: "",
          earNo: "",
          breed: "",
          name: "",
          expectedBirthDate: "",
          birthDate: "",
          sex: "",
          category: "",
          animal_id: chosenAnimalId
        })

        getCalvesByAnimals(chosenAnimalId);
        setShowMessage("Ändringarna är sparade");
        //Clear message after 3 seconds
        setTimeout(clearMessages, 3000);
        setEditCalf(false);
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
  //Delete Calf with id
  const deleteCalf = async (chosenCalfId: string) => {
    //fetch (delete)
    try {
      const response = await fetch(
        `http://localhost:8000/api/calves/${chosenCalfId}`,
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
        getCalvesByAnimals(chosenAnimalId);
        //change show to false and show message
        setShow(false);
        setShowMessage("Kalvningen är raderad");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      } else {
        setShowMessage("Kalvningen kunde inte raderas");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
    } catch (error) {
      console.error("Något gick fel:", error);
    }
  };

  //change url and add id
  const navigateToCalf = (id: string) => {
    //navigate to handle with id from chosen medicine
    navigate(`/handle/${id}`);
    //change states
    setShow(true);
    //save id
    setChosenCalfId(id);
  };

  return (
    <div>
      {/* Boolean, if Edit calf = true, show Edit form. Else show form form add calf*/}
      {/* Form for chaging medicine */}
      {editCalf ? (
        <div>
          {/*form for adding calf*/}
          <form
            className="form-control handleForm form-control-sm border-dark border-1 shadow p-5 mx-auto w-50 "
            onSubmit={(e) => updateCalf(e)}
            noValidate //The formdata is not automatically validated by the browser
          >
            <h2>Ändra kalvning</h2>
            <div className="form-group">
              <label htmlFor="animal_id" className="form-label">
                Mamma:
              </label>
              <select
                id="animal_id"
                name="animal_id"
                className="form-select shadow-sm"
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
            <div className="form-check">
              <p>Kön:</p>
              <label htmlFor="female" className="form-check-label">
                Hona
              </label>
              <input
                type="radio"
                id="female"
                name="sex"
                className="form-check-input shadow-sm"
                value={"Hona"}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-check">
              <label htmlFor="male" className="form-check-label">
                Hane
              </label>
              <input
                type="radio"
                id="male"
                name="sex"
                className="form-check-input shadow-sm"
                value={"Hane"}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.sex}</p>
            </div>
            <div className="form-check">
              <br />
              <p>Kategori:</p>
              <label htmlFor="meatAnimal" className="form-check-label">
                Köttdjur
              </label>
              <input
                type="radio"
                id="meatAnimal"
                name="category"
                className="form-check-input shadow-sm"
                value={"Kött"}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-check">
              <label htmlFor="milkAnimal" className="form-check-label">
                Mjölkdjur
              </label>
              <input
                type="radio"
                id="milkAnimal"
                name="category"
                className="form-check-input shadow-sm"
                value={"Mjölk"}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.category}</p>
            </div>
            <br />
            <div className="form-group">
              <label htmlFor="animalId" className="form-label">
                SE-nummer:
              </label>
              <input
                type="text"
                id="animalId"
                name="animalId"
                className="form-control shadow-sm"
                value={newCalf.animalId}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.animalId}</p>
            </div>
            <div className="form-group">
              <label htmlFor="earNo" className="form-label">
                Öronnummer:
              </label>
              <input
                type="text"
                id="earNo"
                name="earNo"
                className="form-control shadow-sm"
                value={newCalf.earNo}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.earNo}</p>
            </div>
            <div className="form-group">
              <label htmlFor="breed" className="form-label">
                Ras:
              </label>
              <input
                type="text"
                id="breed"
                name="breed"
                className="form-control shadow-sm"
                value={newCalf.breed}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.breed}</p>
            </div>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Namn:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control shadow-sm"
                value={newCalf.name}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.name}</p>
            </div>
            <div className="form-group">
              <label htmlFor="expectedBirthDate" className="form-label">
                Förväntat födelsedatum:
              </label>
              <input
                type="date"
                id="expectedBirthDate"
                name="expectedBirthDate"
                className="form-control shadow-sm"
                value={newCalf.expectedBirthDate}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.expectedBirthDate}</p>
            </div>
            <div className="form-group">
              <label htmlFor="birthDate" className="form-label">
                Födelsedatum:
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                className="form-control shadow-sm"
                value={newCalf.birthDate}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.birthDate}</p>
            </div>
            <button className="button shadow-sm w-50 mt-2" onClick={editData}>
              Ändra
            </button>
          </form>
          {/*Show messages to form */}
          {showMessage && (
            <p className="alert alert-light text-center mt-2">{showMessage}</p>
          )}
        </div>
      ) : (
        <div>
          {/*form for adding calf*/}
          <form
            className="form-control handleForm form-control-sm border-dark border-1 shadow p-5 mx-auto w-50"
            onSubmit={addCalf}
            noValidate //The formdata is not automatically validated by the browser
          >
            <h2>Kalvning</h2>
            <div className="form-group">
              <label htmlFor="animal_id" className="form-label">
                Mamma:
              </label>
              <select
                id="animal_id"
                name="animal_id"
                className="form-select shadow-sm border-dark"
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
            <div className="form-check">
              <p>Kön:</p>
              <label htmlFor="female" className="form-check-label">
                Hona
              </label>
              <input
                type="radio"
                id="female"
                name="sex"
                className="form-check-input shadow-sm border-dark"
                value={"Hona"}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-check">
              <label htmlFor="male" className="form-check-label">
                Hane
              </label>
              <input
                type="radio"
                id="male"
                name="sex"
                className="form-check-input shadow-sm border-dark"
                value={"Hane"}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.sex}</p>
            </div>
            <div className="form-check">
              <br />
              <p>Kategori:</p>
              <label htmlFor="meatAnimal" className="form-check-label">
                Köttdjur
              </label>
              <input
                type="radio"
                id="meatAnimal"
                name="category"
                className="form-check-input shadow-sm border-dark"
                value={"Kött"}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-check">
              <label htmlFor="milkAnimal" className="form-check-label">
                Mjölkdjur
              </label>
              <input
                type="radio"
                id="milkAnimal"
                name="category"
                className="form-check-input shadow-sm border-dark"
                value={"Mjölk"}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.category}</p>
            </div>
            <br />
            <div className="form-group">
              <label htmlFor="animalId" className="form-label">
                SE-nummer:
              </label>
              <input
                type="text"
                id="animalId"
                name="animalId"
                className="form-control shadow-sm border-dark"
                value={newCalf.animalId}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.animalId}</p>
            </div>
            <div className="form-group">
              <label htmlFor="earNo" className="form-label">
                Öronnummer:
              </label>
              <input
                type="text"
                id="earNo"
                name="earNo"
                className="form-control shadow-sm border-dark"
                value={newCalf.earNo}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.earNo}</p>
            </div>
            <div className="form-group">
              <label htmlFor="breed" className="form-label">
                Ras:
              </label>
              <input
                type="text"
                id="breed"
                name="breed"
                className="form-control shadow-sm border-dark"
                value={newCalf.breed}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.breed}</p>
            </div>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Namn:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control shadow-sm border-dark"
                value={newCalf.name}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.name}</p>
            </div>
            <div className="form-group">
              <label htmlFor="expectedBirthDate" className="form-label">
                Förväntat födelsedatum:
              </label>
              <input
                type="date"
                id="expectedBirthDate"
                name="expectedBirthDate"
                className="form-control shadow-sm border-dark"
                value={newCalf.expectedBirthDate}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.expectedBirthDate}</p>
            </div>
            <div className="form-group">
              <label htmlFor="birthDate" className="form-label">
                Födelsedatum:
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                className="form-control shadow-sm border-dark"
                value={newCalf.birthDate}
                onChange={handleInputChange}
              />
              <p className="error-message">{formError.birthDate}</p>
            </div>
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
      {/*Table to write calves*/}
      <h2> Senaste kalvarna för {newCalf.animalId}</h2>
      <table className="table table-responsive table-hover">
        <thead>
          <tr>
            <th>Djur-Id</th>
            <th>Öronnummer</th>
            <th>Ras</th>
            <th>Namn</th>
            <th>Förväntat födelsedatum</th>
            <th>Födelsedatum</th>
            <th>Kön</th>
            <th>Kategori</th>
            <th>Hantera</th>
          </tr>
        </thead>
        <tbody>
          {/**Loop and Write calves */}
          {calves.map((calf) => (
            <tr key={calf.id}>
              <td>{calf.animalId}</td>
              <td>{calf.earNo}</td>
              <td>{calf.breed}</td>
              <td>{calf.name}</td>
              <td>{calf.expectedBirthDate}</td>
              <td>{calf.birthDate}</td>
              <td>{calf.sex}</td>
              <td>{calf.category}</td>
              <td>
                <button
                  className="button"
                  onClick={() => {
                    setEditCalf(true); // Update editMilk-state to true to edit
                    setNewCalf({
                      id: calf.id,
                      animalId: calf.animalId,
                      earNo: calf.earNo,
                      breed: calf.breed,
                      name: calf.name,
                      expectedBirthDate: calf.expectedBirthDate,
                      birthDate: calf.birthDate,
                      sex: calf.sex,
                      category: calf.id,
                      animal_id: calf.animal_id
                    });
                  }}
                >
                  Ändra
                </button>
                {/**Change url when clicking at delete */}
                <button
                  className="button"
                  onClick={() => navigateToCalf(calf.id)}
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
                  onClick={() => deleteCalf(chosenCalfId)}
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
export default Calf;
