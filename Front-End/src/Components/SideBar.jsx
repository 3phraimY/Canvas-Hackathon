import React from "react";
import { Link } from "react-router-dom";
import "./SideBar.css";

export default function SideBar() {
  return (
    <div className="sidebar">
      <Link to="/">Home</Link>
      <Link to="/calendar">Calendar</Link>
      <Link to="/classview">Class View</Link>
      <Link
        to="/cookies"
        className="invisible-btn"
        aria-label="Hidden Cookies link"
        title="Hidden action"
      >
        Hidden
      </Link>
    </div>
  );
}
