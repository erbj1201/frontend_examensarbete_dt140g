
/* Webbutvecklingsprogrammet
Självständigt arbete DT140G
Erika Vestin & Sofia Dahlberg */
/*Logout component*/
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const Logout: React.FC = () => {
  // Create an instance of the cookie
  const cookies = new Cookies();
  //get token from cookie
  const token = cookies.get("token");
  //get tokens expire date
  const getExpireDate = cookies.get('token_expires');
  if (getExpireDate == new Date(Date.now())) {
    Logout
  }
  //Hook navigation
  const navigate = useNavigate();

  const logoutUser = async () => {
    //Fetch with post
    try {
      const response = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: JSON.stringify({}),
      });
      //Response ok, get token and store
      if (response.ok) {
        // Remove the token cookie
        cookies.remove("token");
        //Remove userid from session storage
        sessionStorage.removeItem("userid");
        // Redirect to login-page if not logged in (no token)
        navigate("/login");
      }
    } catch (error) {
      console.log(error, "Fel vid utloggning");
    }
  };
  return (
    <div className="d-flex justify-content-end">
      <button className="btn btn-sm btn-outline-dark shadow-sm m-2 align-self-end desktop" onClick={logoutUser}>
        Logga ut
      </button>
    </div>
  );
};
export default Logout;
