import Footer from "../components/Footer";
import Header from "../components/Header";
import TokenCookie from "../components/TokenCookie";


const StartPage: React.FC = () => {
    return (
        <div>
      {/*Including components*/}
      <Header />
      <TokenCookie />
      <main className="container mx-auto">
        <h1>Välkommen till MinGård</h1>
      </main>
      <Footer />
    </div>    
);
};
export default StartPage;