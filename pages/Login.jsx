import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import LiquidEther from "../components/LiquidEther";
import "./auth.css";

const API = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "info", text: "Signing in..." });

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", text: data.error || "Login failed" });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      setStatus({ type: "success", text: "Login successful — redirecting..." });
      setTimeout(() => navigate(`/main/${data.role}`), 900);
    } catch {
      setStatus({ type: "error", text: "Backend not reachable" });
    }
  }

  async function handleGoogleLogin(credential) {
    setStatus({ type: "info", text: "Signing in with Google..." });

    try {
      const res = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", text: data.error || "Google login failed" });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      setStatus({ type: "success", text: "Google login successful!" });
      setTimeout(() => navigate(`/main/${data.role}`), 700);
    } catch {
      setStatus({ type: "error", text: "Google auth failed" });
    }
  }

  return (
    <div className="auth-page role-user">
      <div className="auth-fluid" aria-hidden>
        <LiquidEther autoDemo autoSpeed={0.45} />
      </div>

      <main className="auth-card animate-in">
        <div className="auth-header">
          <Link to="/" className="back-home">← Home</Link>
          <div className="auth-logo">⛽</div>
        </div>

        <h1>Sign in</h1>
        <p className="lead">Enter your credentials to continue</p>

        {status && <div className={`auth-status ${status.type}`}>{status.text}</div>}

        {/* 🔹 Google Login */}
        <div style={{ marginBottom: 14 }}>
          <GoogleLogin
            onSuccess={(res) => handleGoogleLogin(res.credential)}
            onError={() =>
              setStatus({ type: "error", text: "Google authentication failed" })
            }
          />
        </div>

        <div className="divider"><span>or</span></div>

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />

          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button className="primary">Sign in</button>
        </form>

        <p className="muted">
          Don’t have an account?{" "}
          <Link to="/register" className="small-link">Register</Link>
        </p>
      </main>
    </div>
  );
}
