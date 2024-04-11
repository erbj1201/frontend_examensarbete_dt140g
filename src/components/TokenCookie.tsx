import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function TokenCookie() {
  // Hook navigation
  const navigate = useNavigate();
  // Create new instance of cookie
  const cookies = new Cookies();
  const token = cookies.get("token");

  useEffect(() => {
    if (!token) {
      // Redirect to login-page if not logged in (no token)
      navigate("/login");
    } else {
      //If logged in, write token to console
      console.log(token);
    }
    // Run useEffect when token changes
  }, [token]);

  return <div></div>;
}

export default TokenCookie;
