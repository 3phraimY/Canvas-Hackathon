import React from "react";
import { Link } from "react-router-dom";
import "./SideBar.css";

export default function SideBar() {
  return (
    <div className="sidebar">
      <Link to="/">Home</Link>
      <Link to="/Calendar">Calendar</Link>
      <Link to="/ClassView">Class View</Link>
    </div>
  );
}