import Footer from "../components/Footer";
import Header from "../components/Header";
import React, { useState, FormEvent } from "react";
import DOMPurify from "dompurify";
//Structure for UserItem
interface UserItem {
    name: string,
    email: string;
    password: string;
  }
const RegisterPage: React.FC = () => {


//State store data
const [newUser, setNewUser] = useState<UserItem>({
    name: "",
    email: "",
    password: "",
  });
//State to show/hide register-form
const [showRegisterUser, setRegisterUser] = useState<boolean>(false);
const [userSuccess, setUserAddedMessage] = useState<string | null>(null);

  const registerUser = async (e:FormEvent <HTMLFormElement>) => {
    e.preventDefault();
    // Sanitize user input using DOMPurify
    const sanitizedName = DOMPurify.sanitize(newUser.name);
    const sanitizedEmail = DOMPurify.sanitize(newUser.email);
    const sanitizedPassword = DOMPurify.sanitize(newUser.password);

    // Update state with sanitized values
setNewUser({
  name: sanitizedName,
  email: sanitizedEmail,
  password: sanitizedPassword,
});

try{
  const response = await fetch('http://localhost:8000/api/register', {
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
  if (responseData.ok) {
    setNewUser({
      name: "",
      email: "",
      password: "",
    });
  }
} catch (error) {
  console.error("Error", error);

}
  };
    return (
        <div>
            <Header />
            <main className="container mx-auto">
        <h1>Registrera konto</h1>
        <form
          className="form-control form-control-sm border-0 p-2 mx-auto w-100" onSubmit={registerUser}
        >
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
            required value={newUser.name}
            onChange={(e) =>
                setNewUser({...newUser, name: e.target.value})
            }
            />

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
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
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
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
          </div>
          <button type="submit" className="btn btn-secondary mt-2">
            Skapa användare
          </button>
        </form>
            </main>
            <Footer />
        </div>
    
);
};
export default RegisterPage;