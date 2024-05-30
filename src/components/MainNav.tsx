/*main navigation component*/
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
              <i className="fi fi-ts-house-chimney icon-mobile"></i> Startsida
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/herd">
              <i className="fi fi-tr-cow-alt icon-mobile"></i> Besättning
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link nav-calender" to="/calender">
              <i className="fi fi-ts-calendar-lines icon-mobile"></i> Kalender
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/handle">
              <i className="fi fi-ts-pen-circle icon-mobile"></i>
              Händelser
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link desktop-icon" aria-label="Mitt konto" to="/account">
            <i className="fi fi-sr-portrait"></i>
           </NavLink> 
           </li>
        
          <li className="nav-item" >
            <NavLink className="nav-link desktop-icon" aria-label="Support" to="/help">
              <i className="fi fi-sr-question-square"></i>
            </NavLink>
          </li>
          </ul>
      </nav>
      </div>
          <div className="menyicon-div justify-content-center">
            <ul>
          <li className="nav-item">
            <NavLink className="menyicon m-3" aria-label="Mitt konto" to="/account">
              <i className="fi fi-sr-portrait"></i>
            </NavLink>
          </li>
          {/**Icon for ? (support, contact) */}
          <li className="nav-item">
            <NavLink className="menyicon m-3" to="/help" aria-label="Support" >
              <i className="fi fi-sr-question-square"></i>
            </NavLink>
          </li>
          </ul>
          </div>
        
    </div>
  );
};
//export
export default Navbar;
