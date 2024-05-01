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

  //states
  /* const [animals, setAnimals] = useState<Animal>(); */
  const [herdId, setHerdId] = useState<string | null>(null);
  const [animalsByHerds, setAnimalsByHerds] = useState<Animal[]>([]);
  const [animalIndex, setAnimalIndex] = useState(0);
  // Create new instance of cookie
  const cookies = new Cookies();
  //get token from cookies
  const token = cookies.get("token");
  //get id from URL
  let { id } = useParams();
  //use navigate
  const navigate = useNavigate();

  const fetchAnimalsByHerd = async (herdId: string | null) => {
    //Fetch
    try {
      const response = await fetch(
        `http://localhost:8000/api/animals/herds/${herdId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token} `,
            "Content-Type": "application/json",
          },
        }
      );
      //if response ok
      if (response.ok) {
        const jsonData = await response.json();
        //set animals by herds
        setAnimalsByHerds(jsonData);
        //set index to 0
        setAnimalIndex(0);
      } else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning av djur i besättningen");
    }
  };
  //Handle click to next animal in herd
  const clickNext = () => {
    if (animalIndex < animalsByHerds.length - 1) {
      //set index to this index plus 1
      setAnimalIndex(animalIndex + 1);
      //change and navigate to new url
      navigate(`/details/${animalsByHerds[animalIndex + 1].id}`);
    }
  };
  //Handle click to previous animal in herd
  const clickPrev = () => {
    if (animalIndex > 0) {
      // if Index higher than 0'
      //set index to this index minus 1
      setAnimalIndex(animalIndex - 1);
      //change and navigate to new url
      navigate(`/details/${animalsByHerds[animalIndex - 1].id}`);
    }
  };

  useEffect(() => {
    //check if id extist
    if (id != null) {
      //fetch
      const getAnimalById = async (id: string) => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/animals/${id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token} `,
                "Content-Type": "application/json",
              },
            }
          );
          //if response ok
          if (response.ok) {
            const jsonData = await response.json();
            const herdIdJson = jsonData.herd_id;
            setHerdId(herdIdJson);
            //find index
            const index = animalsByHerds.findIndex(
              (animal) => animal.id === parseInt(id)
            );
            if (index !== -1) {
              setAnimalIndex(index);
            }
          } else {
            throw new Error("Något gick fel");
          }
        } catch (error) {
          console.error("Fel vid hämtning");
        }
      };
      getAnimalById(id);
    }
  }, []);

  useEffect(() => {
    if (herdId !== null) {
      fetchAnimalsByHerd(herdId);
    }
  }, [herdId]);

  const animalDataWithIndex: any[] = animalsByHerds.map(
    (animalByHerd, index) => ({
      data: {
        id: animalByHerd.id,
        animalId: animalByHerd.animalId,
        earNo: animalByHerd.earNo,
        birthDate: animalByHerd.birthDate,
        breed: animalByHerd.breed,
        sex: animalByHerd.sex,
        category: animalByHerd.category,
        name: animalByHerd.name,
        herd_id: animalByHerd.herd_id,
        imagepath: animalByHerd.imagepath,
      },
      index: index,
    })
  );

  return (
    <div>
      <p>Antal djur i besättningen: {animalsByHerds.length}</p>

      {animalDataWithIndex.length > 0 && (
        <div key={animalsByHerds[animalIndex].id}>
          <section className=" detailsArticle mx-auto border m-3 w-100 position-relative">
            <header className="detailsHeader w-100 d-flex justify-content-between align-items-center ">
              <button onClick={() => clickPrev()}>
                {" "}
                <RiArrowLeftSLine size={32} />{" "}
              </button>
              <p>
                {animalsByHerds[animalIndex].name}{" "}
                {animalsByHerds[animalIndex].id}
              </p>
              <button onClick={() => clickNext()}>
                {" "}
                <RiArrowRightSLine size={32} />{" "}
              </button>
            </header>
            <article className=" w-75 mx-auto detailsDiv">
              <div>
                <h2 className="h2details">Grundinformation</h2>
                <div>
                  {animalsByHerds[animalIndex].imagepath !== null ? (
                    <img
                      className="img-thumbnail cow-image"
                      src={animalsByHerds[animalIndex].imagepath}
                      alt="A cow"
                    />
                  ) : (
                    <img
                      className="img-thumbnail cow-image"
                      src="\src\content\cow-image.png"
                      alt="A cow"
                    />
                  )}
                </div>
                <div>
                  <p>
                    <b>Id: </b>
                    {animalsByHerds[animalIndex].id}
                  </p>
                  <p>
                    <b>Djurid: </b>
                    {animalsByHerds[animalIndex].animalId}
                  </p>
                  <p>
                    <b>Öronnummer: </b>
                    {animalsByHerds[animalIndex].earNo}
                  </p>
                  <p>
                    <b>Födelsedatum: </b>
                    {animalsByHerds[animalIndex].birthDate}
                  </p>
                  <p>
                    <b>Ras: </b>
                    {animalsByHerds[animalIndex].breed}
                  </p>
                  <p>
                    <b>Kön: </b>
                    {animalsByHerds[animalIndex].sex}
                  </p>
                  <p>
                    <b>Användning: </b>
                    {animalsByHerds[animalIndex].category}
                  </p>
                  <p>
                    <b>Besättning:</b> {animalsByHerds[animalIndex].herd_id}
                  </p>
                </div>
              </div>
            </article>
            <article className="w-75 mx-auto">
              <div>
                <Collapsible open title="Mjölkning">
                  <p>Mjölkning testtest</p>
                  
                </Collapsible>
                 </div>
                 </article>
                 <article className="w-75 mx-auto">
                <div>
                <Collapsible open title="Medicinering">
                  <p>Medicinering Test Test</p>
                </Collapsible>
              </div>
              </article>
              <article className="w-75 mx-auto">
              <div>
                <Collapsible open title="Vaccinering">
                  <p>Vaccinering Test Test</p>
                </Collapsible>
              </div>
              </article>
              <article className="w-75 mx-auto">
              <div>
                <Collapsible open title="Kalvning">
                  <p>Kalvning Test Test</p>
                </Collapsible>
              </div>
            </article>
          </section>
        </div>
        /*    ) : (
                <p>Loading...</p>
            )} */
      )}
    </div>
  );
};
export default DetailsPage;
