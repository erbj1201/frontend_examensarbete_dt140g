//import
import Footer from "../components/Footer";
import Header from "../components/Header";
import TokenCookie from "../components/TokenCookie";
import Handle from "../components/Handle";
const CalenderPage: React.FC = () => {
  return (
    <div>
      {/*Including components*/}
      <Header />
      <TokenCookie />
      <main className="container mx-auto">
        <h1>Hantera ärenden</h1>
        <h2>Lägg till mjölkning</h2>
        <Handle />
      </main>
      <Footer />
    </div>
  );
}; //export
export default CalenderPage;