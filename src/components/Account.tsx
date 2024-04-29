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

  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    try {
      const response = await fetch(`http://localhost:8000/api/users/${userid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: sanitizedName,
          email: sanitizedEmail,
          password: sanitizedPassword,
      
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (response.ok) {
        setShowMessage("Ändringarna är sparade");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
        setEditUser(false);
        fetchUser();
      } else if( response.status==400){
        setShowMessage("Fel lösenord, kunde inte spara");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
    } catch (error) {
      setShowMessage("Ändringarna kunde inte sparas");
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      console.error("Error updating user", error);
    }
  };
  const handleSubmitImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = e.currentTarget.querySelector('#imagepath') as HTMLInputElement;
    const formData = new FormData(e.currentTarget);
    const event = {
      target: {
        files: fileInput.files,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleImageChange(event);
    console.log(formData)
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files && e.target.files[0];
    if (file) {
      // Förhandsvisa bilden för användaren
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setImageUrl(result);
        }
      };
        reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

      reader.readAsDataURL(file);
  
      // Skicka bilden till servern för uppladdning
      const formData = new FormData();
      formData.append("imagepath", file);
  
      try {
        const response = await fetch(`http://localhost:8000/api/users/images/${userid}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        });
        const responseData = await response.json();
        console.log(responseData);
        if (response.ok) {
      setShowMessage("Bilden är ändrad");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
        setEditImageData(false);
        fetchUser();

        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div>
      {editUser ? (
        <form
          className="form-control handleForm form-control-sm border-0 p-2 mx-auto w-100"
          onSubmit={updateProfile}
        >
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
            <button type="submit" className="btn btn-primary">
              Spara ändringar
            </button>
          </div>
        </form>
      ) : user ? (
        <div>
          {/**Messages to form */}
          {showMessage && (
            <p className="alert alert-light text-center mt-2">{showMessage}</p>
          )}
          <p>Namn: {user.name}</p>
          <p>Mejladress: {user.email}</p>
          <button onClick={editData}>Ändra</button>
          <img className="userImage" src={user.imagepath} alt="Bild på användare"/>
          
          <button onClick={editImage}>Byt bild</button>
        </div>
      ) : (
        <p>Ingen användare hittades.</p>
      )}
       {editImageData? (
<form onSubmit={handleSubmitImage}>
<div className="form-group" >
            <label htmlFor="imagepath" className="form-label">
              Bild:
            </label>
            <input
  type="file"
  id="imagepath"
  name="imagepath"
  className="form-control"
  onChange={handleImageChange}
/>
          </div>
          </form>
       ) : (
        null
       )
      }
    </div>
  );
}
