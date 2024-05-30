//import
import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TokenCookie from "../components/TokenCookie";

const AccessibilityPage: React.FC = () => {
    return (
        <div>
              <Helmet>
        <title>MinGård - Tillgänglighetsredogörelse</title>
      </Helmet>
            <Header />
            <TokenCookie />
            <div>
                <main className="mx-auto container m-3">
                    <article className="mx-auto accessibilityDiv">
            <h1 className="lh-base">Tillgänglighet för MinGård</h1>
            <p className="p-2 lh-base"> Växa står bakom den här webbplatsen.
                Vi vill att så många som möjligt ska kunna använda den.
                Det här dokumentet beskriver hur MinGård uppfyller lagen
                om tillgänglighet till digital offentlig service,
                eventuella kända tillgänglighetsproblem och hur
                du kan rapportera brister till oss så att vi kan åtgärda dem.</p>
            <h2 className="p-2 lh-base"> Hur tillgänglig är webbplatsen?</h2>
            <p className="p-2 lh-base">Vi har inga kända brister i tillgängligheten för den här webbplatsen.
            </p>
            <h2 className="p-2 lh-base">Vad kan du göra om du inte kan använda delar av webbplatsen?</h2>
            <p className="p-2 lh-base">Om du behöver innehåll från MinGård som inte är tillgängligt för dig, men som är undantaget från lagens tillämpningsområde enligt beskrivning nedan, kan du meddela oss.
            </p>
            <p className="p-2 lh-base">Svarstiden är normalt 2-4 arbetdagar.</p>
            <p className="p-2 lh-base">Du kan också kontakta oss på följande sätt:</p>
                <ul>
                    <li>Skicka emajl till: <a href="vaxa@support.com">vaxa@support.com</a></li>
                    <li>Ring till: <a href="010-00 12 12">010-00 12 12</a> </li>
                </ul>
            
            <h2 className="p-2 lh-base">Rapportera brister i webbplatsens tillgänglighet</h2>
            <p className="p-2 lh-base">Vi strävar hela tiden efter att förbättra webbplatsens tillgänglighet.
                Om du upptäcker problem som inte är beskrivna på den här sidan,
                eller om du anser att vi inte uppfyller lagens krav.
                Meddela oss så att vi får veta att problemet finns.</p>

            <h2 className="p-2 lh-base">Tillsyn</h2>

            <p className="p-2 lh-base">Myndigheten för digital förvaltning, Digg,
                har ansvaret för tillsyn över lagen om tillgänglighet
                till digital offentlig service. Du kan anmäla till Digg
                om du tycker att vår digitala service har brister i tillgänglighet.</p>
            <p className="p-2 lh-base">Du kan också anmäla till Digg om du tycker att vår bedömning av vad som är oskäligt betungande ska granskas,
                om du tycker att vår tillgänglighetsredogörelse har brister eller om du tycker att vi inte har hanterat
                din begäran om tillgängliggörande korrekt.</p>

            <h2 className="p-2 lh-base">Teknisk information om webbplatsens tillgänglighet</h2>

            <p className="p-2 lh-base">Den här webbplatsen är helt förenlig med lagen om tillgänglighet till digital offentlig service.<br />
</p>
          <h2 className="p-2 lh-base">Hur vi testat webbplatsen</h2>
            <p className="p-2 lh-base">Vi har gjort en självskattning intern testning av webbplats.
               
            </p>
            <p className="p-2 lh-base">Senaste bedömningen gjordes den 2024-05-30.</p>
            <p className="p-2 lh-base">Redogörelsen uppdaterades senast den 30 Maj 2024.</p>
            </article>
            </main>
        </div>
            <Footer />
        </div>
    )

};

export default AccessibilityPage;