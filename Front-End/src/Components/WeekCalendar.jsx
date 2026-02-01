import React from "react";
import "./WeekCalendar.css";

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 (Sun) - 6 (Sat)
  const start = new Date(d);
  start.setDate(d.getDate() - day); // move to Sunday
  start.setHours(0, 0, 0, 0);
  return start;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(d) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// According to the documentation, assignments should be object keyed(?) by ISO date string (YYYY-MM-DD)
//Essentially a mapping of dates to list of assignment strings 
// The example given is this: { "2026-01-31": ["Math: p.10", "Science lab"] }
export default function WeekCalendar({ assignments = {}, startDate = null }) {
  const today = new Date();
  const dateToUse = startDate || today;
  const start = getStartOfWeek(dateToUse);
  const days = Array.from({ length: 7 }).map((_, i) => {
    const dt = new Date(start);
    dt.setDate(start.getDate() + i);
    return dt;
  });

  const keyFor = (d) => d.toISOString().slice(0, 10);

  return (
    <div className="week-calendar">
      {days.map((day) => {
        const key = keyFor(day);
        const items = assignments[key] || [];
        return (
          <div
            key={day.toDateString()}
            className={"day" + (isSameDay(day, today) ? " today" : "")}
          >
            <div className="day-name">
              {day.toLocaleDateString(undefined, { weekday: "short" })}
            </div>
            <div className="day-date">{formatDate(day)}</div>
            <ul className="assignments">
              {items.length > 0 ? (
                items.map((it, idx) => (
                  <li key={idx} className="assignment-item">
                    {it}
                  </li>
                ))
              ) : (
                // placeholder for actual assignment names
                <>
                  <li className="assignment-placeholder">—</li>
                  <li className="assignment-placeholder">—</li>
                </>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
