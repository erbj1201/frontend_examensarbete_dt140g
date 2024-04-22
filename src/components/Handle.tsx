import React, { useState, FormEvent } from "react";
import Cookies from "universal-cookie";

interface Milk {
    kgMilk: string;
    milkDate: string;
    animal_id: string;

}
function Handle() {

    const [newMilk, setNewMilk] = useState<Milk>({
        kgMilk: "",
        milkDate: "",
        animal_id: ""
      
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    setNewMilk({ ...newMilk, [name]: value });
    };

    const addMilk = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const cookies = new Cookies();
        const token = cookies.get("token");
    try{
        const response = await fetch(`http://localhost:8000/api/milks/animals/${newMilk.animal_id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
        },
        body: JSON.stringify({
            kgMilk: newMilk.kgMilk,
            milkDate: newMilk.milkDate,
            animal_id: newMilk.animal_id,
        }),
    });
    const responseData = await response.json();
    //if response ok
    if (response.ok) {
        setNewMilk({
        kgMilk: "",
        milkDate: "",
        animal_id: "default_value",
    });
    }
    console.log(responseData);
    } catch (error) {
        console.log(error);

    }
 };

    return (
        <div>
            <form
                className="form-control handleForm form-control-sm border-2 p-5 mx-auto w-50 "
                onSubmit={addMilk}
            >
                 <div className="form-group">
                    <label htmlFor="animal_id" className="form-label">
                       djur:
                    </label>
                    <input
                        type="animal_id"
                        id="animal_id"
                        name="animal_id"
                        className="form-control" 
                        onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="kgMilk" className="form-label">
                        Mjölk i kg:
                    </label>
                    <input
                        type="kgMilk"
                        id="kgMilk"
                        name="kgMilk"
                        className="form-control" 
                        onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="kgMilk" className="form-label">
                        Datum för mjölkning:
                    </label>
                    <input
                        type="milkDate"
                        id="milkDate"
                        name="milkDate"
                        className="form-control" 
                        onChange={handleInputChange} />
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
                    <tr>
                    <td>test</td>
                    <td>test</td>
                    <td>test</td>
                  </tr>
                </tbody>
            </table>
        </div>
    );
};
export default Handle;