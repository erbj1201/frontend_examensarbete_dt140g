//import
import Footer from "../components/Footer";
import Header from "../components/Header";
import DetailsComponent from "../components/Details";
import TokenCookie from "../components/TokenCookie";

const DetailsPage: React.FC = () => {
  return (
    <div>
      {/*Including components*/}
      <Header />
      <TokenCookie />
      <main className="container mx-auto">
        <h1>Detaljer</h1>
        <DetailsComponent />
      </main>
      <Footer />
    </div>
  );
};
//export
export default DetailsPage;
