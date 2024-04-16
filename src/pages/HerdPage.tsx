//import
import Footer from "../components/Footer";
import GetHerdComponent from "../components/GetHerd";
import Header from "../components/Header";
import TokenCookie from "../components/TokenCookie";

const HerdPage: React.FC = () => {
  return (
    <div>
      {/*Including components*/}
      <Header />
      <TokenCookie />
      <main className="container mx-auto">
        <h1>Besättningsöversikt</h1>
        <GetHerdComponent />
      </main>
      <Footer />
    </div>
  );
}; //export
export default HerdPage;
