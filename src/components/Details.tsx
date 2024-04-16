import Cookies from "universal-cookie";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Collapsible from "../components/Collapsible";
import { RiArrowRightSLine } from "react-icons/ri";
import { RiArrowLeftSLine } from "react-icons/ri";

const DetailsPage: React.FC = () => {
    //Define whazt type of data
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
        imagepath: string;

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
                    <section className=" detailsArticle mx-auto border m-3 w-100 position-relative">
                        <header className="detailsHeader p-2 w-100 d-flex justify-content-between align-items-center ">
                            <RiArrowLeftSLine size={32} />
                            <p>{animals.name}</p>
                            <RiArrowRightSLine size={32} />
                        </header>
                        <article>
                            <div className="container detailsDiv p-3">
                                <h2 className="h2details">Grundinformation</h2>
                                <div className="container">
                                 { animals.imagepath !== null ? (
                                    <img className="img-thumbnail cow-image" src={animals.imagepath} alt ="A cow" />
                                
                                 ) : (
                                    <img className="img-thumbnail cow-image" src="\src\content\cow-image.png" alt ="A cow" />
                                 )
                                 }
                                   
                                </div>
                                <div className="container">
                                    <p><b>Id: </b>{animals.id}</p>
                                    <p><b>Djurid: </b>{animals.animalId}</p>
                                    <p><b>Öronnummer: </b>{animals.earNo}</p>
                                    <p><b>Födelsedatum: </b>{animals.birthDate}</p>
                                    <p><b>Ras: </b>{animals.breed}</p>
                                    <p><b>Kön: </b>{animals.sex}</p>
                                    <p><b>Användning: </b>{animals.category}</p>
                                    <p><b>Besättning:</b> {animals.herd_id}</p>
                                </div>
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