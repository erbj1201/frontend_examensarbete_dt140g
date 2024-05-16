//import
import Footer from "../components/Footer";
import UserHeader from "../components/UserHeader";
import Login from "../components/Login";
import { Helmet } from 'react-helmet-async';
const LoginPage: React.FC = () => {
  return (
    <div>
      {/*Including components*/}
      <Helmet>
        <title>MinGård - Logga in</title>
      </Helmet>
      <UserHeader />
      <main className="container mx-auto">
        <Login />
      </main>
      <Footer />
    </div>
  );
};
//export
export default LoginPage;
