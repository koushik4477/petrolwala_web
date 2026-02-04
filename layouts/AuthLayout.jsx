import React from "react";
import { Link } from "react-router-dom";
import LiquidEther from "../components/LiquidEther";
import "../pages/auth.css";

export default function AuthLayout({ children, role = "user" }) {
  return (
    <div className={`auth-page role-${role}`}>
      <div className="auth-fluid" aria-hidden>
        <LiquidEther
          colors={["#050505", "#0b0b0b", "#00e5ff", "#ff9f1c"]}
          mouseForce={22}
          cursorSize={120}
          resolution={0.6}
          autoDemo
          autoSpeed={0.45}
          autoIntensity={1.5}
        />
      </div>

      <main className="auth-card animate-in">
        <div className="auth-header">
          <Link to="/" className="back-home">← Home</Link>
          <div className="auth-logo">⛽</div>
        </div>

        {children}
      </main>
    </div>
  );
}
