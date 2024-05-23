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
      <main className="container">
        <h1>Välkommen till MinGård</h1>
        <div className="container mx-auto startDiv">
          <div className="mx-auto calender border border-grey shadow p-3  ">
            <Calender />
          </div>
          <div className="mx-auto row d-lg-flex">
            <div className="mx-auto col-sm-12 col-md-8 col-lg-5 mt-3 p-5 supportDiv border border-grey shadow">
              <h2>Driftstörning</h2>
              <p>Den 29e Maj 2024 kommer uppdatering ske mellan 08:00 - 10:00</p>
            </div>
            <div className="message-div-start mx-auto col-sm-12 col-md-9 col-lg-7 mt-3">
              <Message />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
//export
export default StartPage;
