//import
import Footer from "../components/Footer";
import Header from "../components/Header";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const token = cookies.get("token");

const AccessibilityPage: React.FC = () => {
    return (
        <div>
            <Header />
            <div>
                <main className="mx-auto container">
            <h1>Tillgänglighet för MinGård</h1>
            <p> Växa står bakom den här webbplatsen.
                Vi vill att så många som möjligt ska kunna använda den.
                Det här dokumentet beskriver hur MinGård uppfyller lagen
                om tillgänglighet till digital offentlig service,
                eventuella kända tillgänglighetsproblem och hur
                du kan rapportera brister till oss så att vi kan åtgärda dem.</p>
            <h2> Hur tillgänglig är webbplatsen?</h2>
            <p>Vi har inga kända brister i tillgängligheten för den här webbplatsen.
                /Vi är medvetna om att delar av webbplatsen inte är helt tillgängliga. Se avsnittet om innehåll som inte är tillgängligt nedan för mer information.
            </p>
            <h2>Vad kan du göra om du inte kan använda delar av webbplatsen?</h2>
            <p>Om du behöver innehåll från MinGård som inte är tillgängligt för dig, men som är undantaget från lagens tillämpningsområde enligt beskrivning nedan, kan du meddela oss.
            </p>
            <p>Svarstiden är normalt 2-4 arbetdagar.</p>
            <p>Du kan också kontakta oss på följande sätt:</p>
                <ul>
                    <li>Skicka emajl till: </li>
                    <li>Ring till: </li>
                </ul>
            
            <h2>Rapportera brister i webbplatsens tillgänglighet</h2>
            <p>Vi strävar hela tiden efter att förbättra webbplatsens tillgänglighet.
                Om du upptäcker problem som inte är beskrivna på den här sidan,
                eller om du anser att vi inte uppfyller lagens krav.
                Meddela oss så att vi får veta att problemet finns.</p>

            <h2>Tillsyn</h2>

            <p>Myndigheten för digital förvaltning, Digg,
                har ansvaret för tillsyn över lagen om tillgänglighet
                till digital offentlig service. Du kan anmäla till Digg
                om du tycker att vår digitala service har brister i tillgänglighet.</p>
            <p>Du kan också anmäla till Digg om du tycker att vår bedömning av vad som är oskäligt betungande ska granskas,
                om du tycker att vår tillgänglighetsredogörelse har brister eller om du tycker att vi inte har hanterat
                din begäran om tillgängliggörande korrekt.</p>

            <h2>Teknisk information om webbplatsens tillgänglighet</h2>

            <p>Den här webbplatsen är helt förenlig med lagen om tillgänglighet till digital offentlig service.<br />
                Den här webbplatsen är delvis förenlig med lagen om tillgänglighet till digital offentlig service, på grund av de brister som beskrivs nedan.<br />
                Den här webbplatsen är inte förenlig med lagen om tillgänglighet till digital offentlig service. Otillgängliga delar beskrivs nedan.
            </p>
            <h2>Innehåll som inte är tillgängligt</h2>
            <p>Det innehåll som beskrivs nedan är på ett eller annat sätt inte helt tillgängligt.</p>
            <h2>Hur vi testat webbplatsen</h2>
            <p>Vi har gjort en självskattning intern testning av webbplats.
                Extern aktör har gjort en oberoende granskning av webbplats.
                Vi har uppskattat tillgängligheten utan granskning.
            </p>
            <p>Senaste bedömningen gjordes den XXXX-XX-XX</p>
            <p>Redogörelsen uppdaterades senast den dagens datum dag månad år.</p>
            </main>
        </div>
            <Footer />
        </div>
    )

};

export default AccessibilityPage;