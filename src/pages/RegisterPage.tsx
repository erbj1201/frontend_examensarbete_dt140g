import Footer from "../components/Footer";
import Header from "../components/Header";
import Register from "../components/Register";


const RegisterPage: React.FC = () => {

  return (
    <div>
      <Header />
      <main className="container mx-auto">
      <Register />
      </main>
      <Footer />
    </div>
  );
};
export default RegisterPage;
