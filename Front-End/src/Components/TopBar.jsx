import React, { useState, useEffect } from "react";
import "./TopBar.css";

export default function TopBar() {
  const defaultText = "We are Coders™ bum bad dum da dum dum dum";
  const randomMessages = [
    "We're the Coders™",
    "Mmmmm, Coders We Are ™",
    "You might be gay",
  ];

  const [displayText, setDisplayText] = useState(defaultText);

  useEffect(() => {
    const changeTextRandomly = () => {
      // 0.1% chance to change text every 3 seconds
      if (Math.random() < 0.001) {
        const randomIndex = Math.floor(Math.random() * randomMessages.length);
        setDisplayText(randomMessages[randomIndex]);

        // Return to default text after 8 seconds
        setTimeout(() => {
          setDisplayText(defaultText);
        }, 8000);
      }
    };

    const interval = setInterval(changeTextRandomly, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="topbar">
      <div className="ticker-container">
        <h2 className="ticker-text">{displayText}</h2>
      </div>
    </div>
  );
}