/* Webbutvecklingsprogrammet
Självständigt arbete DT140G
Erika Vestin & Sofia Dahlberg */

//import
import Footer from "../components/Footer";
import UserHeader from "../components/UserHeader";
import Register from "../components/Register";
import { Helmet } from 'react-helmet-async';
 
const RegisterPage: React.FC = () => {
  return (
    <div>
      {/*Including components*/}
      <Helmet>
        <title>MinGård - Registrera</title>
      </Helmet>
      <UserHeader />
      <main className="container mx-auto">
        <Register />
      </main>
      <Footer />
    </div>
  );
};
//export
export default RegisterPage;
