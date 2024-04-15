import Footer from "../components/Footer";
import Header from "../components/Header";
import Cookies from "universal-cookie";
import React, { useState, useEffect } from "react";

const DetailsPage: React.FC = () => {
//Definera vilken typ av data som animals innehåller
    interface Animal {
        id: number;
        animalId: string;
        breed: string;
        name: string;
        imagepath: string;
        herd_id: number;
    }
    const [animals, setAnimals] = useState<Animal[]>([]);
     // Create new instance of cookie
  const cookies = new Cookies();
    const token = cookies.get("token");

    useEffect(() => {
        const getAnimals = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/animals`, {
                    method: "GET",
                    headers: {
                        "Authorization" : `Bearer ${token} `,
                        "Content-Type" : "application/json" 
                    }
                })

                if (response.ok) {
                    const jsonData = await response.json();
                    setAnimals(jsonData);
                } else {
                    throw new Error('Något gick fel');
                }
            } catch (error) {
                console.error('Fel vid hämtning');
            }
        };
        getAnimals();

    }, []);

    return (
        <div>
            <Header />
            <main className="container mx-auto">
                <h1>Detaljer</h1>
                {animals && animals.map((animal) => (
                    <div key={animal.id} >
                      <article className="detailsArticle mx-auto border m-3 w-50 position-relative">
                        <header className="detailsHeader p-2 w-100 d-flex justify-content-between align-items-center ">
                            <img className="arrowLeftDetails" src="src\content\left-arrow.png"/>
                            <p>{animal.name}</p>
                            <img className="arrowRightDetails" src="src\content\right-arrow.png"/>
                            </header>
                            <div className="p-3">
                            <p><b>id: </b>{animal.id}</p>
                             <p><b>Djurid: </b>{animal.animalId}</p><p><b>Ras: </b>{animal.breed}</p><p><b>Besättning:</b> {animal.herd_id}</p>
                  </div> 
                  </article>  
                   </div>
                ))}
            </main>
            <Footer />
        </div>
    );
}
export default DetailsPage;