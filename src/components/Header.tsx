import React from "react";
import Navbar from "./MainNav";
//Component
const Header: React.FC = () => {
    return (
      <header className="container-fluid w-100 mx-auto border-bottom">
        <a href="/" className="logo mx-auto">
          Växa
        </a>
        <Navbar />
      </header>
    );
  };
  
  export default Header;
  