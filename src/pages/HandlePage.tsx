//import
import React, { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TokenCookie from "../components/TokenCookie";
import Milk from "../components/Milk";
import Vaccine from "../components/Vaccine";
import Medicine from "../components/Medicine";
import Calves from "../components/Calves";

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
        return <Calves />;
        default:
          return null;
    }
  };

return (
  <div>
    {/*Including components*/}
    <Header />
    <TokenCookie />
    <main className="container mx-auto">
      <h1>Hantera ärenden</h1>
      <h2>Vad vill du lägga till?</h2>
      <select value={optionValue} onChange={handleOptions}>
      
        <option value="optionMilk">Mjölk</option>
        <option value="optionVaccine">Vaccin</option>
        <option value="optionMedicine">Medicin</option>
        <option value="optionCalves">Kalv</option>
      </select>
{components()}
    </main>
    <Footer />
  </div>
);
}; //export
export default HandlePage;