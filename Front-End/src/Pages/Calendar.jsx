import { useState } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css'



function App() {
  const [date, setDate] = useState(new Date());
  const [ myDate, onChange ] = useState(new Date());
  const tileStuff = ({ date, view }) => {
    if (view === 'month' && myDate && date.toDateString() === myDate.toDateString()) {
      return 'someClass';
    }
  };

  return (
    <div className='app'>
      <div className='calendar-container'>
        <Calendar 
        onChange={onChange} 
        value={date}
        tileClassName={tileStuff}
        />
        
      </div>
    
      <p className='text-center'>
        <span className='bold'>Selected Date:</span>{' '}
        {date.toDateString()}
      </p>

    </div>
  );
}

export default App;
