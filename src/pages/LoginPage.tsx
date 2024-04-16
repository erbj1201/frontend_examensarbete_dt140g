//import
import Footer from "../components/Footer";
import UserHeader from "../components/UserHeader";
import Login from "../components/Login";
const LoginPage: React.FC = () => {
  return (
    <div>
      {/*Including components*/}
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
