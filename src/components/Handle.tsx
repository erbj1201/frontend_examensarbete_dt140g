import React, { useState, FormEvent } from "react";
import DOMPurify from "dompurify";

interface Milk{
    kgMilk: string;
    milkDate: string;
    animal_id: number;
}
const Handle: React.FC = () => {

  /*   const newMilk, setNewMilk] = useState<Milk>({
        kgMilk: "",
        milkDate: ""
    }); */

  

    return (
<div>
   <form
        className="form-control handleForm form-control-sm border-2 p-5 mx-auto w-50 "

    >
        <div className="form-group ">
            <label htmlFor="animalId" className="form-label">
                SE-nummer:
            </label>
            <input
                type="animalId"
                id="animalId"
                name="animalId"
                className="form-control" />
        </div>
        <div className="form-group">
            <label htmlFor="kgMilk" className="form-label">
               Mjölk i kg:
            </label>
            <input
                type="kgMilk"
                id="kgMilk"
                name="kgMilk"
                className="form-control" />
        </div>
        <div className="form-group">
            <label htmlFor="kgMilk" className="form-label">
               Datum för mjölkning: 
            </label>
            <input
                type="milkDate"
                id="milkDate"
                name="milkDate"
                className="form-control" />
        </div>
        <button type="submit" className="button w-50 mt-2">
           Lägg till
        </button>
    </form>
<h2>Senaste mjölkningarna:</h2>    
<table className="table table-responsive table-hover">
          <thead>
            <tr>
              <th>SE-nummer</th>
              <th>Mjölki kg</th>
              <th>Datum</th>
              <th>Hantera</th>
              </tr>
              </thead>
          <tbody>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tbody>
          </table>
          </div>
          );
};
      export default Handle;