//import
import Footer from "../components/Footer";
import Header from "../components/Header";
import TokenCookie from "../components/TokenCookie";
import Message from "../components/Message";

const StartPage: React.FC = () => {
  return (
    <div>
      {/*Including components*/}
      <Header />
      <TokenCookie />
      <main className="container mx-auto">
        <h1>Välkommen till MinGård</h1>
        <Message />
      </main>
      <Footer />
    </div>
  );
};
//export
export default StartPage;
