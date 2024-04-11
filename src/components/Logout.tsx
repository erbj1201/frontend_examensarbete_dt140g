import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const Logout: React.FC = () => {
  // Create an instance of the cookie
  const cookies = new Cookies();
  //get token from cookie
  const token = cookies.get("token");
  //Hook navigation
  const navigate = useNavigate();

  const logoutUser = async () => {
    //Fetch
    try {
      const response = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({}),
      });
      const responseData = await response.json();
      //Response ok, get token and store
      if (response.ok) {
        console.log(responseData.message);
        // Remove the token cookie
        cookies.remove("token");
        // Redirect to login-page if not logged in (no token)
        navigate("/login");
      }
    } catch (error) {
      console.log(error, "Fel vid utloggning");
    }
  };

  return (
    <div>
      <button className="logout-btn btn btn-dark m-2" onClick={logoutUser}>
        Logga ut
      </button>
    </div>
  );
};
export default Logout;
