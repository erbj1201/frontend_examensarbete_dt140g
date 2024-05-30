/* Webbutvecklingsprogrammet
Självständigt arbete DT140G
Erika Vestin & Sofia Dahlberg */

//import
import Footer from "../components/Footer";
import Header from "../components/Header";
import TokenCookie from "../components/TokenCookie";
import { Helmet } from 'react-helmet-async';
import Calender from "../components/Calender";
import Message from "../components/Message";
const StartPage: React.FC = () => {
  return (
    <div>
      {/*Including components*/}
      <Helmet>
        <title>MinGård - Start</title>
      </Helmet>
      <Header />
      <TokenCookie />
      <main className="container mx-auto startDiv">
        <h1>Välkommen till MinGård</h1>
            <Calender />
            <div className="help-div d-flex mx-auto">
            <div className="support-div d-flex flex-column mx-auto p-5 mt-3 border border-grey shadow">
              <h2>Driftstörning</h2>
              <p>29 maj 2024 kommer uppdatering ske mellan 08:00 - 10:00</p>
            </div>
            <div className="mx-auto col-sm-10 col-md-8 col-lg-7 mt-3">
              <Message />
            </div>
</div>
      </main>
      <Footer />
      </div>
  );
};
//export
export default StartPage;
