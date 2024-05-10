/*Login component*/
//import
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function Login() {
  //Hook navigation
  const navigate = useNavigate();
  //State for storing data
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  //State for error to form
  const [formError, setFormError] = useState({
    email: "",
    password: "",
  });
  //Create new instance of cookie
  const cookies = new Cookies();
  //get token
  const token = cookies.get("token");

  //One hour in milliseconds
  const oneHour = 60 * 60 * 1000;
  //Expire date is one hour
  const expireDate = new Date(Date.now() + oneHour);
  //To show message when login
  const [showMessage, setShowMessage] = useState<string | null>(null);
  //Event for handling input-changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };
  //check if token exist, send to startpage
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  // Function to clear update and delete messages after a specified time
  const clearMessages = () => {
    //clear messages
    setShowMessage(null);
    setFormError({
      email: "",
      password: "",
    });
  };
  //Event for handling login
  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //Object to track input errors
    let inputError = {
      email: "",
      password: "",
    };

    // check if title, description are empty
    if (!userData.email && !userData.password) {
      setFormError({
        ...inputError,
        email: "Fyll i en mejladress",
        password: "Fyll i ett lösenord",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }

    // check if title, description are empty
    if (!userData.email) {
      setFormError({
        ...inputError,
        email: "Fyll i en mejladress",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }

    // check if title, description are empty
    if (!userData.password) {
      setFormError({
        ...inputError,
        password: "Fyll i ett lösenord",
      });
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
      return;
    }

    //Fetch
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      //Response ok, get token and store
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        const userid = data.userId;
        //Set cookie with secure, samsite, expires in one hour
        cookies.set("token", token, {
          secure: true,
          sameSite: "strict",
          expires: expireDate,
        });
        //Save userid to session storage
        sessionStorage.setItem("userid", userid);
        // Redirect to start-page
        navigate("/");
      } else {
        //Error login
        setShowMessage("Felaktig inloggning, fel mejladress eller lösenord");
        // Clear message after  3 seconds
        setTimeout(clearMessages, 3000);
      } //Error login
    } catch (error) {
      setShowMessage("Fel vid inloggning");
      // Clear message after  3 seconds
      setTimeout(clearMessages, 3000);
    }
  };
  return (
    <div>
      {/*Login-form*/}
      {showMessage && (
        <p className="alert alert-danger text-dark text-center mx-auto mt-2 w-50">{showMessage}</p>
      )}

      <form
        className="form-control handleForm shadow-sm form-control-sm border border-dark p-5 mx-auto mb-5 mt-5 w-50 h-50 bglight"
        onSubmit={loginUser}
        noValidate
      >
        {" "}
        <h1 className="mb-5">Logga in</h1>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Mejladress:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control form-control-sm shadow-sm border-dark"
            required
            value={userData.email}
            onChange={handleInputChange}
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
            className="form-control form-control-sm shadow-sm border-dark"
            required
            value={userData.password}
            onChange={handleInputChange}
          />
          <p className="error-message text-danger fw-bold">{formError.password}</p>
        </div>
        <button type="submit" className="button mt-2">
          Logga in
        </button>
        <p>
          Har du inget konto? <NavLink to="/register">Registrera dig här</NavLink>
        </p>
      </form>
    </div>
  );
}
//export
export default Login;
