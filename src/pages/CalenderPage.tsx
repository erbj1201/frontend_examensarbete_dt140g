import Footer from "../components/Footer";
import Header from "../components/Header";
import TokenCookie from "../components/TokenCookie";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Helmet } from "react-helmet-async";
import Calender from "../components/Calender";

const CalenderPage: React.FC = () => {

  return (
    <div>
      {/*Including components*/}
      <Helmet>
        <title>MinGård - Kalender</title>
      </Helmet>
      <Header />
      <TokenCookie />
      <main className="container mx-auto">
        <h1>Kalender</h1>
          <div>
  <Calender/>
  </div>

      </main>
      <Footer />
    </div>
  );
}; //export
export default CalenderPage;
