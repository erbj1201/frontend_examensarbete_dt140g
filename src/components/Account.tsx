import DOMPurify from "dompurify";
import React, { useEffect, useState, FormEvent } from "react";
interface User{
    name: string;
    email: string;
}

const [User, setUser] = useState<User[]>([]);



const AccountPage: React.FC = () => {

    return(
        <div>
             <form
        className="form-control handleForm form-control-sm border-0 p-2 mx-auto w-100"
        >
            <div className="form-group">
              <label htmlFor="name" className="form-label">
            Namn:
          </label>
 <input
            type="name"
            id="name"
            name="name"
            className="form-control"
            required /></div>
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
            />
            <label htmlFor="herdId" className="form-label">
           Besättningsnummer:
          </label>
            <input
            type="herdId"
            id="herdId"
            name="herdId"
            className="form-control"
            required
            />
            </div>
        </form>
        </div>
    )
}

//export
export default AccountPage;
