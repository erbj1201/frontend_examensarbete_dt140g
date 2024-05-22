//import
import Footer from "../components/Footer";
import Header from "../components/Header";
import TokenCookie from "../components/TokenCookie";
import Message from "../components/Message";
import { Helmet } from "react-helmet-async";

function HelpPage() {

  return (
    <div>
    {/*Including components*/}
    <Helmet>
        <title>MinGård - Support</title>
      </Helmet>
    <Header />
    <TokenCookie />
    <main className="container mx-auto">
    <h1 className="mx-auto text-center">Support</h1>
      <div className="help-div d-flex mx-auto">
      <div className="support-div d-flex flex-column mx-auto">
        <article className="contact-article mx-auto border border-grey shadow">
        <div className="mx-auto text-center p-1">
          <h3 className="p-1">Support via telefon</h3>
          <p>Användarstöd  
          <br />
          <a href="010- 471 09 07">010-471 09 07</a></p>
          <p>Kokontroll - Rättning  
          <br />
            <a href="010 - 471 09 00">010 - 471 09 00</a></p>
         <p> Kundsupport 
          <br /> 
          <a href="010 - 471 06 60">010 - 471 06 60</a></p>
          </div>
          <div className="text-center mx-auto pt-5 p-1">
          <h3 className="p-1">Instruktionsfilmer MinGård</h3>
          <p className="mx-auto"> Det finns flera olika instruktionsfilmer som visar hur MinGård fungerar.
          <br /><a href="https://dreambroker.com/channel/npeiza94#/menu">Till instruktionsfilmerna</a>
          </p>
          </div>
        </article>
      </div>
      <Message />
      </div>
    </main>
    <Footer />
  </div>
  )
}

export default HelpPage