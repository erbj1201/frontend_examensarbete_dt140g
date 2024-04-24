import DOMPurify from "dompurify";
import React, { useEffect, useState, FormEvent } from "react";
import Cookies from "universal-cookie";

interface Milk {
  id: string;
  kgMilk: string;
  milkDate: string;
  animal_id: string;
}
function Milk() {
  //States
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [chosenAnimalId, setChosenAnimalId] = useState<string>("");
  const [animals, setAnimals] = useState<{ id: string; animalId: string }[]>(
    []
  );
  const [milks, setMilks] = useState<Milk[]>([]);
  //States store data
  const [newMilk, setNewMilk] = useState<Milk>({
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
      setFormError({
        ...inputError,
        animal_id: "Välj ett djur",
        kgMilk: "Fyll i mängden mjölk (kg/mjölk)",
        milkDate: "Fyll i datum för mjölkning",
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
    });
    try {
      const response = await fetch(
        `http://localhost:8000/api/milks/animals/${chosenAnimalId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            kgMilk: sanitizedKgMilk,
            milkDate: sanitizedMilkDate,
            animal_id: chosenAnimalId,
          }),
        }
      );
      const responseData = await response.json();
      console.log(responseData);
      //if response ok
      if (response.ok) {
        // Update state for milk
        setNewMilk({
          id: responseData.id,
          kgMilk: "",
          milkDate: "",
          animal_id: chosenAnimalId,
        });
        //get all milk from animal
        getMilkByAnimals(chosenAnimalId);
        setShowMessage("Mjölkningen är tillagd");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
    } catch (error) {
      console.log(error);
      setShowMessage("Fel vid lagring av mjölkning");
    }
  };

  //Trigger that shows the last milks from the chosen id (animal).
  const changeAnimal = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setChosenAnimalId(value);
  };
  // Gets all milk from the animal with fetch
  const getMilkByAnimals = async (chosenAnimalId: string) => {
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
      );
      if (response.ok) {
        const jsonData = await response.json();
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
        const animalIds = jsonData.map((animal: any) => ({
          id: animal.id,
          animalId: animal.animalId,
        }));
        setAnimals(animalIds);
      } else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning");
    }
  };
  //Delete Milk with id
  const deleteMilk = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/milks/${id}`, {
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
  };

  return (
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
            onChange={handleInputChange}
          />
          <p className="error-message">{formError.kgMilk}</p>
        </div>
        <div className="form-group">
          <label htmlFor="kgMilk" className="form-label">
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
          {milks.map((milk) => (
            <tr key={milk.id}>
              <td>{milk.animal_id}</td>
              <td>{milk.kgMilk} Kg</td>
              <td>{milk.milkDate}</td>
              <td>
                <button className="button">Ändra</button>
                <button
                  onClick={() => {
                    deleteMilk(milk.id);
                  }}
                  className="button m-2"
                >
                  Radera
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Milk;
