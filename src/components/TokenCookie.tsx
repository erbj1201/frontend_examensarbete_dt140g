/* Webbutvecklingsprogrammet
Självständigt arbete DT140G
Erika Vestin & Sofia Dahlberg */
/*Save Token to Cookie component*/
//import
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function TokenCookie() {
  // Hook navigation
  const navigate = useNavigate();
  // Create new instance of cookie
  const cookies = new Cookies();
  //Get token from cookie
  const token = cookies.get("token");

  useEffect(() => {
    //If no token in cookie
    if (!token) {
      // Redirect to login-page if not logged in (no token)
      navigate("/login");
    }
    // Run useEffect when token changes
  }, [token]);
  return <div>
  </div>;
}
//Export
export default TokenCookie;
