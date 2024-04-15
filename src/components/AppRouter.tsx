//Router for webb app
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
          <Route path="/" element={<StartPage />} />
          <Route path="/herd" element={<HerdPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/calender" element={<CalenderPage />} />
          <Route path="/details/:id" element={<DetailsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    );
  };
  
  export default AppRouter;