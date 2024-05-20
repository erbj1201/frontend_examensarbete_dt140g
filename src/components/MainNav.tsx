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
              Start
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/herd">
              Besättning
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link nav-calender" to="/calender">
              Kalender
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/handle">
              Hantera händelser
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/account">
              Mitt konto
            </NavLink>
          </li>
          {/**Icon for ? (support, contact) */}
          <li className="nav-item">
            <NavLink className="menyicon" to="/help">
              <img className="pt-2" src="\src\content\image.png" alt="Navigera till supportsidan" />
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};
//export
export default Navbar;
