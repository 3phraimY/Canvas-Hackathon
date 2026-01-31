import React from "react";
import { Link } from "react-router-dom";
import "./SideBar.css";

export default function SideBar() {
  return (
    <div className="sidebar">
      <Link to="/">Home</Link>
      <Link to="/calendar">Calendar</Link>
      <Link to="/classview">Class View</Link>
    </div>
  );
}