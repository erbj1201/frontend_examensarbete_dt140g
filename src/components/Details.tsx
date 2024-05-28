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
//Define image
/*  interface Image {
  imagepath: string;
}  */

const DetailsPage: React.FC = () => {
  //States
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

  //Edit Image
  const [editImageData, setEditImageData] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  //State for edit image
  /* const [image, setImage] = useState<Image>({
      imagepath: "",
    }); */

  /*   useEffect(() => {
      if (id) {
       
        getMedicinesByAnimals(id);
        getVaccinesByAnimals(id);
        getCalvesByAnimals(id);
      }
    }, [id]); */
  
  
    // Gets all calves from animal with fetch
    const getCalvesByAnimals = async (animal_id: string|undefined) => {
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
    const getVaccinesByAnimals = async (animal_id: string| undefined) => {
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
    const getMedicinesByAnimals = async (animal_id: string| undefined) => {
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
    const getMilkByAnimals = async (animal_id: string| undefined) => {
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
    //Fetch animals from herd (with get) 
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
        if (id) {
          const index = jsonData.findIndex((animal: Animal) => animal.id === parseInt(id));
          if (index !== -1) {
            setAnimalIndex(index);
          }
        }
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

   //Fetch animal by id
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
      //If response ok
      if (response.ok) {
        const jsonData = await response.json();
        const herdIdJson = jsonData.herd_id;

        setHerdId(herdIdJson);
        //Find index
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

  useEffect(() => {
    //Check if id exist
    if (id != null) {
      getAnimalById(id);
    }
  }, []);

  useEffect(() => {
    if (herdId !== null) {
      fetchAnimalsByHerd(herdId);
    }
  }, [herdId]);
  //Writes out information depending on index
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
  //Edit image
  const editImage = () => {
    setEditImageData(true);
    imagepath: imageUrl || ""
  };

  // Function to clear update and delete messages after a specified time
  const clearMessages = () => {
    //clear messages
    setShowMessage(null);
  };
  const handleSubmitImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Get file input from input-field
    const fileInput = e.currentTarget.querySelector('#imagepath') as HTMLInputElement;
    //Pass the file to a new form data object
    const formData = new FormData(e.currentTarget);
    //Sunthetic change event to simulate file input changes
    const event = {
      target: {
        files: fileInput.files,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    //Call handleimagechange 
    handleImageChange(event);
    console.log(formData)
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //Get file if exists
    const file = e.target?.files && e.target.files[0];
    if (file) {
      //Preview the image for the user
      const reader = new FileReader();
      //When file is loaded, set img url
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setImageUrl(result);
        }
      }; //If error reading file, show in console
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      }; //Read image as data url
      reader.readAsDataURL(file);
      //Send image to server
      const formData = new FormData();
      formData.append("imagepath", file);
      //Fetch (post)
      try {
        const response = await fetch(`http://localhost:8000/api/animals/images/${id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }, //Send data with body
          body: formData,
        });

        //If response ok
        if (response.ok) {
          //Show message
          setShowMessage("Bilden är ändrad");
          // Clear message after  3 seconds
          setTimeout(clearMessages, 3000);
          //Set edit image to false
          setEditImageData(false);
          //Get user 
          fetchAnimalsByHerd(herdId);
        } //If error
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };



  return (
    <div>
      <p>Antal djur i besättningen: {animalsByHerds.length}</p>
      {animalDataWithIndex.length > 0 && (
        <div key={animalsByHerds[animalIndex].id}>
          <section className=" detailsArticle mx-auto m-3 pb-5 border border-grey shadow position-relative">
            <header className="detailsHeader w-100 p-2 d-flex justify-content-between align-items-center ">
              <button className="btn btn-light border-dark btn-next-animal" onClick={() => clickPrev()}>
                {" "}
                <RiArrowLeftSLine className="arrow" size={32} />{""}
                <strong>Föregående</strong></button>
              <h2 className="fs-6">
                {animalsByHerds[animalIndex].name}{" "}
                {animalsByHerds[animalIndex].birthDate}
              </h2>
              <button className="btn btn-light border-dark btn-next-animal" onClick={() => clickNext()}>
                {" "}<strong>Nästa</strong>
                <RiArrowRightSLine className="arrow" size={32} />{" "}
              </button>
            </header>
            <div className="mx-auto animalInformation">
              <article className=" mx-auto border border-dark detailsDiv">
                <div>
                  <h3 className="h3details border border-bottom p-2">Grundinformation</h3>
                  <div className="container">
                    <div className="row">
                      <div className=" col-12 col-md-8 col-lg-8 p-3 d-flex flex-column align-items-start">
                        {/*Check if image is uploaded to user or show generic image */}
                        {animalsByHerds[animalIndex].imagepath !== null ? (
                          <img
                            className="img-thumbnail cow-image"
                            src={animalsByHerds[animalIndex].imagepath}
                            alt="Bild på djur"
                          />
                        ) : (
                          <img
                            className="img-thumbnail cow-image"
                            src="\src\content\cow-image.png"
                            alt="Bild på siluett av djur"
                          />
                        )}
                        <div>
                          {showMessage && (
                            <p className="alert w-100 mx-auto alert-success text-dark text-center mt-2">{showMessage}</p>
                          )}
                          <button className="button m-3" onClick={editImage}>Byt bild</button>
                        </div>
                        {/*if editimagedata is true, show form*/}
                        {editImageData ? (
                          <div className="bglight p-1 m-3 mx-auto border w-100 border-dark shadow-sm">
                            <p className="text-center"><strong>Ladda upp en ny bild, bilden byts ut automatiskt</strong></p>
                            <form className="form-control mx-auto handleForm form-control-sm border-0 mx-auto" onSubmit={handleSubmitImage}>
                              <div className="form-group" >
                                <label htmlFor="imagepath" className="form-label">
                                  Välj bild
                                </label>
                                <input
                                  type="file"
                                  id="imagepath"
                                  name="imagepath"
                                  className="form-control form-control-sm shadow-sm border-dark"
                                  onChange={handleImageChange}
                                />
                              </div>
                              <button className="button mx-auto m-4" onClick={() => setEditImageData(false)}>Avbryt</button>
                            </form>
                          </div>
                        ) : (
                          null
                        )
                        }
                      </div>
                      <div className="col-12 col-md-4 col-lg-4 p-3 detailsDivText">
                        <p>
                          <strong>Djuridentitet: </strong>
                          {animalsByHerds[animalIndex].animalId}
                        </p>
                        <p>
                          <strong>Öronnummer: </strong>
                          {animalsByHerds[animalIndex].earNo}
                        </p>
                        <p>
                          <strong>Födelsedatum: </strong>
                          {animalsByHerds[animalIndex].birthDate}
                        </p>
                        <p>
                          <strong>Ras: </strong>
                          {animalsByHerds[animalIndex].breed}
                        </p>
                        <p>
                          <strong>Kön: </strong>
                          {animalsByHerds[animalIndex].sex}
                        </p>
                        <p>
                          <strong>Användning: </strong>
                          {animalsByHerds[animalIndex].category}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
              <article className="collapsible mx-auto m-2">
                <div>
                  <Collapsible open title="Mjölkning"
                 onClick={() => getMilkByAnimals(id)}>
                    {milkingData.length > 0 ? (
                      milkingData.map((milk, index) => (
                        <div className="collapsibleInfo" key={index}>
                          <ul>
                          <li><strong>Datum:</strong> {milk.milkDate}</li>
                          <li><strong>Mängd mjölk: </strong>{milk.kgMilk} Kg</li>
                          </ul>
                        </div>
                      ))
                    ) : (<p> Ingen mjölkning för detta djur</p>)}
                  </Collapsible>
                </div>
              </article>
              <article className="collapsible mx-auto m-2">
                <div>
                  <Collapsible open title="Medicinering"
                    onClick={() => getMedicinesByAnimals(id)}>
                    {medicineData.length > 0 ? (
                      medicineData.map((medicine, index) => (
                        <div className="collapsibleInfo" key={index}>
                          <ul>
                          <li><strong>Datum:</strong> {medicine.date}</li>
                          <li><strong>Typ: </strong>{medicine.type} </li>
                          <li><strong>Mängd: </strong>{medicine.amount} </li>
                          <li><strong>Återkommande: </strong>{medicine.recurrent ? "Ja" : "Nej"} </li>
                          </ul>
                        </div>
                      ))
                    ) : (<p> Ingen medicin för detta djur</p>)}
                  </Collapsible>
                </div>
              </article>
              <article className="collapsible mx-auto m-2">
                <div>
                  <Collapsible open title="Vaccinering"
                    onClick={() => getVaccinesByAnimals(id)}>
                    {vaccineData.length > 0 ? (
                      vaccineData.map((vaccine, index) => (
                        <div className="collapsibleInfo" key={index}>
                          <ul>
                          <li><strong>Batchnummer: </strong>{vaccine.batchNo}</li>
                          <li><strong>Namn:</strong> {vaccine.name} </li>
                          <li><strong>Datum och tid:</strong> {vaccine.date} </li>
                          </ul>
                        </div>
                      ))
                    ) : (<p> Inget vaccin för detta djur</p>)}
                  </Collapsible>
                </div>
              </article>
              <article className="collapsible mx-auto m-2">
                <div>
                  <Collapsible open title="Kalvning"
                    onClick={() => getCalvesByAnimals(id)}>
                    {calfData.length > 0 ? (
                      calfData.map((calf, index) => (
                        <div className="collapsibleInfo" key={index}>
                          <ul>
                          <li><strong>Öronnummer:</strong> {calf.earNo}</li>
                          <li><strong>Ras:</strong> {calf.breed}</li>
                          <li><strong>Namn: </strong>{calf.name}</li>
                          <li><strong>Förväntat födelsedatum: </strong>{calf.expectedBirthDate}</li>
                          <li><strong>Födelsedatum:</strong> {calf.birthDate} </li>
                          <li><strong>Kön: </strong>{calf.sex} </li>
                          <li><strong>Kategori: </strong>{calf.category} </li>
                          </ul>
                        </div>
                      ))
                    ) : (<p> Ingen kalv för detta djur</p>)}
                  </Collapsible>
                </div>
              </article>
               </div>
          </section>
        </div>
           
  )
}
        </div >
      );
};
export default DetailsPage;
