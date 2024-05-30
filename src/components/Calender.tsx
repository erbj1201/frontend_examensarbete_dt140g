/* Webbutvecklingsprogrammet
Självständigt arbete DT140G
Erika Vestin & Sofia Dahlberg */
/*Calender component*/
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
const Calender: React.FC = () => {

  const localizer = momentLocalizer(moment)
  //Start week with monday instead of sunday
  moment.locale('ko', {
    week: {
      dow: 1
    }
  });
  return (
    <Calendar
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      culture="sv-SE"
      style={{ height: 300 }}
    />
  )
}
export default Calender;
