//import
import React, { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Milk from "../components/Milk";
import Vaccine from "../components/Vaccine";
import Medicine from "../components/Medicine";
import Calf from "../components/Calf";
import TokenCookie from "../components/TokenCookie";
import { Helmet } from "react-helmet-async";

const HandlePage: React.FC = () => {

 
  const [optionValue, setOptionValue] = useState("");

  //Handle options in the select list
  const handleOptions = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setOptionValue(e.target.value);
  };

  //Different components depending on option
  const components = () => {
    switch (optionValue) {
      case "optionMilk":
        return <Milk />;
      case "optionVaccine":
        return <Vaccine />;
      case "optionMedicine":
        return <Medicine />
      case "optionCalves":
        return <Calf />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/*Including components*/}
      <Helmet>
        <title>MinGård - Hantera händelser</title>
      </Helmet>
      <TokenCookie />
      <Header />
      <main className="container mx-auto">
        <h1>Hantera händelse för djur</h1>
        <form className="fit-content-width form form-control-sm mx-auto">
        <label htmlFor="handle" className="mb-3">Vilken typ av händelse vill du hantera?</label>
        <br/>
        <select className="form-select form-select w-50 mb-5 border border-dark"
          id="handle"
          name="handle" value={optionValue} onChange={handleOptions}>
          <option disabled value="">Välj händelse att rapportera</option>
          <option value="optionMilk">Mjölkning</option>
          <option value="optionVaccine">Vaccinering</option>
          <option value="optionMedicine">Medicinering</option>
          <option value="optionCalves">Kalvning</option>
        </select>
        </form>
        {/* Return the correct component dynamically */}
        {components()}
      </main>
      <Footer />
    </div>
  );
}; //export
export default HandlePage;