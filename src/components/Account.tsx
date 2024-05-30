/* Webbutvecklingsprogrammet
Självständigt arbete DT140G
Erika Vestin & Sofia Dahlberg */
/*Account component*/
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
//Structure of user
interface User {
  name: string;
  email: string;
  password: string;
  id: string;
  imagepath: string;
}

export default function Account() {
  //States
  const cookies = new Cookies();
  const token = cookies.get("token");
  const userid = sessionStorage.getItem("userid");
  const [editUser, setEditUser] = useState(false);
  const [editImageData, setEditImageData] = useState(false);
  /* Set User */
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    password: "",
    id: "",
    imagepath: "",
  });

  //State for Edit user
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    password: "",
  });

  //State for error store data
  const [formError, setFormError] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  //Get user by Id
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
  /* Handle function to edit data */
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
  /* Change image */
  const editImage = () => {
    setEditImageData(true);
    imagepath: imageUrl || ""

  };

  // Function to clear update and delete messages after a specified time
  const clearMessages = () => {
    //clear messages
    setShowMessage(null);
  };
  //Update user info (not image)
  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //Object to track input errors
    let inputError = {
      name: "",
      email: "",
      password: "",
    };
    /* Error  */
    if (!inputData.name && !inputData.email && !inputData.password) {
      setFormError({
        ...inputError,
        name: "Fyll i ett namn",
        email: "Fyll i en mejladress",
        password: "Fyll i ditt lösenord"
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    if (!inputData.name) {
      setFormError({
        ...inputError,
        name: "Fyll i ett namn",
      })
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;

    }
    if (!inputData.email) {
      setFormError({
        ...inputError,
        email: "Fyll i en mejladress",
      })
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    if (!inputData.password) {
      setFormError({
        ...inputError,
        password: "Fyll i ditt lösenord"
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }


    //Sanitize values
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
    //Change user data (fetch put)
    try {
      const response = await fetch(`http://localhost:8000/api/users/${userid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }, // Send data with body
        body: JSON.stringify({
          name: sanitizedName,
          email: sanitizedEmail,
          password: sanitizedPassword,
        }),
      });

      //If response ok
      if (response.ok) {
        //Show message
        setShowMessage("Ändringarna är sparade");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
        //Set edit user to false and get user info 
        setEditUser(false);
        fetchUser();
        //If response 400, password is not correct
      } else if (response.status == 400) {
        //show message
        setShowMessage("Kunde inte spara, ange ett korrekt lösenord");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      }
    } catch (error) {
      //Error message
      setShowMessage("Ändringarna kunde inte sparas");
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      console.error("Error updating user", error);
    }
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
    //Call function handleimagechange 
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
        const response = await fetch(`http://localhost:8000/api/users/images/${userid}`, {
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
          fetchUser();
        } //If error
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div className="container">
      {/** If edituser is true, show form to Edit User */}
      {editUser ? (
        <div className="bglight p-2 m-3 mx-auto account-large border border-dark d-flex flex-column shadow">
          <h2 className="account-heading mx-auto p-4">Uppdatera dina uppgifter</h2>
          <form
            className="form-control handleForm form-control-sm border-0 p-2 mx-auto w-100"
            onSubmit={updateProfile}
            noValidate
          > {/*Message for form if success */}
            {showMessage && (
              <p className="alert mx-auto alert-success text-dark w-100 mx-auto text-center mt-2">{showMessage}</p>
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
                className="form-control form-control-sm border-dark"
                onChange={handleChange}
                required
              />
              <p className="error-message text-danger fw-bold">
                {formError.name}
              </p>
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
                className="form-control form-control-sm border-dark"
                onChange={handleChange}
                required
              />
              <p className="error-message text-danger fw-bold">
                {formError.email}
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Skriv ditt aktuella lösenord för att spara ändringar:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={inputData.password}
                className="form-control form-control-sm border-dark"
                onChange={handleChange}
                required
              />
              <p className="error-message text-danger fw-bold">
                {formError.password}
              </p>
            </div>
            <div className="mx-auto d-flex justify-content-between w-75 account-btns">
              <button type="submit" className="button m-3">
                Spara ändringar
              </button>
              <button className="button m-3" onClick={() => setEditUser(false)}>Tillbaka</button>
            </div>
          </form>
        </div>
      ) : user ? (
        <div className="bglight account-large p-2 m-3 mx-auto shadow border border-dark d-flex flex-column ">
          {/**Messages for form */}
          {showMessage && (
            <p className="alert mx-auto alert-success text-dark w-100 mx-auto text-center mt-2">{showMessage}</p>
          )}
          <h2 className="mx-auto account-heading p-3 text-center">Användaruppgifter</h2>
          <div className="container account-div d-flex justify-content-center">
            <div className="d-flex flex-column">
              {/*Check if image is uploaded to user or show generic image */}
              {user.imagepath !== null ? (
                <img className="userImage mx-auto img-thumbnail" src={user.imagepath} alt="Bild på användare" />
              ) : (
                <img className="userImage mx-auto img-thumbnail" src="\src\content\profile_img.png" alt="Bild på en siluett av en människa" />
              )}
            </div>
            <div className="d-flex flex-column mx-auto m-3 p-4">
              <p className="account-text"><strong>Namn:</strong> {user.name}</p>
              <p className="account-text"><strong>Mejladress:</strong> {user.email}</p>
            </div>
          </div>
          <div className="mx-auto d-flex justify-content-between account-btns">
            <button className="button m-3" onClick={editImage}>Byt bild</button>
            <button className="button m-3" onClick={editData}>Ändra användaruppgifter</button>
          </div>
        </div>
      ) : (
        <p>Ingen användare hittades.</p>

      )} {/*if Editimagedata is true, show form*/}
      {editImageData ? (
        <div className="bglight p-2 m-3 mx-auto account-large border border-dark d-flex flex-column shadow">
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
                className="form-control form-control-sm border-dark"
                onChange={handleImageChange}
              />
            </div>
            <button className="button mx-auto m-3" onClick={() => setEditImageData(false)}>Avbryt</button>
          </form>
        </div>
      ) : (
        null
      )
      }
    </div>

  );
}
