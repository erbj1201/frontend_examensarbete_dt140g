/*Footer component*/
//import
import { NavLink } from "react-router-dom";
import Cookies from "universal-cookie";

//Component
const Footer: React.FC = () => {
  //create new instance of cookies
  const cookies = new Cookies();
  //get token from cookies
  const token = cookies.get("token");

  return (
    <div>
      {/*Check if there is token and show contactinfo and links to videos */}
      {token ? (
        <footer className="container-fluid w-100 mx-auto shadow-sm border-top">
          <div className="d-flex flex-column flex-sm-row justify-content-between  ">
            <div className="mx-auto pt-5 ">
              <p className="text-uppercase">Länkar </p>
              <p className="text-left">
                <br />
                <NavLink to="/accessibility">Tillgänglighetsredogörelse
              </NavLink> <br />
              <NavLink to="/GDPR">Behandling av personuppgifter
              </NavLink> <br />
                <a href="https://www.vxa.se/">Växa Sverige</a>
                <br />
                <a href="https://dreambroker.com/channel/npeiza94#/menu">
                  Instruktionsfilmer
                </a>
                
               
              </p>
            </div>
             
            <div className="mx-auto pt-5">
              <p className="text-uppercase">Kontakta oss </p>
              <br />
              <p className="text-left">
                Användarstöd <strong>010-471 09 07</strong>
                <br />
                Kokontroll - Rättning <strong> 010 - 471 09 00</strong>
                <br />
                Kundsupport <strong> 010 - 471 06 60 </strong>
              </p>
            </div>
          </div>
          <p className="vxa text-center mx-auto p-3"> © Växa Sverige 2024 </p>
        </footer>
      ) : (
        //if no token, show just "växa"
        <footer className="container-fluid w-100 mx-auto border-top h-25">
          <p className="text-center vxa mx-auto p-5"> © Växa Sverige 2024 </p>
        </footer>
      )}
    </div>
  );
};
//export
export default Footer;
