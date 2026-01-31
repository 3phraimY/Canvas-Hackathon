import React, { useState } from "react";
import "./Dropdown.css";

export default function Dropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="dropdown">
      <button onClick={() => setOpen(!open)}>Menu ▼</button>

      {open && (
        <div className="dropdown-content">
          <p>Option 1</p>
          <p>Option 2</p>
          <p>Option 3</p>
        </div>
      )}
    </div>
  );
}   