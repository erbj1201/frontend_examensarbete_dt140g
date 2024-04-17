import Cookies from "universal-cookie";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Collapsible from "../components/Collapsible";
import { RiArrowRightSLine } from "react-icons/ri";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";


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
    const [herdId, setHerdId] = useState<string | null>(null);
    const [animalsByHerds, setAnimalsByHerds] = useState<Animal[]>([]);
    const [animalIndex, setAnimalIndex] = useState(0);
    // Create new instance of cookie
    const cookies = new Cookies();
    const token = cookies.get("token");
    let { id } = useParams();
    const navigate = useNavigate();

    const fetchAnimalsByHerd = async (herdId: string | null) => {
        try {
            const response = await fetch(`http://localhost:8000/api/animals/herds/${herdId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token} `,
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                const jsonData = await response.json();
                setAnimalsByHerds(jsonData);
                setAnimalIndex(0); 
            } else {
                throw new Error('Något gick fel');
            }
        } catch (error) {
            console.error('Fel vid hämtning av djur i besättningen');
        }

    };

    const clickNext = () => {
        if (animalIndex < animalsByHerds.length - 1) { // Kontrollera att vi inte överskrider gränserna för arrayen
            setAnimalIndex(animalIndex + 1);
            navigate(`/details/${animalsByHerds[animalIndex + 1].id}`);
        }
    };
    const clickPrev = () => {
        if (animalIndex > 0) { // if Index higher than 0
            setAnimalIndex(animalIndex - 1);
            navigate(`/details/${animalsByHerds[animalIndex - 1].id}`);
            
        }
    };

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
                        const herdIdJson = jsonData.herd_id;
                        setHerdId(herdIdJson);
                        console.log(herdIdJson);

                        //find index
                        const index = animalsByHerds.findIndex(animal => animal.id === parseInt(id));
                        if (index !== -1) {
                            setAnimalIndex(index);
                        }
                    } else {
                        throw new Error('Något gick fel');
                    }

                } catch (error) {
                    console.error('Fel vid hämtning');
                }

            };
            getAnimalById(id);
        }

    }, [id, animalsByHerds]);
    
  /*   const currentAnimal = animalsByHerds[animalIndex]; */
    return (
        <div>
            
            <p>Antal djur i besättningen: {animalsByHerds.length}</p>
            <button onClick={() => fetchAnimalsByHerd(herdId)}>Test</button>
            {animalsByHerds.map((animalByHerd, index) =>
            (

                <article key={index}>
                    <p>{animalByHerd.id}</p>
                    <p>{animalByHerd.name}</p>
                    <p>{index}</p>
                </article>
            ))}
            
{animalsByHerds.length > 0 && (
    <div>
        <h2>{animalsByHerds[animalIndex].name}</h2>
         <button onClick={clickPrev}>Föregående</button>
        <button onClick={clickNext}>Nästa</button>
        </div>
)}

            {animals ? (
                <div key={animals.id} >
                    <section className=" detailsArticle mx-auto border m-3 w-100 position-relative">
                        <header className="detailsHeader p-2 w-100 d-flex justify-content-between align-items-center ">
                            <button onClick={() => clickPrev()}> <RiArrowLeftSLine size={32} /> </button>
                            <p>{animals.name} {animals.id}  {herdId}</p>
                            <button onClick={() => clickNext()}> <RiArrowRightSLine size={32} /> </button>
                        </header>
                        <article>
                            <div className="container detailsDiv p-3">
                                <h2 className="h2details">Grundinformation</h2>
                                <div className="container">
                                    {animals.imagepath !== null ? (
                                        <img className="img-thumbnail cow-image" src={animals.imagepath} alt="A cow" />

                                    ) : (
                                        <img className="img-thumbnail cow-image" src="\src\content\cow-image.png" alt="A cow" />
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