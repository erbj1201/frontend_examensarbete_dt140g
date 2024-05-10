/*Router for webb app*/
//Import
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StartPage from "../pages/StartPage";
import HerdPage from "../pages/HerdPage";
import AccountPage from "../pages/AccountPage";
import CalenderPage from "../pages/CalenderPage";
import DetailsPage from "../pages/DetailsPage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import HandlePage from "../pages/HandlePage";
import HelpPage from "../pages/HelpPage";
import AccessabilityPage from "../pages/AccessabilityPage";

//Component with routes
const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/**Start (start) */}
        <Route path="/" element={<StartPage />} />
        {/**Herd (besättning) */}
        <Route path="/herd" element={<HerdPage />} />
        {/**Account (mitt konto)*/}
        <Route path="/account" element={<AccountPage />} />
        {/**Calender (kalender) */}
        <Route path="/calender" element={<CalenderPage />} />
        {/**Details (detaljer för varje djur) */}
        <Route path="/details/:id" element={<DetailsPage />} />
        {/**Handle (hantera ärenden) */}
        <Route path="/handle" element={<HandlePage />} />
        {/**Handle (hantera ärenden med id) */}
        <Route path="/handle/:id" element={<HandlePage />} />
        {/**Register (registrera användare) */}
        <Route path="/register" element={<RegisterPage />} />
        {/**Login (logga in användare)*/}
        <Route path="/login" element={<LoginPage />} />
        {/**Accessability (tillgänglighet)*/}
        <Route path="/accessability" element={<AccessabilityPage />} />
        {/**Help (supportsida)*/}
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </Router>
  );
};
//export
export default AppRouter;
