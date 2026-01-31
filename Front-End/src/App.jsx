import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TopBar from "./components/TopBar";
import SideBar from "./components/SideBar";
import Dropdown from "./components/Dropdown";

import Home from "./Pages/Home";
import Calendar from "./Pages/Calendar";
import ClassView from "./Pages/ClassView";
import Cookies from "./Pages/Cookies";

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
          </Routes>
        </div>
      </div>
    </Router>
  );
}