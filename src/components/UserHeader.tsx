/* Webbutvecklingsprogrammet
Självständigt arbete DT140G
Erika Vestin & Sofia Dahlberg */
/*Not logged in Header component*/
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
      <h1 className="header mx-auto w-100">{pageTitle}</h1>
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
    titleHeader = "Registrera konto";
  } else if (path === "/login") {
    titleHeader = "Logga in";
  } else {
    titleHeader = "Behandling av personuppgifter";
  }
  return (
    <div>
      <header className="container-fluid shadow-sm w-100 mx-auto border-bottom d-flex">
        <div className="d-flex w-100">
          {/**logo */}
          <nav className="navbar">
            <a className="navbar-brand align-self-start" href="/start">
              <img
                src="src\content\vaxa_thumbnail.png"
                alt="Växa Sverige" width={100}
              />
              <p className="mx-auto text-center">MinGård</p>
            </a>
          </nav>
          <div className="headerdiv align-self-center mx-auto text-center">
            <HeaderText pageTitle={titleHeader} />
          </div>

        </div>
      </header>
    </div>
  );
};

export default UserHeader;
