
import React, { useEffect, useState } from "react";

const herdUrl = "http://localhost:8000/api/herds"; 

interface Herd {
  id: number;
  herdId: string;
  address: string;
  user_id: number;
}    

const GetHerdComponent: React.FC = () => {
  const [error, setError] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [herd, setHerds] = useState<Herd[]>([]);

  useEffect(() => {
    const getHerds = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${herdUrl}`);
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
      {!isLoading && !error && herd && herd.map((herd) => (
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