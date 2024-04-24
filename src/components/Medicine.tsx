//import
import DOMPurify from "dompurify";
import React, { useEffect, useState, FormEvent } from "react";
import Cookies from "universal-cookie";
//structure of medicine
interface Medicine {
  id: string;
  date: string;
  type: string;
  amount: string;
  recurrent: boolean;
  animal_id: string;
}

function Medicine() {
  //States
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [chosenAnimalId, setChosenAnimalId] = useState<string>("");
  const [animals, setAnimals] = useState<{ id: string; animalId: string }[]>(
    []
  );
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  //States store data
  const [newMedicine, setNewMedicine] = useState<Medicine>({
    id: "",
    date: "",
    type: "",
    amount: "",
    recurrent: true,
    animal_id: "",
  });
  // Fetch all medicines and animals with useEffect
  useEffect(() => {
    //getAnimals
    getAnimals();
    if (chosenAnimalId) {
      getMedicinesByAnimals(chosenAnimalId);
    }
  }, [chosenAnimalId]);

  //Handle changes in the input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    //fetch
    try {
      const response = await fetch(
        `http://localhost:8000/api/medicines/animals/${chosenAnimalId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
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
      //if response ok
      if (response.ok) {
        setNewMedicine({
          id: responseData.id,
          date: "",
          type: "",
          amount: "",
          recurrent: false,
          animal_id: chosenAnimalId,
        });
      }
      console.log(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  //Trigger that shows the last medicines from the chosen id (animal).
  const changeAnimal = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setChosenAnimalId(value);
  };
  // Gets all medicine from the animal with fetch
  const getMedicinesByAnimals = async (chosenAnimalId: string) => {
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
  const deleteMedicine = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/medicines/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      if (response.ok) {
        alert("Medicineringen är nu raderad");
      } else {
        throw new Error("Något gick fel vid radering av medicinering");
      }
    } catch (error) {
      console.error("Något gick fel:", error);
    }
  };

  return (
    <div>
      <form
        className="form-control handleForm form-control-sm border-2 p-5 mx-auto w-50 "
        onSubmit={addMedicine}
      >
        <h2>Medicinering</h2>
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
        </div>
        <div className="form-group">
          <label htmlFor="date" className="form-label">
            Datum och tid för medicinering:
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            className="form-control"
            value={newMedicine.date}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="type" className="form-label">
            Typ av medicin:
          </label>
          <input
            type="text"
            id="type"
            name="type"
            className="form-control"
            value={newMedicine.type}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount" className="form-label">
            Mängd/dos av medicin:
          </label>
          <input
            type="text"
            id="amount"
            name="amount"
            className="form-control"
            value={newMedicine.amount}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-check">
          <p>Ska medicineringen återkomma?</p>
          <label htmlFor="recurrent-true" className="form-check-label">
            Ja
          </label>
          <input
            type="radio"
            id="recurrent-true"
            name="recurrent"
            className="form-check-input"
            value={"true"}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-check">
          <label htmlFor="recurrent-false" className="form-check-label">
            Nej
          </label>
          <input
            type="radio"
            id="recurrent-false"
            name="recurrent"
            className="form-check-input"
            value={"false"}
            onChange={handleInputChange}
            checked
          />
        </div>
        <button type="submit" className="button w-50 mt-2">
          Lägg till
        </button>
      </form>
      <h2>Senaste medicineringarna:</h2>
      <table className="table table-responsive table-hover">
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
          {medicines.map((medicine) => (
            <tr key={medicine.id}>
              <td>{medicine.animal_id}</td>
              <td>{medicine.date}</td>
              <td>{medicine.type}</td>
              <td>{medicine.amount}</td>
              {/**Check if medicine.recurrent is true or false */}
              <td>{medicine.recurrent ? 'Ja' : 'Nej'}</td>
              <td>
                <button className="button">Ändra</button>
                <button
                  onClick={() => {
                    deleteMedicine(medicine.id);
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
export default Medicine;
