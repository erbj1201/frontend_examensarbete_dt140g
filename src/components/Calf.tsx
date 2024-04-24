
import DOMPurify from "dompurify";
import React, { useEffect, useState, FormEvent } from "react";
import Cookies from "universal-cookie";

interface Calf {
  id: string;
  animalId: string,
  earNo: string,
  breed: string,
  name: string,
  expectedBirthDate: string,
  birthDate: string,
  sex: string,
  category: string,
  animal_id: string;
}
function Calf() {
  // States 
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [chosenAnimalId, setChosenAnimalId] = useState<string>("");
  const [animals, setAnimals] = useState<{ id: string; animalId: string }[]>([]);
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
  //Fetch all calved and animals with useEffect

  useEffect(() => {
    getAnimals();
    if (chosenAnimalId) {
      getCalfByAnimals(chosenAnimalId);
    }
  }, [chosenAnimalId]);

  // Handle changes in input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    //Sanitize value
    const sanitizedData = DOMPurify.sanitize(value);
    setNewCalf(prevState => ({
      ...prevState,
      [name]: sanitizedData
    }));
  };
  //Add Calf data with fetch 
  const addCalf = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("chosenAnimalId:", chosenAnimalId);
    //Sanitize input fields with DOMPurify
    const sanitizedAnimalId = DOMPurify.sanitize(newCalf.animalId);
    const sanitizedEarNo = DOMPurify.sanitize(newCalf.earNo);
    const sanitizedBreed = DOMPurify.sanitize(newCalf.breed);
    const sanitizedName = DOMPurify.sanitize(newCalf.name);
    const sanitizedExpectedBirth = DOMPurify.sanitize(newCalf.expectedBirthDate);
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
      animal_id: chosenAnimalId
    });
    try {
      const response = await fetch(`http://localhost:8000/api/calves/animals/${chosenAnimalId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
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
      });
      const responseData = await response.json();
      console.log(responseData);
      //if response ok
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
          animal_id: chosenAnimalId
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  //Trigger that shows the last calves from the chosen id (animal). 
  const changeAnimal = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setChosenAnimalId(value);
  };

  // Gets all calf from the animal with fetch
  const getCalfByAnimals = async (chosenAnimalId: string) => {
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
      );
      if (response.ok) {
        const jsonData = await response.json();
        setCalves(jsonData);
      }
      else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning av mjölk");
    }
  };

  // Get all animals with their animalId´s and id:s from the database
  const getAnimals = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/animals`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (response.ok) {
        const jsonData = await response.json();
        //Map function to transform objects in the array. 
        const animalIds = jsonData.map((animal: any) =>
        ({
          id: animal.id,
          animalId: animal.animalId
        }));
        setAnimals(animalIds);
      } else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning");
    }
  };
 
  //Delete Calf with id
  const deleteCalf = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/calves/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },

      });
      if (response.ok) {
        alert("Mjölkning är nu raderad");

      } else {
        throw new Error("Något gick fel vid radering av mjölkning");
      }
    } catch (error) {
      console.error("Något gick fel:", error);
    }
  } 
  return (
    <div>
      <form
        className="form-control handleForm form-control-sm border-2 p-5 mx-auto w-50 "
        onSubmit={addCalf}
      >
        <h2>Kalvning</h2>
        <div className="form-group">
          <label htmlFor="animalId" className="form-label">
            SE-nummer:
          </label>
          <input
          type="text"
            id="animalId"
            name="animalId"
            className="form-control"
            value={newCalf.animalId}
            onChange={handleInputChange}/>
          
        </div>
        <div className="form-group">
          <label htmlFor="earNo" className="form-label">
            Öronnummer:
          </label>
          <input
            type="text"
            id="earNo"
            name="earNo"
            className="form-control"
            value={newCalf.earNo}
            onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="breed" className="form-label">
            Ras:
          </label>
          <input
            type="text"
            id="breed"
            name="breed"
            className="form-control"
            value={newCalf.breed}
            onChange={handleInputChange} />
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
            value={newCalf.name}
            onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="expectedBirthDate" className="form-label">
            Förväntat födelsedatum:
          </label>
          <input
            type="date"
            id="expectedBirthDate"
            name="expectedBirthDate"
            className="form-control"
            value={newCalf.expectedBirthDate}
            onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="birthDate" className="form-label">
            Födelsedatum:
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            className="form-control"
            value={newCalf.birthDate}
            onChange={handleInputChange} />
        </div>
     <div className="form-check">
          <p>Kön:</p>
          <label htmlFor="hona" className="form-check-label">
            Hona
          </label>
          <input
            type="radio"
            id="hona"
            name="sex"
            className="form-check-input"
           
            onChange={handleInputChange} checked
            />
        </div>
        <div className="form-check">
          <label htmlFor="male-false" className="form-check-label">
            Hane
          </label>
          <input
            type="radio"
            id="male-false"
            name="sex"
            className="form-check-input"
           
            onChange={handleInputChange} />
        </div>
        <div className="form-check">
          <p>Kategori:</p>
          <label htmlFor="kött" className="form-check-label">
            Köttdjur
          </label>
          <input
            type="radio"
            id="kött"
            name="category"
            className="form-check-input"
           
            onChange={handleInputChange} checked/>
        </div>
        <div className="form-check">
          <label htmlFor="milkAnimal-false" className="form-check-label">
            Mjölkdjur
          </label>
          <input
            type="radio"
            id="milkAnimal-false"
            name="category"
            className="form-check-input"
            
            onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="animal_id" className="form-label">
            Mamma:
          </label>
          <select
            id="animal_id"
            name="animal_id"
            className="form-control"
            value={chosenAnimalId}
            onChange={changeAnimal}>

            <option value="">Välj ett djur</option>
            {animals.map((animal) => (
              <option key={animal.id} value={animal.id}>{animal.animalId}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="button w-50 mt-2">
          Lägg till
        </button>
      </form>
<h2> Senaste kalvarna</h2>
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
            <td><button className="button">Ändra</button>
                <button
                  onClick={() => {
                    deleteCalf(calf.id);
                  }}
                  className="button m-2"
                >
                  Radera
                </button></td>
                </tr>
          ))}
           </tbody>   
           </table>
    </div>
    );
}
export default Calf;