/* Webbutvecklingsprogrammet
Självständigt arbete DT140G
Erika Vestin & Sofia Dahlberg */

//import
import Footer from "../components/Footer";
import Header from "../components/Header";
import TokenCookie from "../components/TokenCookie";
import Account from "../components/Account"; 
import { Helmet } from "react-helmet-async";

const AccountPage: React.FC = () => {
  return (
    <div>
        <Helmet>
        <title>MinGård - Mitt konto</title>
      </Helmet>
      {/*Including components*/}
      <Header />
      <TokenCookie />
      <main className="container mx-auto">
        <h1>Mitt konto</h1>
       <Account/>
       </main>
      <Footer />
    </div>
  );
}; //export
export default AccountPage;
