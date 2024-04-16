/*Not logged in header component*/
//import
import React from "react";
import { useLocation } from "react-router-dom";

interface DefineHeader {
  //Define pageTitle as string
  pageTitle: string;
}

const HeaderText: React.FC<DefineHeader> = ({ pageTitle }) => {
  return (
    <div>
      {/**dynamic Pagetitle */}
      <h1 className="header mx-auto ">{pageTitle}</h1>
    </div>
  );
};
const UserHeader: React.FC = () => {
  //Get the URL for page right now
  const location = useLocation();
  const path = location.pathname;

  let titleHeader = "";
  //Decides the title/text depending on the url
  if (path === "/register") {
    titleHeader = "Registrera konto i MinGård";
  } else {
    titleHeader = "Logga in i MinGård";
  }
  return (
    <div>
      <header className="container-fluid w-100 mx-auto border-bottom">
        <div>
          {/**logo */}
          <nav className="navbar">
            <a className="navbar-brand" href="/">
              <img
                src="src\content\vaxa_thumbnail.png"
                height="30"
                alt="Växa Sverige"
              />
              <p className="mx-auto text-center">MinGård</p>
            </a>
            <div className="headerdiv mx-auto text-center">
              <HeaderText pageTitle={titleHeader} />
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default UserHeader;
