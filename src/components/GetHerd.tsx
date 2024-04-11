import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
// const herdUrl = "; 

//Create new instance of cookie
const cookies = new Cookies();
//Get token from cookies
const token = cookies.get("token");

interface Herd {
  id: number;
  herdId: string;
  address: string;
  user_id: number;
}    

const GetHerdComponent: React.FC = () => {
  const [error, setError] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [herds, setHerds] = useState<Herd[]>([]); // Här ändrades "herd" till "herds"

  useEffect(() => {
    const getHerds = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/herds/users/1", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          }
        });
      
        const pickedHerds = await response.json();
        setHerds(pickedHerds);
      
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getHerds();
  }, []);

  return (
    <div>
      <h2>Besättningar</h2>
      {!isLoading && !error && herds && herds.map((herd) => ( // Här ändrades "herd" till "herds"
        <div key={herd.id} className="mx-auto text-center p-3">
          <article className="mx-auto" key={herd.id}>
            <h3>Besättningsid: {herd.herdId}</h3>
            <p>
              <em>Adress: {herd.address}</em>
            </p>
            <p>
              <strong>Användarid: {herd.user_id}</strong>
            </p>
          </article>
        </div>
      ))}
    </div>
  );
};

export default GetHerdComponent;