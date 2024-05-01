import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";

interface User {
  name: string;
  email: string;
  password: string;
  id: string;
  imagepath: string;
}

interface Image { 
  imagepath: string;
}

const cookies = new Cookies();
const token = cookies.get("token");
const userid = sessionStorage.getItem("userid");

export default function Account() {
  const [editUser, setEditUser] = useState(false);
  const [editImageData, setEditImageData] = useState(false);
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    password: "",
    id: "",
    imagepath: "",
  });
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const[image, setImage] = useState<Image>({
    imagepath: "",
  });
  
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${userid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (response.ok) {
        const jsonData = await response.json();
        setUser(jsonData);
      } else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning av användare", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const editData = () => {
    setEditUser(true);
    setInputData({
      name: user.name,
      email: user.email,
      password: "",
    });
  };

  const editImage = () => {
    setEditImageData(true);
    setImage({
      imagepath: imageUrl || ""
    });
  };

  // Function to clear update and delete messages after a specified time
  const clearMessages = () => {
    //clear messages
    setShowMessage(null);
  };
//update user info (not image)
  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //sanitize values
    const { name, email, password } = inputData;
    const sanitizedEmail = DOMPurify.sanitize(email);
    const sanitizedName = DOMPurify.sanitize(name);
    const sanitizedPassword = DOMPurify.sanitize(password);
    setUser({
      ...user,
      name: sanitizedName,
      email: sanitizedEmail,
      password: sanitizedPassword,
    });
    //fetch (put)
    try {
      const response = await fetch(`http://localhost:8000/api/users/${userid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }, // send data with body
        body: JSON.stringify({
          name: sanitizedName,
          email: sanitizedEmail,
          password: sanitizedPassword,
      
        }),
      });
    
      //if response ok
      if (response.ok) {
        //show message
        setShowMessage("Ändringarna är sparade");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
        //set edit user to false and get user info 
        setEditUser(false);
        fetchUser();
        //if response 400, password is not correct
      } else if( response.status==400){
        //show message
        setShowMessage("Fel lösenord, kunde inte spara");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
    } catch (error) {
      //error message
      setShowMessage("Ändringarna kunde inte sparas");
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      console.error("Error updating user", error);
    }
  };
  const handleSubmitImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //get file input from input-field
    const fileInput = e.currentTarget.querySelector('#imagepath') as HTMLInputElement;
    //pass the file to a new form data object
    const formData = new FormData(e.currentTarget);
    //sunthetic change event to simulate file input changes
    const event = {
      target: {
        files: fileInput.files,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    //call handleimagechange 
    handleImageChange(event);
    console.log(formData)
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //get file if exists
    const file = e.target?.files && e.target.files[0];
    if (file) {
      //Preview the image for the user
      const reader = new FileReader();
      //when file is loaded, set img url
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setImageUrl(result);
        }
      }; //if error reading file, show in console
        reader.onerror = (error) => {
      console.error("Error reading file:", error);
    }; //read image as data url
      reader.readAsDataURL(file);
      //Send image to server
      const formData = new FormData();
      formData.append("imagepath", file);
      //fetch (post)
      try {
        const response = await fetch(`http://localhost:8000/api/users/images/${userid}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }, //send data with body
          body: formData,
        });
      
       //if response ok
        if (response.ok) {
          //show message
      setShowMessage("Bilden är ändrad");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
        //Set edit image to false
        setEditImageData(false);
        //get user 
        fetchUser();
        } //if error
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div className="container">
      {/** If edituser is true, show form */}
      {editUser ? (
         <div className="bglight p-2 m-3 mx-auto w-75 d-flex flex-column shadow-sm">
        <h3 className="mx-auto">Uppdatera dina uppgifter</h3>
        <form
          className="form-control handleForm form-control-sm border-0 p-2 mx-auto w-50"
          onSubmit={updateProfile}
        > {/*Message for form */}
          {showMessage && (
            <p className="alert alert-light text-center mt-2">{showMessage}</p>
          )}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Namn:
            </label>
            <input
              type="name"
              id="name"
              name="name"
              value={inputData.name}
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Mejladress:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={inputData.email}
              className="form-control"
              onChange={handleChange}
              required
            />
            <label htmlFor="password" className="form-label">
              Skriv ditt aktuella lösenord för att spara ändringar:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={inputData.password}
              className="form-control"
              onChange={handleChange}
              required
            />
            <button type="submit" className="m-3">
              Spara ändringar
            </button>
            <button className=" mb-2" onClick={() => setEditUser(false)}>Tillbaka</button>
          </div>
        </form>
        </div>
      ) : user ? (
        <div className="bglight p-2 m-3 mx-auto w-75 border-secondary d-flex flex-column shadow-sm">
          {/**Messages to form */}
          {showMessage && (
            <p className="alert alert-light text-center mx-auto">{showMessage}</p>
          )}
          <h3 className="mx-auto p-4">Användaruppgifter</h3>
          <div className="container d-flex justify-content-center ">
          <div className="d-flex flex-column">
          <img className="userImage mx-auto img-thumbnail m-5" src={user.imagepath} alt="Bild på användare"/>
          
          </div>
          <div className="d-flex flex-column mt-5 p-5">
          <p><strong>Namn:</strong> {user.name}</p>
          <p><strong>Mejladress:</strong> {user.email}</p>
          </div>
          </div>
          <div className="mx-auto d-flex justify-content-between">
          <button className="m-3" onClick={editImage}>Byt bild</button>
          <button className="m-3" onClick={editData}>Ändra användaruppgifter</button>
            </div>
          
        </div>
      ) : (
        <p>Ingen användare hittades.</p>
        
      )} {/*if editimagedata is true, show form*/}
       {editImageData? (
 <div className="bglight p-2 m-3 mx-auto w-75 border-secondary d-flex flex-column shadow-sm">
  <p className="text-center"><strong>Ladda upp en ny bild, bilden byts ut automatiskt</strong></p>
<form className="form-control mx-auto handleForm form-control-sm border-0 mx-auto w-50" onSubmit={handleSubmitImage}>
<div className="form-group" >
            <label htmlFor="imagepath" className="form-label">
              Välj bild
            </label>
            <input
  type="file"
  id="imagepath"
  name="imagepath"
  className="form-control"
  onChange={handleImageChange}
/>
          </div>
          <button className="mx-auto m-4" onClick={() => setEditImageData(false)}>Avbryt</button>
          </form>
          </div>
       ) : (
        null
       )
      }
    </div>
    
  );
}
