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
      <div className="help-div d-flex p-5 mx-auto justify-content-between">
      <div className="support-div d-flex flex-column mx-auto">
        <article className="contact-article w-50 p-5 mx-auto border border-grey shadow">
          <h3 className="text-center m-3 pb-3">Support via telefon</h3>
          <div className="p-3 mx-auto">
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
        </article>
        <article className="contact-article w-50 m-3 p-5 mx-auto border border-grey shadow">
          <h3 className="text-center m-3 pb-3">Instruktionsfilmer MinGård</h3>
          <div className="p-3 m-2 mx-auto">
          <p>Det finns flera olika instruktionsfilmer som visar hur MinGård fungerar.</p>
          <a href="https://dreambroker.com/channel/npeiza94#/menu">Till instruktionsfilmerna</a>
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