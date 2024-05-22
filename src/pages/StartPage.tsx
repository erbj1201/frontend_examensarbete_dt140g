//import
import Footer from "../components/Footer";
import Header from "../components/Header";
import TokenCookie from "../components/TokenCookie";
import { Helmet } from 'react-helmet-async';
import Calender from "../components/Calender";
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
        <div>
<div className="col-lg-6">
  <Calender/>
</div>
<div className="col-lg-6">
  <h2>Driftstörning</h2>
  <p>Den 29e Maj 2024 kommer uppdatering ske mellan 08:00 - 10:00</p>
</div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
//export
export default StartPage;
