import Footer from "../components/Footer";
import UserHeader from "../components/UserHeader";
import Register from "../components/Register";


const RegisterPage: React.FC = () => {

  return (
    <div>
      <UserHeader />
      <main className="container mx-auto">
      <Register />
      </main>
      <Footer />
    </div>
  );
};
export default RegisterPage;