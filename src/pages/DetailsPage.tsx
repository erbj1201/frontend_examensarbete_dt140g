import Footer from "../components/Footer";
import Header from "../components/Header";
import DetailsComponent from "../components/Details";


const DetailsPage: React.FC = () => {
    return (
        <div>
            <Header />
            <main className="container mx-auto">
            <h1>Detaljer</h1>
            <DetailsComponent/>
            </main>
            <Footer />
        </div>
    );
};
export default DetailsPage;