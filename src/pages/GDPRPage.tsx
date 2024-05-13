import Footer from "../components/Footer";
import UserHeader from "../components/UserHeader";

function GDPRPage() {
  return (
    <div>
      <UserHeader />
      <main className="mx-auto container pb-5">
        <article className="container w-75 mx-auto p-3">
          <h2 className="mx-auto text-center pt-5 pb-5">Information om personuppgiftsbehandling och integritetsskydd</h2>
          <p className="w-75 mx-auto">
            För att du ska kunna använda vårt system MinGård och dess funktioner
            fullt ut krävs det att du i samband med skapande av ett
            användarkonto lämnar vissa personuppgifter till Erika Vestin och
            Sofia Dahlberg.
          </p>
          <p className="w-75 mx-auto">
            Personuppgifter som vi samlar in från dig och sparar när du
            registrerar ett konto i MinGård och börjar använda tjänsten är namn,
            mejladress, lösenord och eventuell användarbild som laddas upp.
            Utöver det kommer vi samla in information om besättningar, djur och
            händelser kopplade till djur och besättningar. </p>
            <p className="w-75 mx-auto">
              Det finns ingen
            skyldighet eller lagstadgat krav att du måste lämna personuppgifter
            till oss, men det är nödvändigt för att kunna använda MinGård.
            Förutom de uppgifter som man själv lämnar, innebär besök som du gör
            på webbplatsen där MinGård finns att vi från din webbläsare tar emot
            och i serverloggar sparar information om webbläsaren och använt
            IP-nummer. Dessa uppgifter sparas i anonymiserad form utan att
            kopplas direkt till dig som person. 
            </p>
            <p className="w-75 mx-auto">Webbplatsen där MinGård finns
            använder s.k. cookies. En cookie är en liten textfil som sparas på
            besökarens dator och som används för att vissa funktioner på
            webbplatsen ska fungera, för analys och statistik från besök på
            webbplatsen samt för att skaffa oss bättre kunskap om hur
            webbplatsen används och göra det möjligt för oss att utveckla och
            förbättra webbplatsens innehåll. Det är Erika och Sofia som har
            ansvaret för MinGård, webbplatsen där MinGård finns och ansvariga
            för den personuppgiftsbehandling som sker.
          </p> <p className="w-75 mx-auto">
          Våra kontaktuppgifter kan komma att förändras över tid, vilket i så
          fall framgår av denna webbplats. 
          <br /> <br />
          <strong>Personuppgifterna kommer att användas
          av Erika Vestin och Sofia Dahlberg för följande ändamål: </strong>
        <br /><br />
        I syfte att
          tillhandahålla en applikation där användare kan registrera ett konto
          för att kunna logga in i MinGård och administrera sin nötkreatur och
          händelser kopplade till nötkreatur och besättningar till CDB.
          </p>
          <p className="w-75 mx-auto">
            <strong> Personuppgifterna kommer att hanteras på följande sätt: </strong>
            <br /> <br />
          Personuppgifterna kommer att skickas från webbplatsen och lagras i en
          databas med ett tillhörande API som kan nås av oss. Uppgifterna kommer
          att användas för ovanstående ändamål och i enlighet med detta
          samtycke. Den rättsliga grunden för behandlingen av dina
          personuppgifter är att du har gett ditt frivilliga samtycke.
          Personuppgifterna kommer endast behandlas av Erika Vestin och Sofia
          Dahlberg. Vi delar inte dina personuppgifter med tredje part. 
          </p>
          <p className="w-75 mx-auto">
            Erika Vestin och Sofia Dahlberg är personuppgiftsansvarig. Samtycket är
          giltigt tills vidare och så länge du har ett användarkonto i MinGård.
          Du har rätt att när som helst ta tillbaka ditt samtycke. Detta gör du
          genom att kontakta Erika Vestin, <a href="erbj1201@student.miun.se">erbj1201@student.miun.se</a> eller Sofia
          Dahlberg, <a href="soda2200@student.miun.se">soda2200@student.miun.se</a>. Vi kommer i så fall upphöra att
          behandla personuppgifter som vi har samlat in med stöd av detta
          samtycke. Uppgifter som ingår i resultat som redan har åstadkommits
          kommer dock inte att påverkas av att ditt samtycke återkallas. Vissa
          uppgifter kan även komma att arkiveras i enlighet med svensk lag. </p>
          <p className="w-75 mx-auto"> Du
          har rätt att få information om de personuppgifter vi behandlar om dig.
          Du har också rätt att få felaktiga personuppgifter om dig själv
          rättade. Om du har klagomål på vår behandling av dina personuppgifter
          kan du kontakta vårt dataskyddsombud Erika eller Sofia. Du har även
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
