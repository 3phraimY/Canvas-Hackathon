import WeekCalendar from "../Components/WeekCalendar";
import { useState, useEffect } from "react";
import { listCourses } from "../hooks/CanvasAPI";

export default function Home() {
  const [coursedata, setcoursedata] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      const data = await listCourses();
      setcoursedata(data);
    }
    fetchCourses();
  }, []);

  return (
    <>
      <h2>Week At a Glance</h2>
      <h3>Tomorrow </h3>
      <div>{JSON.stringify(coursedata)}</div>
      <p>Class </p>
      <p>Class name; homework assignments</p>
      <h3>Next 2 Days</h3>
      <p>Class name; homework assignments</p>
      <p>Class name; homework assignments</p>
      <h2>This Week</h2>
      <WeekCalendar />
    </>
  );
}
