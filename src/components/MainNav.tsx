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
            <NavLink className="nav-link" to="/">
              <i className="fi fi-ts-house-chimney icon-mobile"></i> Start
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
            <NavLink className="nav-link desktop-icon" to="/account">
            <i className="fi fi-sr-portrait"></i>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link desktop-icon" to="/help">
              <i className="fi fi-sr-question-square"></i>
            </NavLink>
          </li>
          </ul>
      </nav>
      </div>
          <div className="menyicon-div justify-content-center">
          <li className="nav-item">
            <NavLink className="menyicon" to="/account">
              <i className="fi fi-sr-portrait"></i>
            </NavLink>
          </li>
          {/**Icon for ? (support, contact) */}
          <li className="nav-item">
            <NavLink className="menyicon" to="/help">
              <i className="fi fi-sr-question-square"></i>
            </NavLink>
          </li>
          </div>
        
    </div>
  );
};
//export
export default Navbar;
