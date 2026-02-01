import { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import WeekCalendar from '../Components/WeekCalendar';
import { listCourses } from '../hooks/CanvasAPI';
import './Calendar.css'

function App() {
  const [date, setDate] = useState(new Date());
  const [myDate, onChange] = useState(new Date());
  const [assignments, setAssignments] = useState({});
  const [allAssignments, setAllAssignments] = useState([]);
  const [customEvents, setCustomEvents] = useState({});
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    time: '12:00'
  });

  useEffect(() => {
    async function fetchCourses() {
      const response = await listCourses();
      
      // Extract and organize assignments by date
      const assignmentsByDate = {};
      const allAssignmentsArray = [];
      
      response.data.forEach(course => {
        if (course.upcoming_assignments) {
          course.upcoming_assignments.forEach(assignment => {
            const dateStr = new Date(assignment.start).toISOString().slice(0, 10);
            if (!assignmentsByDate[dateStr]) {
              assignmentsByDate[dateStr] = [];
            }
            
            const assignmentObj = {
              id: assignment.uid,
              summary: assignment.summary,
              date: dateStr,
              start: assignment.start,
              end: assignment.end,
              description: assignment.description,
              courseName: course.name,
              url: assignment.assignment_URL,
              type: 'assignment'
            };
            
            assignmentsByDate[dateStr].push(assignmentObj);
            allAssignmentsArray.push(assignmentObj);
          });
        }
      });
      
      setAssignments(assignmentsByDate);
      setAllAssignments(allAssignmentsArray);
    }
    fetchCourses();
    
    // Load custom events from localStorage
    const saved = localStorage.getItem('customEvents');
    if (saved) {
      setCustomEvents(JSON.parse(saved));
    }
  }, []);

  const tileStuff = ({ date, view }) => {
    if (view === 'month' && myDate && date.toDateString() === myDate.toDateString()) {
      return 'someClass';
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      try {
        const dateStr = date.toISOString().slice(0, 10);
        const dayAssignments = (assignments[dateStr] && Array.isArray(assignments[dateStr])) ? assignments[dateStr] : [];
        const dayEvents = (customEvents[dateStr] && Array.isArray(customEvents[dateStr])) ? customEvents[dateStr] : [];
        const allDayEvents = [...dayAssignments, ...dayEvents].filter(e => e && typeof e === 'object');
        
        if (allDayEvents.length > 0) {
          return (
            <div 
              className='tile-events'
              onClick={(e) => {
                e.stopPropagation();
                handleAssignmentClick(e, dateStr);
              }}
            >
              {allDayEvents.slice(0, 3).map((event, idx) => {
                const eventName = event && (event.summary || event.title);
                if (!eventName || typeof eventName !== 'string') return null;
                
                return (
                  <div key={`${dateStr}-${idx}`} className='event-item' title={eventName}>
                    <span className={`event-type ${event.type || 'custom'}`}>
                      {eventName.substring(0, 12)}
                      {eventName.length > 12 ? '...' : ''}
                    </span>
                  </div>
                );
              })}
              {allDayEvents.length > 3 && (
                <div className='event-more'>+{allDayEvents.length - 3} more</div>
              )}
            </div>
          );
        }
      } catch (error) {
        console.error('Error rendering tile content:', error);
      }
    }
    return null;
  };

  const handleAssignmentClick = useCallback((e, dateStr) => {
    e.stopPropagation();
    if (!showModal) {
      try {
        const dayAssignments = (allAssignments || []).filter(a => a && a.date === dateStr);
        const dayEvents = ((customEvents[dateStr] || []).filter(e => e && e.type === 'custom')) || [];
        
        const combined = [...(dayAssignments || []), ...(dayEvents || [])].filter(item => item && typeof item === 'object');
        
        if (combined.length > 0) {
          setSelectedAssignment(combined);
          setShowModal(true);
        }
      } catch (error) {
        console.error('Error handling assignment click:', error);
        setShowModal(false);
      }
    }
  }, [showModal, allAssignments, customEvents]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedAssignment(null);
  }, []);

  const openEventModal = useCallback(() => {
    setEventFormData({
      title: '',
      date: myDate.toISOString().slice(0, 10),
      time: '12:00'
    });
    setShowEventModal(true);
  }, [myDate]);

  const closeEventModal = useCallback(() => {
    setShowEventModal(false);
  }, []);

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const { title, date, time } = eventFormData;
    
    if (!title.trim()) {
      alert('Please enter an event title');
      return;
    }

    const newEvent = {
      id: `event-${Date.now()}`,
      title,
      date,
      time,
      type: 'custom',
      summary: title
    };

    const updatedEvents = {
      ...customEvents,
      [date]: [...(customEvents[date] || []), newEvent]
    };

    setCustomEvents(updatedEvents);
    localStorage.setItem('customEvents', JSON.stringify(updatedEvents));
    
    setEventFormData({
      title: '',
      date: new Date().toISOString().slice(0, 10),
      time: '12:00'
    });
    setShowEventModal(false);
  };

  const deleteCustomEvent = (dateStr, eventId) => {
    const updated = {
      ...customEvents,
      [dateStr]: customEvents[dateStr].filter(e => e.id !== eventId)
    };
    if (updated[dateStr].length === 0) {
      delete updated[dateStr];
    }
    setCustomEvents(updated);
    localStorage.setItem('customEvents', JSON.stringify(updated));
  };

  return (
    <div className='app'>
      <div className='calendar-container'>
        <Calendar 
        onChange={onChange} 
        value={date}
        tileClassName={tileStuff}
        tileContent={tileContent}
        />
      </div>
      <p className="text-center">
        <span className="bold">Selected Date:</span>{" "}
        {selectedDate.toDateString()}
      </p>

      <div className='calendar-controls'>
        <button className='create-event-btn' onClick={openEventModal}>
          + Create Event
        </button>
      </div>

      <h2>This Week's Assignments</h2>
      <WeekCalendar assignments={assignments} startDate={myDate} />

      {showModal && selectedAssignment && Array.isArray(selectedAssignment) && selectedAssignment.length > 0 && (
        <div className='modal-overlay' onClick={closeModal}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h2>Events for {selectedAssignment[0]?.date || 'Unknown Date'}</h2>
              <button className='close-btn' onClick={closeModal}>✕</button>
            </div>
            <div className='modal-body'>
              {selectedAssignment.slice(0, 2).filter(event => event && typeof event === 'object').map((event, idx) => {
                if (!event || typeof event !== 'object') return null;
                return (
                  <div key={`${event.id || idx}-${idx}`} className={`event-detail ${event.type || 'custom'}`}>
                    <h3>{String(event.summary || event.title || 'Untitled')}</h3>
                    <p><strong>Type:</strong> {event.type === 'assignment' ? 'Assignment' : 'Custom Event'}</p>
                    {event.type === 'assignment' && event.courseName && (
                      <>
                        <p><strong>Course:</strong> {String(event.courseName)}</p>
                        {event.description && (
                          <p><strong>Description:</strong> {String(event.description)}</p>
                        )}
                        {event.start && (
                          <p><strong>Due:</strong> {new Date(event.start).toLocaleString()}</p>
                        )}
                        {event.url && (
                          <a href={event.url} target='_blank' rel='noopener noreferrer' className='event-link'>
                            View in Canvas
                          </a>
                        )}
                      </>
                    )}
                    {event.type === 'custom' && (
                      <>
                        <p><strong>Time:</strong> {String(event.time || 'No time set')}</p>
                        <button 
                          className='delete-btn'
                          onClick={() => {
                            if (event.date && event.id) {
                              deleteCustomEvent(event.date, event.id);
                              setSelectedAssignment(selectedAssignment.filter(e => e && e.id !== event.id));
                            }
                          }}
                        >
                          Delete Event
                        </button>
                      </>
                    )}
                    {idx < Math.min(selectedAssignment.slice(0, 2).length - 1, 1) && <hr />}
                  </div>
                );
              })}
              {selectedAssignment.length > 2 && (
                <div className='modal-info'>
                  <p>+{selectedAssignment.length - 2} more event(s) on this date</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showEventModal && (
        <div className='modal-overlay' onClick={closeEventModal}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h2>Create New Event</h2>
              <button className='close-btn' onClick={closeEventModal}>✕</button>
            </div>
            <div className='modal-body'>
              <form onSubmit={handleEventSubmit} className='event-form'>
                <div className='form-group'>
                  <label>Event Title</label>
                  <input
                    type='text'
                    value={eventFormData.title}
                    onChange={(e) => setEventFormData({...eventFormData, title: e.target.value})}
                    placeholder='Enter event title'
                    required
                  />
                </div>
                <div className='form-group'>
                  <label>Date</label>
                  <input
                    type='date'
                    value={eventFormData.date}
                    onChange={(e) => setEventFormData({...eventFormData, date: e.target.value})}
                    required
                  />
                </div>
                <div className='form-group'>
                  <label>Time</label>
                  <input
                    type='time'
                    value={eventFormData.time}
                    onChange={(e) => setEventFormData({...eventFormData, time: e.target.value})}
                    required
                  />
                </div>
                <div className='form-actions'>
                  <button type='submit' className='submit-btn'>Create Event</button>
                  <button type='button' className='cancel-btn' onClick={closeEventModal}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
