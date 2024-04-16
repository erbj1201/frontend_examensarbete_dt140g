/*Header component*/
//import
import React from "react";
import Navbar from "./MainNav";
import SearchForm from "./SearchForm";
import Logout from "./Logout";

//Component
const Header: React.FC = () => {
  return (
    <div>
      <header className="container-fluid w-100 mx-auto border-bottom">
        <div>
          {/**import components */}
          <Navbar />
        </div>
        <nav className="navbar">
          <a className="navbar-brand" href="/">
            <img
              src="\src\content\vaxa_thumbnail.png"
              height="30"
              alt="Växa Sverige"
            />
            <p className="mx-auto text-center">MinGård</p>
          </a>
        </nav>
        <SearchForm />
        <Logout />
      </header>
    </div>
  );
};
//export
export default Header;
