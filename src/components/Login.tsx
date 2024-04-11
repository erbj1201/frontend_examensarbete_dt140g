import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function Login() {
  //Hook navigation
  const navigate = useNavigate();
  //State for storing data
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  //Create new instance of cookie
  const cookies = new Cookies();
  //One hour in milliseconds
  const oneHour = 2 * 60 * 1000;
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
  //Event for handling login
  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        //Set cookie with secure, samsite, expires in one hour
        cookies.set("token", token, {
          secure: true,
          sameSite: "strict",
          expires: expireDate,
        });

        //Show token in console -- remove later!!
        //console.log(cookies.get("token"));
        // Redirect to start-page
        navigate("/");
      } else {
        //Error login
        setShowMessage("Felaktig inloggning, fel mejladress eller lösenord");
      } //Error login //Error login
    } catch (error) {
      setShowMessage("Fel vid inloggning");
    }
  };
  return (
    <div>
      {/*Login-form*/}
      <h1 className="p-5 m-5">Logga in</h1>
      {showMessage && (
        <p className="alert alert-light text-center mt-2">{showMessage}</p>
      )}
      <form
        className="form-control form-control-sm border-0 p-2 mx-auto w-100"
        onSubmit={loginUser}
      >
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
            value={userData.email}
            onChange={handleInputChange}
          />
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
            value={userData.password}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="btn btn-secondary mt-2">
          Logga in
        </button>
      </form>
    </div>
  );
}

export default Login;
