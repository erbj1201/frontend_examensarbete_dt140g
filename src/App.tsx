/* Webbutvecklingsprogrammet
Självständigt arbete DT140G
Erika Vestin & Sofia Dahlberg */

//import
import "bootstrap/dist/css/bootstrap.css";
import AppRouter from "./components/AppRouter";
import "./main.css";
import { HelmetProvider } from 'react-helmet-async';

const App: React.FC = () => {
  return (
    <>
    <HelmetProvider>
      <div>
        {/*including fonts from google fonts*/}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sigmar+One&display=swap"
          rel="stylesheet"
        />
      </div>
      <div>
      </div>
        <AppRouter />
     </HelmetProvider>
      
    </>
  );
};
//export
export default App;
