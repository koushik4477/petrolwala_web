import React from 'react';

export default function MainAgent() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Agent Dashboard</h1>
      <p>Welcome, agent — this is a placeholder dashboard. Replace with your real UI.</p>

      {/* Example quick controls */}
      <section>
        <h2>Tasks</h2>
        <ul>
          <li>View assigned deliveries</li>
          <li>Update delivery status</li>
        </ul>
      </section>
    </main>
  );
}