import Footer from "../components/Footer";
import Header from "../components/Header";


const StartPage: React.FC = () => {

    return (
        <div>
      {/*Including components*/}
      <Header />
      <main className="container mx-auto">
        <h1>Välkommen till MinGård</h1>
      </main>
      <Footer />
    </div>    
);
};
export default StartPage;