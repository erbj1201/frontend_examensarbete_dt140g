//import
import Footer from "../components/Footer";
import Header from "../components/Header";
import TokenCookie from "../components/TokenCookie";
import { Helmet } from 'react-helmet-async';

const StartPage: React.FC = () => {
  return (
    <div>
      {/*Including components*/}
      <Helmet>
        <title>MinGård - Start</title>
      </Helmet>
      <Header />
      <TokenCookie />
      <main className="container mx-auto">
        <h1>Välkommen till MinGård</h1>
      </main>
      <Footer />
    </div>
  );
};
//export
export default StartPage;
