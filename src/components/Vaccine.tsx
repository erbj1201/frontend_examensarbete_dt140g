
import React, { useEffect, useState, FormEvent } from "react";
import Cookies from "universal-cookie";

interface Vaccine {
    id: string;
    batchNo: string;
    name: string;
    date: string;
    animal_id: string;
}

function Vaccine() {
    //States
    const cookies = new Cookies();
    const token = cookies.get("token");
    const [chosenAnimalId, setChosenAnimalId] = useState<string>("");
    const [animals, setAnimals] = useState<{ id: string; animalId: string }[]>([]);
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    //States store data
    const [newVaccine, setNewVaccine] = useState<Vaccine>({
        id: "",
        batchNo: "",
        name: "",
        date: "",
        animal_id: "",
    });
    useEffect(() => {
        if (chosenAnimalId) {
            getVaccineByAnimals(chosenAnimalId);
        }
        getAnimals();

    }, []);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewVaccine(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    //Post Vaccine with fetch
    const addVaccine = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8000/api/vaccines/animals/${chosenAnimalId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    batchNo: newVaccine.batchNo,
                    name: newVaccine.name,
                    date: newVaccine.date,
                    animal_id: chosenAnimalId,
                }),
            });

            const responseData = await response.json();
            //if response ok
            if (responseData.ok) {
                setNewVaccine({
                    id: responseData.id,
                    batchNo: "",
                    name: "",
                    date: "",
                    animal_id: chosenAnimalId,
                });
            }
            console.log(responseData);
        } catch (error) {
            console.log(error);
        }
    };
    //Trigger that Shows the last vaccines from the chosen id (animal)
    const changeAnimal = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setChosenAnimalId(value);
    };
    //Gets all vaccines from the animal with fetch
    const getVaccineByAnimals = async (chosenAnimalId: string) => {
        try {
            const response = await fetch(`http://localhost:8000/api/vaccines/animals/${chosenAnimalId}`,
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
                setVaccines(jsonData);
            }
            else {
                throw new Error("Något gick fel");
            }
        } catch (error) {
            console.error("Fel vid hämtning av vaccin");
        }

    };
    // Get's all animals with animalId´s and the id:s from the database
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

    return (
        <div>


            <form
                className="form-control handleForm form-control-sm border-2 p-5 mx-auto w-50 "
                onSubmit={addVaccine}
            >  <h2>Vaccinering</h2>
                <div className="form-group">
                    <label htmlFor="animal_id" className="form-label">
                        SE-nummer:
                    </label>
                    <select
                        id="animal_id"
                        name="animal_id"
                        className="form-control"
                        value={chosenAnimalId}
                        onChange={changeAnimal}>
                        <option value="">Välj ett djur</option>
                        {animals.map((animal) => (
                            <option key={animal.id} value={animal.id}>{animal.animalId}</option>
                        ))}
                    </select>
                    <div className="form-group">
                        <label htmlFor="batchNo" className="form-label">
                            Batchnummer:
                        </label>
                        <input
                            type="text"
                            id="batchNo"
                            name="batchNo"
                            className="form-control"
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
                            onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date" className="form-label">
                            Datum för vaccin:
                        </label>
                        <input
                            type="text"
                            id="date"
                            name="date"
                            className="form-control"
                            onChange={handleInputChange} />
                    </div>
                </div>
                <button type="submit" className="button w-50 mt-2">
                    Lägg till
                </button>
            </form>
        </div>)
};

export default Vaccine;