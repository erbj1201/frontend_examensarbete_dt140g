/*Save token to cookie component*/
//import
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function TokenCookie() {
  // Hook navigation
  const navigate = useNavigate();
  // Create new instance of cookie
  const cookies = new Cookies();
  //get token from cookie
  const token = cookies.get("token");

  useEffect(() => {
    //if no token in cookie
    if (!token) {
      // Redirect to login-page if not logged in (no token)
      navigate("/login");
    }
    // Run useEffect when token changes
  }, [token]);
  return <div>
  </div>;
}
//export
export default TokenCookie;
