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
        {/**Register (registrera användare) */}
        <Route path="/register" element={<RegisterPage />} />
        {/**Login (logga in användare*/}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};
//export
export default AppRouter;
