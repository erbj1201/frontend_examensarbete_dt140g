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
        <ul className="nav justify-content-end">
          <li className="nav-item">
            <NavLink className="nav-link text-black px-4 m-1" to="/">
              Start
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-black px-4 m-1" to="/herd">
              Besättning
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-black px-4 m-1" to="/calender">
              Kalender
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-black px-4 m-1" to="/handle">
              Hantera händelser
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-black px-4 m-1" to="/account">
              Mitt konto
            </NavLink>
          </li>
          {/**Icon for ? (support, contact) */}
          <li className="nav-item">
            <NavLink className="menyicon" to="/help">
              <img className="pt-2" src="\src\content\image.png" />
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};
//export
export default Navbar;
