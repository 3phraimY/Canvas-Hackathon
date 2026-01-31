import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TopBar from "./Components/TopBar";
import SideBar from "./Components/SideBar";
import Dropdown from "./Components/Dropdown";

import Home from "./Pages/Home";
import Calendar from "./Pages/Calendar";
import ClassView from "./Pages/ClassView";
import Cookies from "./Pages/Cookies";
import Login from "./Pages/Login";

import "./index.css";

export default function App() {
  return (
    <Router>
      <TopBar />

      <div className="layout">
        <SideBar />

        <div className="content">
          <Dropdown />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/classview" element={<ClassView />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
