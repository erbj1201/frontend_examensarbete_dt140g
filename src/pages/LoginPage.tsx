import Footer from "../components/Footer";
import UserHeader from "../components/UserHeader";
import Login from "../components/Login";
const LoginPage: React.FC = () => {

    return (
        <div>
            <UserHeader />
            <main className="container mx-auto">
        <Login />
           </main>
           <Footer />
        </div>
    
);
};
export default LoginPage;