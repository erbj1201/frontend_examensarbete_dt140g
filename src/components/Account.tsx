import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";

interface User {
  name: string;
  email: string;
  password: string;
  id: string;
}

const cookies = new Cookies();
const token = cookies.get("token");
const userid = sessionStorage.getItem("userid");

const AccountPage: React.FC = () => {
  const [editUser, setEditUser] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");


  useEffect(() => {
   
    //Set name the mail from database
    if (users.length  > 0) {
      setEmail(users[0].email);
      setName(users[0].name);
    }
    fetchUsers();
  }, [users]);

//Get users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      //If response.ok
      if (response.ok) {
        const jsonData = await response.json();
        setUsers(jsonData);
        
      } else {
        throw new Error("Något gick fel");
      }
    } catch (error) {
      console.error("Fel vid hämtning av användare", error);
    }
  };
//Handle form and compare password in input field with password in database 
  const handleForm= async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      console.log("Användarens lösenord:", password);
 
    if(users.length > 0 && users[0].password){
         console.log("Lösenordet från användaren i databasen:", users[0].password);
    }
    // If the compared password is incorrect
        if (password !== users[0].password) {
    setErrorPassword("Fel lösenord");
    return;
  }
  //If password correct use updateProfile function
  else {
  updateProfile();
  }
    } catch (error) {
      console.error("Fel vid inloggning");
    }
  };
  
  const updateProfile = async () => {
    try {
      // Create an object for the values
      const requestBody = {userid, name, email}

      await fetch(`http://localhost:8000/api/users/${userid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      console.log("Data som skickas till servern:", requestBody); 
      setEditUser(false);
      fetchUsers();
    
    } catch (error) {
      console.error("Error updating user", error);

  }
};
  
//Form with input fields
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          {editUser ? (
            <form
              className="form-control handleForm form-control-sm border-0 p-2 mx-auto w-100"
              onSubmit={handleForm}
            >
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Namn:
                </label>
                <input
                  type="name"
                  id="name"
                  name="name"
                  defaultValue={name}
                  className="form-control"
                  onChange={(e) => setName(e.target.value)} //Set new name if it changes
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
                  defaultValue={email} 
                  className="form-control"
                  onChange={(e) => setEmail(e.target.value)} //set new email if it changes 
                  required
                />
                <label htmlFor="password" className="form-label">
                  Skriv ditt aktuella lösenord för att spara ändringar:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errorPassword && <p>{errorPassword}</p>}
                <button type="submit" className="btn btn-primary">
                  Spara ändringar
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <button onClick={() => setEditUser(true)}>Edit</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AccountPage;
