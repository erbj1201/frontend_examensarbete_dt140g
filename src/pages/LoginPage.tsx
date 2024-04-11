import Footer from "../components/Footer";
import Header from "../components/Header";
import Login from "../components/Login";


const LoginPage: React.FC = () => {

    return (
        <div>
            <Header />
            <main className="container mx-auto">
        <h1>Logga in</h1>
        <Login />
           </main>
           <Footer />
        </div>
    
);
};
export default LoginPage;