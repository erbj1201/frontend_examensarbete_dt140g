//import
import Footer from "../components/Footer";
import Header from "../components/Header";
import DetailsComponent from "../components/Details";
import TokenCookie from "../components/TokenCookie";
import { Helmet } from "react-helmet-async";

const DetailsPage: React.FC = () => {
  return (
    <div>
      
      {/*Including components*/}
      <Helmet>
        <title>MinGård - Djurinformation</title>
      </Helmet>
      <Header />
      <TokenCookie />
      <main className="container mx-auto">
        <h1>Djurinformation</h1>
        <DetailsComponent />
      </main>
      <Footer />
    </div>
  );
};
//export
export default DetailsPage;
