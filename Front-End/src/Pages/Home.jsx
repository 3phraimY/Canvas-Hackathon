import WeekCalendar from "../Components/WeekCalendar";
import { useState, useEffect } from 'react';
import {listCourses} from '../hooks/CanvasAPI';

export default function Home() {

  const [coursedata, setcoursedata] = useState(0);

  useEffect(() => {
    setcoursedata(listCourses);
    console.log(coursedata);
  }, []);


  return (
    <>
      <h2>Week At a Glance</h2>
      <h3>Tomorrow</h3>
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

