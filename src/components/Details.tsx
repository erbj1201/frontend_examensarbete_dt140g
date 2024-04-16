import Cookies from "universal-cookie";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Collapsible from "../components/Collapsible";
import leftArrow from "../content/left-arrow.png";
import rightArrow from "../content/right-arrow.png";

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
    const [animals, setAnimals] = useState<Animal>();
    // Create new instance of cookie
    const cookies = new Cookies();
    const token = cookies.get("token");

    let { id } = useParams();
    useEffect(() => {
        if (id != null) {
            const getAnimalById = async (id: string) => {
                try {
                    const response = await fetch(`http://localhost:8000/api/animals/${id}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token} `,
                            "Content-Type": "application/json"
                        }
                    });

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
            getAnimalById(id);
        }

    }, []);

    return (
        <div>
            {animals ? (
                <div key={animals.id} >
                    <section className="container detailsArticle mx-auto border m-3 w-100 position-relative">
                        <header className="detailsHeader p-2 w-100 d-flex justify-content-between align-items-center ">
                            <img className="arrowLeftDetails" src={leftArrow} alt="arrow left" />
                            <p>{animals.name}</p>
                            <img className="arrowRightDetails" src={rightArrow} alt="arrow right" />
                        </header>
                        <article>
                            <div className="p-3">
                                <p><b>id: </b>{animals.id}</p>
                                <p><b>Djurid: </b>{animals.animalId}</p><p><b>Ras: </b>{animals.breed}</p><p><b>Besättning:</b> {animals.herd_id}</p>
                            </div>
                        </article>
                        <article>
                            <div className="container">
                                <Collapsible open
                                    title="Mjölkning">
                                    <p>Test Test</p>
                                </Collapsible>

                            </div>
                        </article>

                    </section>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
export default DetailsPage;