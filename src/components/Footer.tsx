//Footer.tsx
//Component
const Footer = () => {
    return (
      <div>
        <footer className="container-fluid w-100 mx-auto text-center border-top">
          <div className="d-flex justify-content-between">
            <div className="mx-auto pt-5">
          <p className="text-uppercase">Länkar </p>
          <p><br />
          <a href="https://www.vxa.se/">Växa Sverige</a>
          <br />
          <a href="https://dreambroker.com/channel/npeiza94#/menu">Instruktionsfilmer</a>
          </p>
          </div>
            <div className="mx-auto pt-5">
          <p className="text-uppercase">Kontakta oss </p>
          <br />
          <p>Användarstöd <strong>010-471 09 07</strong> 
           <br />Kokontroll - Rättning <strong> 010 - 471 09 00</strong>
            <br />Kundsupport <strong> 010 - 471 06 60 </strong>
            </p>
          </div>
          </div>
          <p> © Växa Sverige 2024 </p>
        </footer>
      </div>
    );
  };
  
  export default Footer;