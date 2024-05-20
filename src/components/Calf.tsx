//Import
import DOMPurify from "dompurify";
import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
//Structure of calf
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

//Structure of Herd
interface Herd {
  id: number;
  herdId: string;
  address: string;
  userid: number;
}

function Calf() {
  //Cookies
  const cookies = new Cookies();
  const token = cookies.get("token");
  // Get userid from sessionstorage
  const userid = sessionStorage.getItem("userid");
  //Use navigate
  const navigate = useNavigate();
  //States
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [chosenCalfId, setChosenCalfId] = useState<string>("");
  const [chosenHerdId, setChosenHerdId] = useState<string>("");
  const [herds, setHerds] = useState<Herd[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("AllAnimals");
  const [selectedAnimal, setSelectedAnimal] = useState<string>("");
  //Show/Hide dropdown with Herds
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //Show/Hide Table
  const [showTable, setShowTable] = useState<boolean>(true);
  const [editCalf, setEditCalf] = useState(false);
  const [animals, setAnimals] = useState<{ id: string; animalId: string }[]>(
    []
  );
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [calves, setCalves] = useState<Calf[]>([]);

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

  // State data in edit form
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
  });

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
    //Clear messages
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
    getAnimalsByUser(userid);
    fetchHerdsAnimals(userid);
    if (chosenHerdId) {
      getCalvesByHerd(chosenHerdId);
    }
    if (selectedAnimal) {
      getCalvesByAnimals(selectedAnimal);
    }
  }, [selectedAnimal, userid, chosenHerdId]);

  // Handle changes in input field
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    //Check if animal_id empty
    if (
      !selectedAnimal &&
      !newCalf.sex &&
      !newCalf.category &&
      !newCalf.earNo &&
      !newCalf.breed &&
      !newCalf.name &&
      !newCalf.animalId &&
      !newCalf.expectedBirthDate &&
      !newCalf.birthDate
    ) {
      //Messages if empty input fields
      setFormError({
        ...inputError,
        animal_id: "Välj djuridentitet på kalvens mamma",
        sex: "Välj ett kön",
        animalId: "Fyll i kalvens djuridentitet",
        category: "Välj om kalven är ett köttdjur eller mjölkdjur",
        earNo: "Fyll i ett öronnummer",
        breed: "Fyll i en ras",
        name: "Fyll i ett namn",
        expectedBirthDate: "Fyll i förväntat födelsedatum",
        birthDate: "Fyll i födelsedatum",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if animalId empty
    if (!selectedAnimal) {
      setFormError({
        ...inputError,
        animal_id: "Välj djuridentitet på kalvens mamma",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }

    //Check if empty
    if (!newCalf.sex) {
      setFormError({
        ...inputError,
        sex: "Välj ett kön",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if empty
    if (!newCalf.category) {
      setFormError({
        ...inputError,
        category: "Välj om kalven är ett köttdjur eller mjölkdjur",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }

    //Check if earNo empty
    if (!newCalf.earNo) {
      setFormError({
        ...inputError,
        earNo: "Fyll i ett öronnummer",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if  empty
    if (!newCalf.animalId) {
      setFormError({
        ...inputError,
        animalId: "Fyll i kalvens djuridentitet",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if breed empty
    if (!newCalf.breed) {
      setFormError({
        ...inputError,
        breed: "Fyll i en ras",
      });
    }
    //Check if name empty
    if (!newCalf.name) {
      setFormError({
        ...inputError,
        name: "Fyll i ett namn",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if expectedBirthDate empty
    if (!newCalf.expectedBirthDate) {
      setFormError({
        ...inputError,
        expectedBirthDate: "Fyll i förväntat födelsedatum",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if birthDate empty
    if (!newCalf.birthDate) {
      setFormError({
        ...inputError,
        birthDate: "Fyll i födelsedatum",
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
      animal_id: selectedAnimal,
    });
    //Fetch calves (post)
    try {
      const response = await fetch(
        `http://localhost:8000/api/calves/animals/${selectedAnimal}`,
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
            animal_id: selectedAnimal,
          }),
        }
      );
      const responseData = await response.json();
      //If response ok, clear form
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
          animal_id: selectedAnimal,
        });
        //Get all calves for chosen animal
        getCalvesByAnimals(selectedAnimal);
        //Show message
        setShowMessage("Kalven är tillagd");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
    } catch (error) {
      console.log(error);
      //Error message
      setShowMessage("Fel vid lagring av kalv");
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
    }
  };
  // Gets all calf from the animal with fetch
  const getCalvesByAnimals = async (selectedAnimal: string) => {
    //Fetch (get)
    try {
      const response = await fetch(
        `http://localhost:8000/api/calves/animals/${selectedAnimal}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      ); //If response ok, set calves
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

  // Get all animals by User
  const getAnimalsByUser = async (userid: string | null) => {
    //Fetch animals (get)
    try {
      const response = await fetch(`http://localhost:8000/api/animals/users/${userid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }); //If response ok
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
      animal_id: selectedAnimal,
    });
  };
  //Cancel button
  const goBack = () => {
    setEditCalf(false);
    setNewCalf({
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
  };

  const updateCalf = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const {
      id,
      animalId,
      earNo,
      breed,
      name,
      expectedBirthDate,
      birthDate,
      sex,
      category,
    } = inputData;

    //Check if all fields are empty
    if (
      !selectedAnimal &&
      !newCalf.sex &&
      !newCalf.category &&
      !newCalf.earNo &&
      !newCalf.breed &&
      !newCalf.name &&
      !newCalf.animalId &&
      !newCalf.expectedBirthDate &&
      !newCalf.birthDate
    ) {
      //Messages if empty input fields
      setFormError({
        ...inputError,
        animal_id: "Välj djuridentitet på kalvens mamma",
        sex: "Välj ett kön",
        animalId: "Fyll i kalvens djuridentitet",
        category: "Välj om kalven är ett köttdjur eller mjölkdjur",
        earNo: "Fyll i ett öronnummer",
        breed: "Fyll i en ras",
        name: "Fyll i ett namn",
        expectedBirthDate: "Fyll i förväntat födelsedatum",
        birthDate: "Fyll i födelsedatum",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if animalId empty
    if (!selectedAnimal) {
      setFormError({
        ...inputError,
        animal_id: "Välj djuridentitet på kalvens mamma",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }

    //Check if empty
    if (!newCalf.sex) {
      setFormError({
        ...inputError,
        sex: "Välj ett kön",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if empty
    if (!newCalf.category) {
      setFormError({
        ...inputError,
        category: "Välj om kalven är ett köttdjur eller mjölkdjur",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }

    //Check if earNo empty
    if (!newCalf.earNo) {
      setFormError({
        ...inputError,
        earNo: "Fyll i ett öronnummer",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if  empty
    if (!newCalf.animalId) {
      setFormError({
        ...inputError,
        animalId: "Fyll i kalvens djuridentitet",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if breed empty
    if (!newCalf.breed) {
      setFormError({
        ...inputError,
        breed: "Fyll i en ras",
      });
    }
    //Check if name empty
    if (!newCalf.name) {
      setFormError({
        ...inputError,
        name: "Fyll i ett namn",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if expectedBirthDate empty
    if (!newCalf.expectedBirthDate) {
      setFormError({
        ...inputError,
        expectedBirthDate: "Fyll i förväntat födelsedatum",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if birthDate empty
    if (!newCalf.birthDate) {
      setFormError({
        ...inputError,
        birthDate: "Fyll i födelsedatum",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }

    //Sanitize input fields with DOMPurify
    const sanitizedAnimalId = DOMPurify.sanitize(animalId);
    const sanitizedEarNo = DOMPurify.sanitize(earNo);
    const sanitizedBreed = DOMPurify.sanitize(breed);
    const sanitizedName = DOMPurify.sanitize(name);
    const sanitizedExpectedBirthDate = DOMPurify.sanitize(expectedBirthDate);
    const sanitizedBirthDate = DOMPurify.sanitize(birthDate);
    const sanitizedSex = DOMPurify.sanitize(sex);
    const sanitizedCategory = DOMPurify.sanitize(category);

    //Set new values for calf
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
      animal_id: selectedAnimal,
    });

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
          animal_id: selectedAnimal,
        }),
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
          animal_id: selectedAnimal,
        });


        setShowMessage("Kalvningen är ändrad");
        //Clear message after 3 seconds
        setTimeout(clearMessages, 3000);
        setEditCalf(false);
        //And if animal is chosen
        if (selectedAnimal) {
          getCalvesByAnimals(selectedAnimal);
        } else {
          getCalvesByHerd(selectedOption);
        }
      } else {
        setShowMessage("Kalvningen kunde inte ändras");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
    } catch {
      console.error("Något gick fel:");
    }
  };

  // Fetch animals by selected herd (get)
  const getCalvesByHerd = async (chosenHerdId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/calves/herds/${chosenHerdId}`,
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
      const pickedCalves = await response.json();
      if (response.ok) {
        setCalves(pickedCalves);
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
      // Fetch all users herds (with get)
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
        //If user only has one herd, the id of selected herd is set to chosenHerdId
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
      getCalvesByHerd(selectedOptionValue);
    }
  };

  //Delete Calf with id
  const deleteCalf = async (chosenCalfId: string) => {
    //Fetch (delete)
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
      ); //If response ok
      if (response.ok) {

        //And if animal is chosen
        if (selectedAnimal) {
          //get all medicine from animal
          getCalvesByAnimals(selectedAnimal);
          //If no animal chosen, get all calves by selected herd
        } else {
          getCalvesByHerd(selectedOption);
        }
        //Change show to false and show message
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

  //Change url and add id
  const navigateToCalf = (id: string) => {
    //Navigate to handle with id from chosen medicine
    navigate(`/handle/${id}`);
    //Change states
    setShow(true);
    //Save Id
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
            className="form-control form-control-sm handleForm border border-dark shadow mx-auto"
            onSubmit={(e) => updateCalf(e)}
            noValidate //The formdata is not automatically validated by the browser
          >
            <h2 className="py-3">Ändra kalvning</h2>
            <div className="form-group ">
              <label htmlFor="animal_id" className="form-label">
                Djuridentitet på mamma:
              </label>
              <select
                id="animal_id"
                name="animal_id"
                className="form-select form-select-sm border border-dark"
                value={selectedAnimal}
                disabled
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
              <label htmlFor="sex" className="form-label">
                Kön:
              </label>
              <select
                id="sex"
                name="sex"
                className="form-select form-select-sm border-dark"
                value={newCalf.sex}
                onChange={handleInputChange}
              >
                <option disabled value="">
                  Välj kalvens kön
                </option>
                <option value="Hona">Hona</option>
                <option value="Hane">Hane</option>
              </select>
              <p className="error-message text-danger fw-bold">
                {formError.sex}
              </p>
            </div>
            <div className="form-group-sm">
              <label htmlFor="category" className="form-label">
                Kategori:
              </label>
              <select
                id="category"
                name="category"
                className="form-select form-select-sm border-dark"
                value={newCalf.category}
                onChange={handleInputChange}
              >
                <option disabled value="">
                  Välj om kalven är köttdjur/mjölkdjur
                </option>
                <option value="Kött">Kött</option>
                <option value="Mjölk">Mjölk</option>
              </select>
              <p className="error-message text-danger fw-bold">
                {formError.category}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="animalId" className="form-label">
                Djuridentitet på kalv:
              </label>
              <input
                type="text"
                id="animalId"
                name="animalId"
                className="form-control form-control-sm border border-dark"
                value={newCalf.animalId}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.animalId}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="earNo" className="form-label">
                Öronnummer:
              </label>
              <input
                type="text"
                id="earNo"
                name="earNo"
                className="form-control form-control-sm border border-dark"
                value={newCalf.earNo}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.earNo}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="breed" className="form-label">
                Ras:
              </label>
              <input
                type="text"
                id="breed"
                name="breed"
                className="form-control form-control-sm border border-dark"
                value={newCalf.breed}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.breed}
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
                className="form-control form-control-sm border border-dark"
                value={newCalf.name}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.name}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="expectedBirthDate" className="form-label">
                Förväntat födelsedatum:
              </label>
              <input
                type="date"
                id="expectedBirthDate"
                name="expectedBirthDate"
                className="form-control form-control-sm border border-dark"
                value={newCalf.expectedBirthDate}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.expectedBirthDate}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="birthDate" className="form-label">
                Födelsedatum:
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                className="form-control form-control-sm border border-dark"
                value={newCalf.birthDate}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.birthDate}
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
          {/*Show messages to form */}
          {showMessage && (
            <p className="alert mx-auto alert-success text-dark w-25 text-center mt-2">{showMessage}</p>
          )}
        </div>

      ) : (
        <div>
          {/*form for adding calf*/}
          <form
            className="form-control handleForm form-control-sm border border-dark shadow mx-auto"
            onSubmit={addCalf}
            noValidate //The formdata is not automatically validated by the browser
          >
            <h2 className="py-3">Lägg till kalvning</h2>
            <div className="form-group">
              <label htmlFor="animal_id" className="form-label">
                Djuridentitet på mamma:
              </label>
              <select
                id="animal_id"
                name="animal_id"
                className="form-select form-select-sm border-dark"
                value={selectedAnimal}
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
              <label htmlFor="sex" className="form-label">
                Kön
              </label>
              <select
                id="sex"
                name="sex"
                className="form-select form-select-sm border-dark"
                value={newCalf.sex}
                onChange={handleInputChange}
              >
                <option disabled value="">
                  Välj kalvens kön
                </option>
                <option value="Hona">Hona</option>
                <option value="Hane">Hane</option>
              </select>
              <p className="error-message text-danger fw-bold">
                {formError.sex}
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Kategori:
              </label>
              <select
                id="category"
                name="category"
                className="form-select form-select-sm border-dark"
                value={newCalf.category}
                onChange={handleInputChange}
              >
                <option disabled value="">
                  Välj om kalven är köttdjur/mjölkdjur:
                </option>
                <option value="Kött">Kött</option>
                <option value="Mjölk">Mjölk</option>
              </select>
              <p className="error-message text-danger fw-bold">
                {formError.category}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="animalId" className="form-label">
                Djuridentitet på kalv:
              </label>
              <input
                type="text"
                id="animalId"
                name="animalId"
                className="form-control form-control-sm border-dark"
                value={newCalf.animalId}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.animalId}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="earNo" className="form-label">
                Öronnummer:
              </label>
              <input
                type="text"
                id="earNo"
                name="earNo"
                className="form-control form-control-sm border-dark"
                value={newCalf.earNo}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.earNo}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="breed" className="form-label">
                Ras:
              </label>
              <input
                type="text"
                id="breed"
                name="breed"
                className="form-control form-control-sm border-dark"
                value={newCalf.breed}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.breed}
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
                value={newCalf.name}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.name}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="expectedBirthDate" className="form-label">
                Förväntat födelsedatum:
              </label>
              <input
                type="date"
                id="expectedBirthDate"
                name="expectedBirthDate"
                className="form-control form-control-sm border-dark"
                value={newCalf.expectedBirthDate}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.expectedBirthDate}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="birthDate" className="form-label">
                Födelsedatum:
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                className="form-control form-control-sm border-dark"
                value={newCalf.birthDate}
                onChange={handleInputChange}
              />
              <p className="error-message text-danger fw-bold">
                {formError.birthDate}
              </p>
            </div>
            <button type="submit" className="button shadow-sm mt-2">
              Lägg till
            </button>
          </form>
          {/**Messages to form */}
          {showMessage && (
            <p className="alert mx-auto alert-success text-dark w-25 text-center mt-2">{showMessage}</p>
          )}
        </div>
      )}

      {/* This shows if user has more than one herd */}
      {!isLoading && herds.length > 1 && (
        <div>
          <form className="form-control selectWidth form-control-sm border-0 mx-auto">
            <div className="form-group mx-auto">
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
      {/* This shows if there is calves registrated in any animal in herd */}
      {(showTable && calves.length < 1) || selectedAnimal == "0" ? (
        <p>Ingen information finns registrerad</p>
      ) : (
        /*Table to write calves*/
        <div>
          <h2 className="p-5 mx-auto"> Senaste kalvningarna för valt djur:</h2>
          <table className="table table-responsive table-hover w-75 mx-auto">
            <thead>
              <tr>
                <th>Djuridentitet</th>
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
              {calves.map((calf) => {
               const animal = animals.find(
                (animal) => animal.id === calf.animal_id
              );
                return(
                <tr key={calf.id}>
                  <td>{animal ? animal.animalId : "Okänt"}</td>
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
                        setEditCalf(true); // Update editCalf-state to true to edit
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
                          animal_id: calf.animal_id,
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
