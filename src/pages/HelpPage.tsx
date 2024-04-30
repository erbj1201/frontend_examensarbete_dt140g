//import
import Footer from "../components/Footer";
import Header from "../components/Header";
import TokenCookie from "../components/TokenCookie";
import Message from "../components/Message";

function HelpPage() {

  return (
    <div>
    {/*Including components*/}
    <Header />
    <TokenCookie />
    <main className="container mx-auto">
      <h1>Support</h1>
      <Message />
    </main>
    <Footer />
  </div>
  )
}

export default HelpPage