import Footer from "../components/Footer";
import GetHerdComponent from "../components/GetHerd";
import Header from "../components/Header";

const HerdPage: React.FC = () => {

    return (
        <div>
            <Header />
            <main className="container mx-auto">
        <h1>Besättningsöversikt</h1>
        <GetHerdComponent />
            </main>
            <Footer />
        </div>
    
);
};
export default HerdPage;