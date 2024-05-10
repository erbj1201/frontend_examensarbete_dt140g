import Cookies from "universal-cookie";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Collapsible from "../components/Collapsible";
import { RiArrowRightSLine } from "react-icons/ri";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

//Define type of data
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

const DetailsPage: React.FC = () => {
  //States
  /* const [animals, setAnimals] = useState<Animal>(); */
  const [herdId, setHerdId] = useState<string | null>(null);
  const [animalsByHerds, setAnimalsByHerds] = useState<Animal[]>([]);
  const [animalIndex, setAnimalIndex] = useState(0);
  // Create new instance of cookie
  const cookies = new Cookies();
  //get token from cookies
  const token = cookies.get("token");
  //Get id from URL
  let { id } = useParams();
  //Use navigate
  const navigate = useNavigate();
  // MilkData
  const [milkingData, setMilkingData] = useState<any[]>([]);
  //Medicinedata
  const [medicineData, setMedicineData] = useState<any[]>([]);
  //Vaccinedata
  const [vaccineData, setVaccineData] = useState<any[]>([]);
  //Calfdata
  const [calfData, setCalfData] = useState<any[]>([]);

  /*   const [loading, setLoading] = useState<boolean>(true); */


  useEffect(() => {
    if (id) {
      getMilkByAnimals(id);
      getMedicinesByAnimals(id);
      getVaccinesByAnimals(id);
      getCalvesByAnimals(id);
    }
  }, [id]);


  // Gets all calf from the animal with fetch
  const getCalvesByAnimals = async (animal_id: string) => {
    //Fetch calves (get)
    try {
      const response = await fetch(
        `http://localhost:8000/api/calves/animals/${animal_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      ); //If response ok, set calves
      if (response.ok) {
        const jsonData = await response.json();
        setCalfData(jsonData);
      } else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning av mjölk");
    }
  };

  //Gets all vaccines from the animal with fetch
  const getVaccinesByAnimals = async (animal_id: string) => {
    //Fetch vaccines (get)
    try {
      const response = await fetch(
        `http://localhost:8000/api/vaccines/animals/${animal_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      ); //If response ok, set vaccine
      if (response.ok) {
        const jsonData = await response.json();
        setVaccineData(jsonData);
      } else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning av vaccin");
    }
  };
  // Gets all medicine from the animal with fetch
  const getMedicinesByAnimals = async (animal_id: string) => {
    //Fetch medicines (get)
    try {
      const response = await fetch(
        `http://localhost:8000/api/medicines/animals/${animal_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      ); //If response ok
      if (response.ok) {
        const jsonData = await response.json();
        //Set medicines
        setMedicineData(jsonData);
      } else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning av medicinering");
    }
  };

  // Gets all milk from the animal with fetch
  const getMilkByAnimals = async (animal_id: string) => {
    //Fetch get
    try {
      const response = await fetch(
        `http://localhost:8000/api/milks/animals/${animal_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      ); //If response ok
      if (response.ok) {
        const jsonData = await response.json();
        //Set milks
        setMilkingData(jsonData);

      } else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning av mjölk");
    }
  };

  const fetchAnimalsByHerd = async (herdId: string | null) => {
    //Fetch animals from herd (get) 
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
      //If response ok
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
      //Set index to this index plus 1
      setAnimalIndex(animalIndex + 1);
      //Change and navigate to new url
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
          <section className=" detailsArticle mx-auto m-3 w-100 border border-dark position-relative">
            <header className="detailsHeader w-100 p-2 d-flex justify-content-between  align-items-center ">
              <button onClick={() => clickPrev()}>
                {" "}
                <RiArrowLeftSLine size={32} />{" "}
              </button>
              <h2>
                {animalsByHerds[animalIndex].name}{" "}
                {animalsByHerds[animalIndex].id}
              </h2>
              <button onClick={() => clickNext()}>
                {" "}
                <RiArrowRightSLine size={32} />{" "}
              </button>
            </header>
            <article className=" w-75 mx-auto border border-dark detailsDiv">
              <div>
                <h3 className="h3details border border-bottom p-2">Grundinformation</h3>
                <div className="p-3">
                  {/*Check if image is uploaded to user or show generic image */}
                  {animalsByHerds[animalIndex].imagepath !== null ? (
                    <img
                      className="img-thumbnail cow-image"
                      src={animalsByHerds[animalIndex].imagepath}
                      alt="Bild på valt djur"
                    />
                  ) : (
                    <img
                      className="img-thumbnail cow-image"
                      src="\src\content\cow-image.png"
                      alt="Bild på siluett av djur"
                    />
                  )}
                </div>
                <div className="p-3">
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
            <article className="w-75 mx-auto m-2">
              <div>
                <Collapsible open title="Mjölkning">
                  {milkingData.length > 0 ? (
                    milkingData.map((milk, index) => (
                      <div key={index}>
                        <p>Datum: {milk.milkDate}</p>
                        <p>Mängd mjölk: {milk.kgMilk} kg</p>
                      </div>
                    ))
                  ) : (<p> Ingen mjölkning för detta djur</p>)}
                </Collapsible>
              </div>
            </article>
            <article className="w-75 mx-auto m-2">
              <div>
                <Collapsible open title="Medicinering">
                  {medicineData.length > 0 ? (
                    medicineData.map((medicine, index) => (
                      <div key={index}>
                        <p>Datum: {medicine.date}</p>
                        <p>Typ: {medicine.type} </p>
                        <p>Mängd: {medicine.amount} </p>
                        <p>Återkommande: {medicine.recurrent} </p>
                      </div>
                    ))
                  ) : (<p> Ingen medicin för detta djur</p>)}
                </Collapsible>
              </div>
            </article>
            <article className="w-75 mx-auto m-2">
              <div>
                <Collapsible open title="Vaccinering">
                  {vaccineData.length > 0 ? (
                    vaccineData.map((vaccine, index) => (
                      <div key={index}>
                        <p>Batchnummer: {vaccine.batchNo}</p>
                        <p>Namn: {vaccine.name} </p>
                        <p>Datum och tid: {vaccine.date} </p>

                      </div>
                    ))
                  ) : (<p> Inget vaccin för detta djur</p>)}
                </Collapsible>
              </div>
            </article>
            <article className="w-75 mx-auto m-2">
              <div>
                <Collapsible open title="Kalvning">
                  {calfData.length > 0 ? (
                    calfData.map((calf, index) => (
                      <div key={index}>
                        <p>Öronnummer: {calf.earNo}</p>
                        <p>Ras: {calf.breed}</p>
                        <p>Namn: {calf.name}</p>
                        <p>Förväntat födelsedatum: {calf.expectedBirthDate}</p>
                        <p>Födelsedatum:: {calf.birthDate} </p>
                        <p>Kön: {calf.sex} </p>
                        <p>Kategori: {calf.category} </p>

                      </div>
                    ))
                  ) : (<p> Ingen kalv för detta djur</p>)}
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
