import { useState } from "react";

/**
 * Login page for Canvas SSO and token storage.
 */
export default function Login() {
  const [token, setToken] = useState(
    () => localStorage.getItem("canvas_token") || "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  const [f00, setF00] = useState("");
  const [password, setPassword] = useState("");

  // Open Canvas SSO in a popup and detect when login is complete
  const loginWithSSO = () => {
    setError("");
    setLoading(true);
    const ssoUrl = "https://cuwaa.instructure.com/login/saml";
    const popup = window.open(ssoUrl, "CanvasSSO", "width=600,height=700");
    const timer = setInterval(() => {
      try {
        if (
          popup &&
          popup.location &&
          popup.location.hostname === "cuwaa.instructure.com" &&
          popup.location.pathname === "/"
        ) {
          popup.close();
          clearInterval(timer);
          setLoading(false);
        }
      } catch (e) {}
      if (popup && popup.closed) {
        clearInterval(timer);
        setLoading(false);
      }
    }, 700);
  };

  // Handle F00/password submit: just trigger SSO popup
  const handleSubmit = (e) => {
    e.preventDefault();
    loginWithSSO();
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: 24,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2>Canvas Login</h2>
    </div>
  );
}
