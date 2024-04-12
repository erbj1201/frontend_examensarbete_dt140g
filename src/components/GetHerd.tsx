import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";

// Structure of herd
interface Herd {
  id: number;
  herdId: string;
  address: string;
  userid: number;
}    

// Structure of animal
interface Animal {
  id: number;
  animalId: string;
  breed: string;
  name: string;
  herd_id: string;
}

// Create new instance of cookie
const cookies = new Cookies();
// Get token from cookies
const token = cookies.get("token");
// Get userid from sessionstorage
const userid = sessionStorage.getItem("userid");

const GetHerdComponent: React.FC = () => {
  // States
  const [error, setError] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("AllAnimals");
  const [herds, setHerds] = useState<Herd[]>([]); 
  const [animals, setAnimals] = useState<Animal[]>([]); 

  // Fetch all herds and animals by user on component mount
  useEffect(() => {
    fetchData();
  }, []);

    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch all user herds
        const herdsResponse = await fetch(`http://localhost:8000/api/herds/users/${userid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          }
        });
        const herdsData = await herdsResponse.json();
        setHerds(herdsData);

        // Fetch all animals by user
        const animalsResponse = await fetch(`http://localhost:8000/api/animals/users/${userid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          }
        });
        const animalsData = await animalsResponse.json();
        setAnimals(animalsData);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

  // Fetch animals by selected herd
  const getAnimalsByHerd = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/animals/herds/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        }
      });
      const pickedAnimals = await response.json();
      setAnimals(pickedAnimals);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle select change event
  const handleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    //const selectedHerdId = event.target.value;
    const selectedOptionValue = event.target.value;
    setSelectedOption(selectedOptionValue); // Uppdatera vald option
    if (selectedOptionValue === "AllAnimals") {
      // If "AllAnimals" is selected, set animals to all animals
     await fetchData();
    } else {
      // Fetch animals by selected herd
      getAnimalsByHerd(selectedOptionValue);
    }
  };

  return (
    <div>
      {!isLoading && !error && herds.length > 0 && (
        <div>
          <label htmlFor="herds">Välj en besättning:</label>
          <br/>
          <select id="herds" name="herds" onChange={handleSelectChange} value={selectedOption}>
            <option value="AllAnimals">Visa alla djur</option>
            {herds.map((herd) => (
              <option key={herd.id} value={herd.id}>
                Besättning: {herd.herdId}, {herd.address}
              </option>
            ))}
          </select>
        </div>
      )}
      {animals.length > 0 ? (
        <table className="table table-responsive table-hover">
          <thead>
            <tr>
              <th>Id</th>
              <th>Djurid</th>
              <th>Ras</th>
              <th>Namn</th>
              <th>Besättningsid</th>
            </tr>
          </thead>
          <tbody>
            {animals.map((animal) => (
              <tr key={animal.id}>
                <td >{animal.id}</td>
                <td>{animal.animalId}</td>
                <td>{animal.breed}</td>
                <td>{animal.name}</td>
                <td>{animal.herd_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Inga djur i besättningen</p>
      )}
    </div>
  );
};

export default GetHerdComponent;