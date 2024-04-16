import Cookies from "universal-cookie";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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
        const [isOpen, setIsOpen] = useState(false);
        const openImageSrc = "\src\content\arrow-up.png"; //When collapsible element is open
        const [imageSrc, setImageSrc] = useState("/icons8-arrow-down-50.png");
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
                            "Authorization" : `Bearer ${token} `,
                            "Content-Type" : "application/json" 
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
        const toggleCollapse = () => {
            setIsOpen(!isOpen);
            setImageSrc(isOpen ? "\src\content\arrow-down.png" : openImageSrc);
          };
    
        return (
            <div>
                   
                    {animals ? (
                        <div key={animals.id} >
                          <article className="detailsArticle mx-auto border m-3 w-50 position-relative">
                            <header className="detailsHeader p-2 w-100 d-flex justify-content-between align-items-center ">
                                <img className="arrowLeftDetails" src="\src\content\left-arrow.png" alt="arrow  left"/>
                                <p>{animals.name}</p>
                                <img className="arrowRightDetails" src="\src\content\right-arrow.png" alt="arrow right"/>
                                </header>
                                <div className="p-3">
                                <p><b>id: </b>{animals.id}</p>
                                 <p><b>Djurid: </b>{animals.animalId}</p><p><b>Ras: </b>{animals.breed}</p><p><b>Besättning:</b> {animals.herd_id}</p>
                                 <div className="storeOrder border-4 rounded-md border-black m-4">
      <button
        onClick={toggleCollapse}
        className="button flex items-center justify-between m-0.1"
      >
        <span className="flex-grow">Mjölkning</span>
        <img src={imageSrc} alt="Pil" className="ml-20 w-10" />
      </button>
      {isOpen}
    </div>
                      </div> 
                     
                      </article>  
                       </div>
     ):(
                        <p>Loading...</p>
                         )}
                         </div>
                           );
                        }
                        export default DetailsPage;