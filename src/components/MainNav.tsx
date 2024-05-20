/*main navigation component*/
//Import
import { NavLink } from "react-router-dom";

//Component Navbar
const Navbar = () => {
  return (
    <div>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg justify-content-end">
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
              Hantera händelser
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/account">
              <i className="fi fi-tr-circle-user icon-mobile"></i> Mitt konto
            </NavLink>
          </li>
          {/**Icon for ? (support, contact) */}
          <li className="nav-item">
            <NavLink className="menyicon" to="/help">
              <img
                className="pt-2"
                src="\src\content\image.png"
                alt="Navigera till supportsidan"
              />
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};
//export
export default Navbar;
