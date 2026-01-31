import React, { useState, useEffect, useRef } from "react";
import "./Cookies.css";

const SPEED = 0.2; // Adjusted speed factor

export default function Cookies() {
  const [cookies, setCookies] = useState(() => {
    try {
      const s = localStorage.getItem("cookiesCount");
      return s ? parseInt(s, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [money, setMoney] = useState(() => {
    try {
      const s = localStorage.getItem("moneyCount");
      return s ? parseInt(s, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [multiplier, setMultiplier] = useState(() => {
    try {
      const s = localStorage.getItem("clickMultiplier");
      return s ? parseInt(s, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [upgradeCost, setUpgradeCost] = useState(() => {
    try {
      const s = localStorage.getItem("upgradeCost");
      return s ? parseInt(s, 10) : 100;
    } catch {
      return 100;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cookiesCount", String(cookies));
      localStorage.setItem("moneyCount", String(money));
      localStorage.setItem("clickMultiplier", String(multiplier));
      localStorage.setItem("upgradeCost", String(upgradeCost));
    } catch {}
  }, [cookies, money, multiplier, upgradeCost]);

  const handleClick = () => {
    setCookies((c) => c + multiplier);
    setMoney((m) => m + multiplier);
  };
//Upgrade cost and multiplier
  const purchaseUpgrade = () => {
    if (money < upgradeCost) return;
    setMoney((m) => m - upgradeCost);
    setMultiplier((v) => v + 3);
    setUpgradeCost((cost) => cost * 10);
  };

  const resetAll = () => {
    if (!window.confirm("Reset cookies, money, multiplier and upgrades?")) return;
    setCookies(0);
    setMoney(0);
    setMultiplier(1);
    setUpgradeCost(100);
    try {
      localStorage.setItem("cookiesCount", "0");
      localStorage.setItem("moneyCount", "0");
      localStorage.setItem("clickMultiplier", "1");
      localStorage.setItem("upgradeCost", "100");
    } catch {}
  };

  // Animation refs
  const containerRef = useRef(null);
  const cookieRef = useRef(null);
  const posRef = useRef({
    x: 0,
    y: 0,
    dx: (2 + Math.random() * 2) * SPEED, // horizontal speed
    dy: (2 + Math.random() * 2) * SPEED, // vertical speed
  });
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);

  // Start animation
  useEffect(() => {
    const container = containerRef.current;
    const cookieEl = cookieRef.current;
    if (!container || !cookieEl) return;

    // initialize position to center
    const init = () => {
      const contRect = container.getBoundingClientRect();
      const cookieRect = cookieEl.getBoundingClientRect();
      posRef.current.x = (contRect.width - cookieRect.width) / 0.5;
      posRef.current.y = (contRect.height - cookieRect.height) / 0.5;
      // randomize direction
      if (Math.random() < 0.5) posRef.current.dx *= -1;
      if (Math.random() < 0.5) posRef.current.dy *= -1;
    };

    init();

    const onResize = () => {
      // ensure cookie stays in bounds after resize
      const contRect = container.getBoundingClientRect();
      const cookieRect = cookieEl.getBoundingClientRect();
      posRef.current.x = Math.min(Math.max(0, posRef.current.x), Math.max(0, contRect.width - cookieRect.width));
      posRef.current.y = Math.min(Math.max(0, posRef.current.y), Math.max(0, contRect.height - cookieRect.height));
    };
    window.addEventListener("resize", onResize);

    const step = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = Math.min(50, time - lastTimeRef.current); // cap delta
      lastTimeRef.current = time;

      const contRect = container.getBoundingClientRect();
      const cookieRect = cookieEl.getBoundingClientRect();
      const speedFactor = dt / 16; // normalize movement to ~60fps baseline

      let { x, y, dx, dy } = posRef.current;
      x += dx * speedFactor;
      y += dy * speedFactor;

      // check horizontal bounds
      if (x <= 0) {
        x = 0;
        dx = Math.abs(dx);
      } else if (x + cookieRect.width >= contRect.width) {
        x = Math.max(0, contRect.width - cookieRect.width);
        dx = -Math.abs(dx);
      }

      // check vertical bounds
      if (y <= 0) {
        y = 0;
        dy = Math.abs(dy);
      } else if (y + cookieRect.height >= contRect.height) {
        y = Math.max(0, contRect.height - cookieRect.height);
        dy = -Math.abs(dy);
      }

      posRef.current.x = x;
      posRef.current.y = y;
      posRef.current.dx = dx;
      posRef.current.dy = dy;

      cookieEl.style.transform = `translate(${x}px, ${y}px)`;

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  return (
    <div className="cookies-page">
      <div className="cookies-container">
        <h2 className="cookies-title">Cookie Clicker</h2>

        <div className="cookies-main">
          {/* Left: Cookies count */}
          <div className="cookies-left">
            <div className="stat-title">Cookies Collected</div>
            <div className="stat-value">{cookies}</div>
            <div className="helper-text">Each click gives {multiplier} cookie(s).</div>
          </div>

          {/* Center: animation area */}
          <div className="animation-area" ref={containerRef}>
            <button
              ref={cookieRef}
              onClick={handleClick}
              aria-label="Collect a cookie"
              title="Collect a cookie"
              className="cookie-btn moving"
            >
              🍪
            </button>
          </div>

          {/* Right: Money & Upgrade */}
          <div className="cookies-right">
            <div>
              <div className="money-title">Money</div>
              <div className="money-value">{money}</div>
            </div>

            <div className="upgrade-area">
              <button
                onClick={purchaseUpgrade}
                disabled={money < upgradeCost}
                aria-label={`Upgrade multiplier for ${upgradeCost} money`}
                title={`Upgrade multiplier for ${upgradeCost} money`}
                className={`upgrade-btn ${money < upgradeCost ? "disabled" : ""}`}
              >
                Upgrade Multiplier (+1) — Cost: {upgradeCost}
              </button>

              <button onClick={resetAll} className="reset-btn" title="Reset all progress">
                Reset
              </button>

              <div className="helper-text">
                Current multiplier: <strong>{multiplier}×</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}