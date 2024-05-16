//import
import { Helmet } from 'react-helmet-async';
import Footer from "../components/Footer";
import GetHerdComponent from "../components/GetHerd";
import Header from "../components/Header";
import TokenCookie from "../components/TokenCookie";

const HerdPage: React.FC = () => {
  return (
    <div>
      {/*Including components*/}
      <Helmet>
        <title>MinGård - Besättning</title>
      </Helmet>
      <Header />
      <TokenCookie />
      <main className="container mx-auto">
        <h1>Besättning</h1>
        <GetHerdComponent />
      </main>
      <Footer />
    </div>
  );
}; //export
export default HerdPage;
