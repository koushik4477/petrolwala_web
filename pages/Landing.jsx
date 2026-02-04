import React from "react";
import { Link } from "react-router-dom";
import LiquidEther from "../components/LiquidEther";
import "./landing.css";

export default function Landing() {
  return (
    <div className="pw-page pw-with-fluid">
      {/* Fluid background */}
      <div className="pw-fluid-wrap" aria-hidden>
        <LiquidEther
          colors={[
            "#050505",
            "#0b0b0b",
            "#00e5ff",
            "#ff9f1c"
          ]}
          mouseForce={26}
          cursorSize={130}
          resolution={0.7}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={1.8}
          takeoverDuration={0.35}
          autoResumeDelay={2800}
          autoRampDuration={0.7}
        />
      </div>

      {/* Floating petrol drops */}
      <div className="pw-drops" aria-hidden>
        <span className="drop" />
        <span className="drop" />
        <span className="drop" />
        <span className="drop" />
        <span className="drop" />
        <span className="drop" />
      </div>

      <header className="pw-header">
        <div className="pw-brand">
          <div className="pw-logo">⛽</div>
          <div>
            <h1 className="pw-title">PetrolWala</h1>
            <div className="pw-tag">Fuel delivered — fast & friendly</div>
          </div>
        </div>

        <nav>
          <Link className="pw-nav" to="/login">Login</Link>
          <Link className="pw-nav pw-register" to="/register">Register</Link>
        </nav>
      </header>

      <main className="pw-main">
        <section className="pw-hero">
          <div className="pw-left">
            <h2 className="pw-h2">Get fuel when you need it</h2>
            <p className="pw-sub">
              Quick deliveries, trusted bunk owners, and reliable agents — choose your role and start.
            </p>

            <div className="pw-buttons">
              <Link to="/register?role=user" className="pw-btn pw-user">
                🚗 Order Petrol
              </Link>

              <Link to="/register?role=bunk" className="pw-btn pw-bunk">
                🏪 Manage Bunk
              </Link>

              <Link to="/register?role=agent" className="pw-btn pw-agent">
                🚚 Deliver Orders
              </Link>
            </div>

            <div className="pw-links">
              <Link to="/login" className="pw-small">
                Already have an account? Login
              </Link>
            </div>
          </div>

          <aside className="pw-visual">
            <div className="fuel-card">
              <div className="fuel-ring">
                <div className="fuel-center" />
              </div>
              <div className="fuel-text">
                Fast delivery — live tracking coming soon
              </div>
            </div>
          </aside>
        </section>
      </main>

      <footer className="pw-footer">
        © {new Date().getFullYear()} PetrolWala
      </footer>
    </div>
  );
}
