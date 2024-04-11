import React, { useState, FormEvent } from "react";
import DOMPurify from "dompurify";
//Structure for UserItem
interface UserItem {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  successMsg: string;
}
const RegisterPage: React.FC = () => {
  //State store data
  const [newUser, setNewUser] = useState <UserItem>({
    name: "",
    email: "",
    password: "",
    confirmPassword:"",
    successMsg: "",
  });

 //State store data
 const [formError, setFormError] = useState({
  name: "",
  email: "",
  password: "",
  confirmPassword:"",
});


const handleUserInput = (name: string, value: string) => {
  setNewUser({
    ...newUser,
    [name]: value,
  });
};

//const [userMessage, setUserMessage] = useState<string | null>(null);

const registerUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Object to track input errors
    let inputError = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
// check if name, email and password are empty
if(! newUser.name && !newUser.email && !newUser.password){
  setFormError({
    ...inputError,
    name: "Fyll i ett namn",
    email: "Fyll i en korrekt mejladress",
    password: "Fyll i ett lösenord",
  });
  return;
}
//Check if name empty
if(!newUser.name){
  setFormError({
    ...inputError,
    name: "Fyll i ett namn",
  });
  return;
}
//Check if email empty
if(!newUser.email){
  setFormError({
    ...inputError,
    email: "Fyll i en korrekt mejladress",
  });
  return;
}
//Check if password and confirm password match
if(newUser.confirmPassword !== newUser.password){
  setFormError({
    ...inputError,
    confirmPassword: "Lösenord och bekräftat lösenord är inte lika, försök igen",
  });
  return;
}

//Check if password empty
if(!newUser.password){
  setFormError({
    ...inputError,
    password: "Fyll i ett lösenord",
  });
  return;
}

    // Sanitize user input using DOMPurify
    const sanitizedName = DOMPurify.sanitize(newUser.name);
    const sanitizedEmail = DOMPurify.sanitize(newUser.email);
    const sanitizedPassword = DOMPurify.sanitize(newUser.password);


    // Update state with sanitized values
    setNewUser({
      name: sanitizedName,
      email: sanitizedEmail,
      password: sanitizedPassword,
      confirmPassword: newUser.confirmPassword,
      successMsg: newUser.successMsg,
    });

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: sanitizedName,
          email: sanitizedEmail,
          password: sanitizedPassword,
        }),
      });
      const responseData = await response.json();
      //If response ok
      if (response.ok) {
        setNewUser({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          successMsg: "",
        });
      }
      console.log(responseData);
    } catch (error) {
      console.log(error)
    }
  };
  
  return (
    <div>
        <h1>Registrera konto</h1>
        <form
          className="form-control form-control-sm border-0 p-2 mx-auto w-100"
          onSubmit={registerUser}
          noValidate //The formdata is not automaticallly validated by the browser
        >
       {/*    {userMessage && (
            <p className="alert alert-light text-center mt-2">
              {userMessage}
            </p>
          )} */}
          <p className="success-message">{newUser.successMsg}</p>
          {/*Form to add user*/}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Namn:
            </label>
            <input
              type="name"
              id="name"
              name="name"
              className="form-control"
              required
              value={newUser.name}
              onChange={({target}) => handleUserInput(target.name, target.value)}
            />
            <p className="error-message">{formError.name}</p>
            </div>
            <div className="form-group">
            <label htmlFor="email" className="form-label">
              Mejladress:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              required
              value={newUser.email}
              onChange={({target}) => handleUserInput(target.name, target.value)}
             autoComplete="new-email" //Alternativ att det är i mailformat
            />
            <p className="error-message">{formError.email}</p>
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Lösenord:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              required
              value={newUser.password}
              onChange={({target}) => handleUserInput(target.name, target.value)}
            />
            <p className="error-message">{formError.password}</p>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Bekräfta lösenord:
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
              required
              value={newUser.confirmPassword}
              onChange={({target}) => handleUserInput(target.name, target.value)}
            />
            <p className="error-message">{formError.confirmPassword}</p>
          </div>
          <button type="submit" className="btn btn-secondary mt-2">
            Skapa användare
          </button>
        </form>
    </div>
  );
};
export default RegisterPage;
