import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import AuthLayout from "../layouts/AuthLayout";

const API = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const r = searchParams.get("role");
    if (r && ["user", "bunk", "agent"].includes(r)) {
      setRole(r);
    }
  }, [searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "info", text: "Registering..." });

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", text: data.error || "Registration failed" });
        return;
      }

      setStatus({ type: "success", text: "Registered successfully!" });
      setTimeout(() => navigate(`/login?role=${role}`), 800);
    } catch {
      setStatus({ type: "error", text: "Network error" });
    }
  }

  async function handleGoogleRegister(credential) {
    setStatus({ type: "info", text: "Creating account with Google..." });

    try {
      const res = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", text: data.error });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      setStatus({ type: "success", text: "Account created!" });
      setTimeout(() => navigate(`/main/${data.role}`), 700);
    } catch {
      setStatus({ type: "error", text: "Google registration failed" });
    }
  }

  return (
    <AuthLayout role={role}>
      <h1>Create an account</h1>
      <p className="lead">Register as <strong>{role}</strong></p>

      <GoogleLogin
        onSuccess={(res) => handleGoogleRegister(res.credential)}
        onError={() => setStatus({ type: "error", text: "Google auth failed" })}
      />

      <div className="divider"><span>or</span></div>

      {status && <div className={`auth-status ${status.type}`}>{status.text}</div>}

      <form onSubmit={handleSubmit}>
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">Customer</option>
          <option value="bunk">Petrol Bunk Owner</option>
          <option value="agent">Delivery Agent</option>
        </select>

        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button className="primary">Register</button>
      </form>

      <p className="muted">
        Already have an account?{" "}
        <Link to={`/login?role=${role}`} className="small-link">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
