import { useState } from 'react';
import Calendar from 'react-calendar';
import './calendar.css'



function App() {
  const [date, setDate] = useState(new Date());

  return (
    <div className='app'>
      <h1 className='text-center'>React Calendar</h1>
      <div className='calendar-container'>
        
        
      </div>
    
      <p className='text-center'>
        <span className='bold'>Selected Date:</span>{' '}
        {date.toDateString()}
      </p>

    </div>
  );
}

export default App;