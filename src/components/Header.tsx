
/*Header component*/
//import
import React from "react";
import Navbar from "./MainNav";
import SearchForm from "./SearchForm";
import Logout from "./Logout";

//Component
const Header: React.FC = () => {
  return (
    <div className="d-flex flex-column">
      <header className="container-fluid w-100 mx-auto border-bottom shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <nav className="navbar m-0 p-0">
            <a className="navbar-brand" href="/start">
              <img
                src="/src/content/vaxa_thumbnail.png"
                width={100}
                alt="Växa Sverige"
              />
              <p className="m-0 text-center">MinGård</p>
            </a>
          </nav>
          <div className="d-flex flex-row-reverse">
            {/**Import components */}
            <Navbar />
          </div>
        </div>
        <SearchForm />
        <Logout />

      </header>
    </div>
  );
};
//Export
export default Header;
