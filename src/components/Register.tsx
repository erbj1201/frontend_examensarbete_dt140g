//import
import React, { useEffect, useState, FormEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import DOMPurify from "dompurify";
//Structure for UserItem
interface UserItem {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const RegisterPage: React.FC = () => {
  //Hook navigation
  const navigate = useNavigate();
   //Create new instance of cookie
   const cookies = new Cookies();
   //Get token
   const token = cookies.get("token");
//State for messages to form
  const [showMessage, setShowMessage] = useState<string | null>(null);
  //State to handle checkbox
  const [isChecked, setIsChecked] = useState(false);
//Handle checkbox
  const checkHandler = () => {
    setIsChecked(!isChecked)
  }
  //State store data
  const [newUser, setNewUser] = useState<UserItem>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //State for error store data
  const [formError, setFormError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gdpr: "",
  });


   // Function to clear update and delete messages after a specified time
   const clearMessages = () => {
    //Clear messages
    setShowMessage(null);
    setFormError({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      gdpr: "",
    });
  };

  //Check if token exist, send to startpage
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);
  //Handle input
  const handleUserInput = (name: string, value: string) => {
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const registerUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Object to track input errors
    let inputError = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      gdpr: "",
    };
        // Control if checkbox is checked
  if (!isChecked) {
    return;
  }
    // Check if name, email and password are empty
    if (!newUser.name && !newUser.email && !newUser.password) {
      setFormError({
        ...inputError,
        name: "Fyll i ett namn",
        email: "Fyll i en korrekt mejladress",
        password: "Fyll i ett lösenord",
      
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if name empty
    if (!newUser.name) {
      setFormError({
        ...inputError,
        name: "Fyll i ett namn",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if email empty
    if (!newUser.email) {
      setFormError({
        ...inputError,
        email: "Fyll i en korrekt mejladress",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if password and confirm password match
    if (newUser.confirmPassword !== newUser.password) {
      setFormError({
        ...inputError,
        confirmPassword:
          "Lösenord och bekräftat lösenord är inte lika, försök igen",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }
    //Check if password empty
    if (!newUser.password) {
      setFormError({
        ...inputError,
        password: "Fyll i ett lösenord",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
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
    });

    //fetch (post) register new user
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
        });
        console.log(responseData);
        setIsChecked(false);
        setShowMessage('En ny användare är registrerad')
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
     } else if(response.status === 400) { 
      setShowMessage('Mejladressen är upptagen av en annan användare')
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
     } else {
      setShowMessage('Ett oväntat fel har inträffat, försök igen')
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
     }
    } catch (error) {
      console.log(error);
      setShowMessage('Användaren kunde inte skapas')
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
    }
  };

  return (
    <div>
      <h1>Registrera konto</h1>
      {/*form to register user*/}
      {showMessage && (
        <p className="alert mx-auto alert-success text-dark w-25 mx-auto text-center mt-2">{showMessage}</p>
      )}
      <form
        className="form-control form-control-sm mx-auto handleForm shadow border border-dark bglight"
        onSubmit={registerUser}
        noValidate //The formdata is not automaticallly validated by the browser
      >
        <h2 className="p-3 mb-4">Fyll i dina uppgifter</h2>
        {/*Form to add user*/}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Namn:
          </label>
          <input
            type="name"
            id="name"
            name="name"
            className="form-control form-control-sm border border-dark"
            required
            value={newUser.name}
            onChange={({ target }) =>
              handleUserInput(target.name, target.value)
            }
          />
          <p className="error-message text-danger fw-bold">{formError.name}</p>
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Mejladress:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control form-control-sm border border-dark"
            required
            value={newUser.email}
            onChange={({ target }) =>
              handleUserInput(target.name, target.value)
            }
            autoComplete="new-email" 
          />
          <p className="error-message text-danger fw-bold">{formError.email}</p>
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Lösenord:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control form-control-sm border border-dark"
            required
            value={newUser.password}
            onChange={({ target }) =>
              handleUserInput(target.name, target.value)
            }
          />
          <p className="error-message text-danger fw-bold">{formError.password}</p>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Bekräfta lösenord:
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-control form-control-sm border border-dark"
            required
            value={newUser.confirmPassword}
            onChange={({ target }) =>
              handleUserInput(target.name, target.value)
            }
          />
          <p className="error-message text-danger fw-bold">{formError.confirmPassword}</p>
        </div>
        <div className="form-check">
  <input className="form-check-input border-dark" type="checkbox" checked={isChecked} id="gdpr" onChange={checkHandler}/>
  <label className="form-check-label" htmlFor="gdpr">
    Jag godkänner behandlingen av personuppgifter enligt <NavLink to="/gdpr"> information om behandling av personuppgifter</NavLink>.
  </label> <br /> <br />
  {/**If all fields are filled in and checkbox not checked, show message that checkbox must be checked */}
  { newUser.email && newUser.password && newUser.name && newUser.confirmPassword &&!isChecked && <p className="error-message text-danger fw-bold">Du måste godkänna behandlingen av personuppgifter för att skapa en användare</p> }
</div>
        <button type="submit" className="button mt-2">
          Skapa användare
        </button>
        <p>
          Har du redan ett konto?<NavLink to="/login"> Logga in</NavLink>
        </p>
      </form>
    </div>
  );
};
//export
export default RegisterPage;
