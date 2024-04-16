/*Herd component*/
//import
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  earNo: string;
  birthDate: string;
  breed: string;
  sex: string;
  category: string;
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
  //States
  const [error, setError] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("AllAnimals");
  const [herds, setHerds] = useState<Herd[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filterCategory, setFilterCategory] = useState<string | undefined>(
    undefined
  );

  // Fetch all herds and animals by user on component mount
  useEffect(() => {
    fetchHerdsAnimals();
  }, []);
  //Get users herds and users anmials
  const fetchHerdsAnimals = async () => {
    const cookies = new Cookies();
    const token = cookies.get("token");
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
      setHerds(herdsData);

      // Fetch all animals by user (get)
      const animalsResponse = await fetch(
        `http://localhost:8000/api/animals/users/${userid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      const animalsData = await animalsResponse.json();
      setAnimals(animalsData);
      //Get errors
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch animals by selected herd (get)
  const getAnimalsByHerd = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/animals/herds/${id}`,
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
      const pickedAnimals = await response.json();
      setAnimals(pickedAnimals);
      //get errors
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  // Handle select change in select for herds
  const handleSelectChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOptionValue = event.target.value;
    //update after choosen herd
    setSelectedOption(selectedOptionValue);
    if (selectedOptionValue === "AllAnimals") {
      // If "AllAnimals" is selected, set animals to all animals
      await fetchHerdsAnimals();
    } else {
      // Fetch animals by selected herd
      getAnimalsByHerd(selectedOptionValue);
    }
  };
  //Recieve type string and undefined to reset the sort of category
  const handleFilterCategory = (category: string | undefined) => {
    setFilterCategory(category);
  };
  //use navigate
  const navigate = useNavigate();
  //navigate to details
  const navigateToDetails = (id: number) => {
    //navigate to details for choosen animal (id)
    navigate(`/details/${id}`);
  };
  return (
    <div>
      {/*If there are more than one herd, show select with option*/}
      {!isLoading && !error && herds.length > 1 && (
        <div>
          <label htmlFor="herds">Välj en besättning:</label>
          <br />
          <select
            id="herds"
            name="herds"
            onChange={handleSelectChange}
            value={selectedOption}
          >
            <option value="AllAnimals">Visa alla djur</option>
            {herds.map((herd) => (
              <option key={herd.id} value={herd.id}>
                Besättning: {herd.herdId}, {herd.address}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* Buttons to sort out by category */}
      <div className="container mx-auto p-3">
        <button
          className="btn btn-primary btn-lg active m-3"
          onClick={() => {
            console.log("Alla djur valdes");
            //Undefined to stop sort the categories
            handleFilterCategory(undefined);
          }}
        >
          Alla djur
        </button>
        {/**Köttdjur */}
        <button
          className="btn btn-primary btn-lg active m-3"
          onClick={() => {
            console.log("Köttdjur valdes");
            handleFilterCategory("kött");
          }}
        >
          Köttdjur
        </button>
        {/**Mjölkdjur */}
        <button
          className="btn btn-primary btn-lg active m-3"
          onClick={() => {
            console.log("Mjölkdjur valdes");
            handleFilterCategory("mjölk");
          }}
        >
          Mjölkdjur
        </button>
      </div>
      {/*if animal lenght is larger then 0*/}
      {animals.length > 0 ? (
        <table className="table table-responsive table-hover">
          <thead>
            <tr>
              <th>Id</th>
              <th>Djurid</th>
              <th>ÖronNr:</th>
              <th>Födelsedatum</th>
              <th>Ras</th>
              <th>Kön</th>
              <th>Kategori</th>
              <th>Namn</th>
              <th>Besättningsid</th>
            </tr>
          </thead>
          <tbody>
            {/*Loop and write animals and filter by category*/}
            {/*eventlistener to navigate to details page for choosen animal*/}
            {animals
              .filter((animal) =>
                filterCategory ? animal.category === filterCategory : true
              )
              .map((animal) => (
                <tr
                  key={animal.id}
                  onClick={() => navigateToDetails(animal.id)}
                >
                  <td>{animal.id}</td>
                  <td>{animal.animalId}</td>
                  <td>{animal.earNo}</td>
                  <td>{animal.birthDate}</td>
                  <td>{animal.breed}</td>
                  <td>{animal.sex}</td>
                  <td>{animal.category}</td>
                  <td>{animal.name}</td>
                  <td>{animal.herd_id}</td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        //if no animals in herd
        <p>Inga djur i besättningen</p>
      )}
    </div>
  );
};
//Export
export default GetHerdComponent;
