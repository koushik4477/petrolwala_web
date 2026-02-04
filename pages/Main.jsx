import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export default function Main() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API}/profile`, {
          headers: { Authorization: "Bearer " + token },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {user?.username}</h1>
      <p>Account created on: {new Date(user?.createdAt).toLocaleString()}</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
