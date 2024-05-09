import React, { useEffect} from 'react';
import Footer from "../components/Footer";
import Header from "../components/Header";
import TokenCookie from "../components/TokenCookie";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

import 'react-big-calendar/lib/css/react-big-calendar.css'


const CalenderPage: React.FC = () => {
  const localizer = momentLocalizer(moment)
  //Start week with monday instead of sunday


  moment.locale('ko',{
    week:{
      dow : 1
    }
  });
  return (
    <div>
      {/*Including components*/}
      <Header />
      <TokenCookie />
      <main className="container mx-auto">
        <h1>Kalender</h1>
          <div>
    <Calendar
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
     culture="sv-SE"
      style={{ height: 500 }}
    />
  </div>

      </main>
      <Footer />
    </div>
  );
}; //export
export default CalenderPage;
