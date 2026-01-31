import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "./Calendar.css";
import { listCourses } from "../hooks/CanvasAPI";

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [coursedata, setcoursedata] = useState([]);
  const [assignmentDates, setAssignmentDates] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      const response = await listCourses();
      const courses = response.data || [];
      setcoursedata(courses);

      const dates = [];
      courses.forEach((course) => {
        if (course.upcoming_assignments) {
          course.upcoming_assignments.forEach((assignment) => {
            if (assignment.start) {
              dates.push(new Date(assignment.start).toDateString());
            }
            if (assignment.end) {
              dates.push(new Date(assignment.end).toDateString());
            }
          });
        }
      });
      setAssignmentDates(dates);
    }
    fetchCourses();
  }, []);

  const tileClassName = ({ date, view }) => {
    if (view === "month" && assignmentDates.includes(date.toDateString())) {
      return "assignment-day";
    }
    return null;
  };

  return (
    <div className="app">
      <div className="calendar-container">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={tileClassName}
        />
      </div>
      <p className="text-center">
        <span className="bold">Selected Date:</span>{" "}
        {selectedDate.toDateString()}
      </p>
      {coursedata.length > 0 && (
        <div>
          <h3>Assignments on {selectedDate.toDateString()}:</h3>
          <ul>
            {coursedata.flatMap((course) =>
              (course.upcoming_assignments || [])
                .filter(
                  (a) =>
                    new Date(a.start).toDateString() ===
                    selectedDate.toDateString(),
                )
                .map((a) => (
                  <li key={a.uid}>
                    {a.summary} (
                    <a
                      href={a.assignment_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                    )
                  </li>
                )),
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
