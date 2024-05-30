/* Webbutvecklingsprogrammet
Självständigt arbete DT140G
Erika Vestin & Sofia Dahlberg */
/*Main navigation component*/
//Import
import { NavLink } from "react-router-dom";

//Component Navbar
const Navbar = () => {
  return (
    <div>
      <div className="nav-div">
        {/* Navigation */}
        <nav className="navbar navbar-expand-lg">
          {/*Navbar with links*/}
          <ul className="nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/start">
                <img className="menuIcon icon-mobile" src="\src\content\startsida.png" alt="Ikon på hus " />
                Startsida
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/herd">
                <img className="menuIcon icon-mobile" src="\src\content\cow.png" alt="Ikon på ko" />Besättning
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-calender" to="/calender">
                <img className="menuIcon icon-mobile" src="\src\content\calender.png" alt="Ikon på almenacka" /> Kalender
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/handle">
                <img className="menuIcon icon-mobile" src="\src\content\events.png" alt="Ikon på penna" />
                Händelser
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link desktop-icon" aria-label="Mitt konto" to="/account">
                <img className="menuIcon" src="\src\content\account.png" alt="Ikon porträtt" />
              </NavLink>
            </li>

            <li className="nav-item" >
              <NavLink className="nav-link desktop-icon" aria-label="Support" to="/help">
                <img className="menuIcon" src="\src\content\question.png" alt="Ikon frågetecken" />
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="menyicon-div justify-content-center">
        <ul>
          <li className="nav-item">
            <NavLink className="menyicon m-3" aria-label="Mitt konto" to="/account">
              <img className="menuIcon" src="\src\content\account.png" alt="Ikon porträtt" />
            </NavLink>
          </li>
          {/**Icon for ? (support, contact) */}
          <li className="nav-item">
            <NavLink className="menyicon m-3" to="/help" aria-label="Support" >
              <img className="menuIcon" src="\src\content\question.png" alt="Ikon frågetecken" />
            </NavLink>
          </li>
        </ul>
      </div>

    </div>
  );
};
//export
export default Navbar;
