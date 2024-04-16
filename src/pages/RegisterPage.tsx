//import
import Footer from "../components/Footer";
import UserHeader from "../components/UserHeader";
import Register from "../components/Register";

const RegisterPage: React.FC = () => {
  return (
    <div>
      {/*Including components*/}
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
