import { useState, useEffect } from "react";
import { listCourses } from "../hooks/CanvasAPI";

export default function Home() {
  const [coursedata, setcoursedata] = useState(0);
  const [nextTwoDaysAssignments, setNextTwoDaysAssignments] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      const response = await listCourses();
      setcoursedata(response.data);

      // Get tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      // Get the date 2 days from now
      const twoDaysLater = new Date();
      twoDaysLater.setDate(twoDaysLater.getDate() + 2);
      twoDaysLater.setHours(23, 59, 59, 999);

      // Filter assignments for the next 2 days
      const assignmentsArray = [];

      response.data.forEach(course => {
        if (course.upcoming_assignments && course.upcoming_assignments.length > 0) {
          course.upcoming_assignments.forEach(assignment => {
            const assignmentDate = new Date(assignment.start);
            assignmentDate.setHours(0, 0, 0, 0);

            // Check if assignment is within next 2 days (starting from tomorrow)
            if (assignmentDate >= tomorrow && assignmentDate <= twoDaysLater) {
              assignmentsArray.push({
                title: assignment.summary,
                date: assignmentDate,
                courseName: course.name
              });
            }
          });
        }
      });

      setNextTwoDaysAssignments(assignmentsArray);
    }
    fetchCourses();
  }, []);

  return (
    <>
      <h2>Week At a Glance</h2>
      <h3>Upcoming Assignments</h3>
      {nextTwoDaysAssignments && nextTwoDaysAssignments.length > 0 ? (
        <div>
          <ul>
            {nextTwoDaysAssignments.map((assignment, idx) => (
              <li key={idx}>
                <strong>{assignment.title}</strong> - {assignment.courseName}
                <br />
                <small>{assignment.date.toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ fontSize: "1.2em", fontStyle: "italic", color: "#27ae60" }}>
          Enjoy some Relaxation!
        </p>
      )}
    </>
  );
}
