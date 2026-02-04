import { useEffect, useState } from "react";
import UserNavbar from "../../components/UserNavbar";
import api from "../../services/api";

export default function AccountPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("/api/profile")
      .then(res => {
        const { name, username, phone } = res.data;
        setForm({
          name: name || "",
          email: username || "",
          phone: phone || ""
        });
      })
      .catch(() => setStatus("Failed to load profile"));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      setStatus("Saving...");
      await api.put("/api/profile", {
        name: form.name,
        email: form.email,
        phone: form.phone
      });
      setStatus("Profile updated successfully");
    } catch (err) {
      setStatus(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="user-page">
      <UserNavbar />
      <h2>My Account</h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />

      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Mobile Number"
      />

      <button onClick={saveProfile}>Save Changes</button>

      {status && <p>{status}</p>}
    </div>
  );
}
