import React, { useEffect, useState, FormEvent } from "react";
import Cookies from "universal-cookie";

interface Milk {
    id: string;
    kgMilk: string;
    milkDate: string;
    animal_id: string;

}
function Handle() {
    //States
    const cookies = new Cookies();
    const token = cookies.get("token");
    const [chosenAnimalId, setChosenAnimalId] = useState<string>("");
    const [animals, setAnimals] = useState<string[]>([]);
    const [milks, setMilks] = useState<Milk[]>([]);
//States store data
    const [newMilk, setNewMilk] = useState<Milk>({
        id: "",
        kgMilk: "",
        milkDate: "",
        animal_id: "",
    });

    // Fetch all milks and animals with useEffect
    useEffect(() => {
        if (chosenAnimalId) {
            getMilkByAnimals(chosenAnimalId);
        }
        getAnimals();
    }, [chosenAnimalId]);
//Handle changes in the input field
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewMilk({ ...newMilk, [name]: value });
    };
    //Post Milk data with fetch 
    const addMilk = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8000/api/milks/animals/${chosenAnimalId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    kgMilk: newMilk.kgMilk,
                    milkDate: newMilk.milkDate,
                    animal_id: chosenAnimalId,
                }),
            });
            const responseData = await response.json();
            //if response ok
            if (response.ok) {
                setNewMilk({
                    id: "",
                    kgMilk: "",
                    milkDate: "",
                    animal_id: chosenAnimalId,
                });
            }
            console.log(responseData);
        } catch (error) {
            console.log(error);
        }
    };
    //Shows the last milks from the chosen animal id
    const changeAnimal = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setChosenAnimalId(value);
    };
// Gets milk wfor the chosen animalId
    const getMilkByAnimals = async (animalId: string) => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/milks/animals/${animalId}`,
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
            }
            else {
                throw new Error("Något gick fel");
            }
        } catch (error) {
            console.error("Fel vid hämtning av djur i besättningen");
        }
    };
    // Get's all animals and the id:s from the database
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
                const animalIds = jsonData.map((animal: any) => animal.id);
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
                onSubmit={addMilk}
            >
                <div className="form-group">
                    <label htmlFor="animal_id" className="form-label">
                        Djur:
                    </label>
                    <select
                        id="animal_id"
                        name="animal_id"
                        className="form-control"
                        value={chosenAnimalId}
                        onChange={changeAnimal}>
                        <option value="">Välj ett djur</option>
                        {animals.map((animalId) => (
                            <option key={animalId} value={animalId}>{animalId}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="kgMilk" className="form-label">
                        Mjölk i kg:
                    </label>
                    <input
                        type="kgMilk"
                        id="kgMilk"
                        name="kgMilk"
                        className="form-control"
                        onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="kgMilk" className="form-label">
                        Datum för mjölkning:
                    </label>
                    <input
                        type="milkDate"
                        id="milkDate"
                        name="milkDate"
                        className="form-control"
                        onChange={handleInputChange} />
                </div>
                <button type="submit" className="button w-50 mt-2">
                    Lägg till
                </button>
            </form>
            <h2>Senaste mjölkningarna:</h2>
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
                            <td>{milk.kgMilk}</td>
                            <td>{milk.milkDate}</td>
                            <td><button className="button">Ändra</button><button className="button">Radera</button></td>
                        </tr>))}
                </tbody>
            </table>
        </div>
    );
};
export default Handle;