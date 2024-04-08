import React from "react";
import Navbar from "./MainNav";
import SearchForm from "./SearchForm";
//Component
const Header: React.FC = () => {
    return (
      <div>
      <header className="container-fluid w-100 mx-auto border-bottom">
      <div>
        <Navbar />
        </div>
<nav className="navbar">
  <a className="navbar-brand" href="/">
    <img src="src\content\vaxa_thumbnail.png" height="30" alt="Växa Sverige" />
  </a>
</nav>
<SearchForm />
      </header>
      </div>
    );
  };
  
  export default Header;
  