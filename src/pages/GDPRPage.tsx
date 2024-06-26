/* Webbutvecklingsprogrammet
Självständigt arbete DT140G
Erika Vestin & Sofia Dahlberg */

import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";
import UserHeader from "../components/UserHeader";

function GDPRPage() {
  return (
    <div>
        <Helmet>
        <title>MinGård - Personuppgiftsbehandling</title>
      </Helmet>
      <UserHeader />
      <main className="mx-auto container pb-5">
        <article className="container mx-auto p-3 accessibilityDiv">
          <h2 className="mx-auto text-center pt-5 pb-5 lh-base">Information om personuppgiftsbehandling och integritetsskydd</h2>
          <p className="mx-auto lh-base">
            För att du ska kunna använda vårt system MinGård och dess funktioner
            fullt ut krävs det att du i samband med skapande av ett
            användarkonto lämnar vissa personuppgifter till Växa Sverige.
          </p>
          <p className="mx-auto lh-base">
            Personuppgifter som vi samlar in från dig och sparar när du
            registrerar ett konto i MinGård och börjar använda tjänsten är namn,
            mejladress, lösenord och eventuell användarbild som laddas upp.
            Utöver det kommer vi samla in information om besättningar, djur och
            händelser kopplade till djur och besättningar. </p>
            <p className="mx-auto lh-base">
              Det finns ingen
            skyldighet eller lagstadgat krav att du måste lämna personuppgifter
            till oss, men det är nödvändigt för att kunna använda MinGård.
            Förutom de uppgifter som man själv lämnar, innebär besök som du gör
            på webbplatsen där MinGård finns att vi från din webbläsare tar emot
            och i serverloggar sparar information om webbläsaren och använt
            IP-nummer. Dessa uppgifter sparas i anonymiserad form utan att
            kopplas direkt till dig som person. 
            </p>
            <p className="mx-auto lh-base">Webbplatsen där MinGård finns
            använder s.k. cookies. En cookie är en liten textfil som sparas på
            besökarens dator och som används för att vissa funktioner på
            webbplatsen ska fungera, för analys och statistik från besök på
            webbplatsen samt för att skaffa oss bättre kunskap om hur
            webbplatsen används och göra det möjligt för oss att utveckla och
            förbättra webbplatsens innehåll. Det är Växa som har
            ansvaret för MinGård, webbplatsen där MinGård finns och ansvariga
            för den personuppgiftsbehandling som sker.
          </p> <p className="mx-auto lh-base">
          Våra kontaktuppgifter kan komma att förändras över tid, vilket i så
          fall framgår av  <a href="https://www.vxa.se/om-oss/kontaktkortsok/">Växas webbplats</a>.</p>
          <br />
          <h3 className="mx-auto lh-base">Växas adresser</h3>
          <p className="mx-auto lh-base">Växa Sverige Ekonomisk förening
            <br/><br/>
<strong>Besöksadress</strong>
<br/>
ULLS VÄG 29 A
<br/>
75651 Uppsala
</p>
<p className="mx-auto lh-base">
<strong> Utdelningsadress</strong>
<br/>
BOX 288
<br/>
75105 Uppsala
          </p>
          <h4 className="mx-auto lh-base">Personuppgifterna kommer att användas
          av Växa för följande ändamål: </h4>
        <br />
        <p className="mx-auto lh-base">I syfte att
          tillhandahålla en applikation där användare kan registrera ett konto
          för att kunna logga in i MinGård och administrera sin nötkreatur och
          händelser kopplade till nötkreatur och besättningar till CDB.
          </p>
          <h4 className="mx-auto lh-base"> Personuppgifterna kommer att hanteras på följande sätt: </h4>
          <p className="mx-auto lh-base">
          Personuppgifterna kommer att skickas från webbplatsen och lagras i en
          databas med ett tillhörande API som kan nås av oss. Uppgifterna kommer
          att användas för ovanstående ändamål och i enlighet med detta
          samtycke. Den rättsliga grunden för behandlingen av dina
          personuppgifter är att du har gett ditt frivilliga samtycke.
          Personuppgifterna kommer endast behandlas av behörig personal på Växa Sverige. Vi delar inte dina personuppgifter med tredje part. 
          </p>
          <p className="mx-auto lh-base">
           Magnus Nygren är personuppgiftsansvarig. Samtycket är
          giltigt tills vidare och så länge du har ett användarkonto i MinGård.
          Du har rätt att när som helst ta tillbaka ditt samtycke. Detta gör du
          genom att kontakta Växa Sverige, <a href="https://www.vxa.se/om-oss/kontaktkortsok/">Växas kontaktuppgifter </a>. Vi kommer i så fall upphöra att
          behandla personuppgifter som vi har samlat in med stöd av detta
          samtycke. Uppgifter som ingår i resultat som redan har åstadkommits
          kommer dock inte att påverkas av att ditt samtycke återkallas. Vissa
          uppgifter kan även komma att arkiveras i enlighet med svensk lag. </p>
          <p className="mx-auto lh-base"> Du
          har rätt att få information om de personuppgifter vi behandlar om dig.
          Du har också rätt att få felaktiga personuppgifter om dig själv
          rättade. Om du har klagomål på vår behandling av dina personuppgifter
          kan du kontakta vårt dataskyddsombud Mangnus. Du har även
          rätt att inge klagomål till tillsynsmyndigheten (Datainspektionen) om
          du tycker att vi behandlar dina personuppgifter på ett felaktigt sätt.
          Detta gör du enklast genom e-post till 
          <a href="datainspektionen@datainspektionen.se"> datainspektionen@datainspektionen.se</a> eller via telefon <a href="08-657 61 00">08-657 61 00</a>. 
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}

export default GDPRPage;
