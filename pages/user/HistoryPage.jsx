import { useEffect, useMemo, useState } from "react";
import { getOrders } from "../../services/orderService";

/* -------------------------
   Runtime safety helpers
   ------------------------- */
const safeUpper = (v) =>
  typeof v === "string" ? v.toUpperCase() : "N/A";

/* -------------------------
   Status badge styles
   ------------------------- */
const statusStyle = (status) => {
  switch (status) {
    case "placed":
      return { bg: "#1e3a5f", color: "#93c5fd" };
    case "confirmed":
      return { bg: "#1f3f2b", color: "#86efac" };
    case "delivered":
      return { bg: "#2a1f3f", color: "#d8b4fe" };
    default:
      return { bg: "#1f2937", color: "#9ca3af" };
  }
};

export default function HistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  /* -------------------------
     Fetch orders
     ------------------------- */
  useEffect(() => {
    getOrders()
      .then((data) => setOrders(data || []))
      .finally(() => setLoading(false));
  }, []);

  /* -------------------------
     Real-time status simulation
     ------------------------- */
  useEffect(() => {
    if (!orders.length) return;

    const interval = setInterval(() => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.status === "placed") return { ...o, status: "confirmed" };
          if (o.status === "confirmed") return { ...o, status: "delivered" };
          return o;
        })
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [orders.length]);

  /* -------------------------
     Sorting logic
     ------------------------- */
  const sortedOrders = useMemo(() => {
    const arr = [...orders];
    if (sortBy === "oldest") {
      arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "status") {
      arr.sort((a, b) => a.status.localeCompare(b.status));
    } else {
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return arr;
  }, [orders, sortBy]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #071b1b 0%, #041212 100%)",
        padding: "120px 16px 40px",
        fontFamily: "system-ui, -apple-system, Segoe UI",
        color: "#e6f7f6"
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <h2 style={{ marginBottom: 6 }}>Order History</h2>
        <p style={{ color: "#9bbcbc", fontSize: 14, marginBottom: 20 }}>
          View all your fuel orders
        </p>

        {/* SORT */}
        <div style={{ marginBottom: 16 }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              background: "#081616",
              color: "#e6f7f6",
              border: "1px solid rgba(255,255,255,0.15)"
            }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="status">Sort by status</option>
          </select>
        </div>

        {/* LOADING */}
        {loading && (
          <div style={{ color: "#7aa7a7" }}>Loading orders...</div>
        )}

        {/* EMPTY */}
        {!loading && sortedOrders.length === 0 && (
          <div style={{ color: "#7aa7a7" }}>
            No orders placed yet.
          </div>
        )}

        {/* LIST */}
        {!loading &&
          sortedOrders.map((o) => {
            const badge = statusStyle(o.status);

            return (
              <div
                key={o._id}
                style={{
                  background: "#0b1a1a",
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 12,
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {safeUpper(o.fuelType)}
                  </div>
                  <div style={{ fontSize: 14, color: "#9bbcbc" }}>
                    {o.quantity} L · ₹{o.totalPrice}
                  </div>
                  <div style={{ fontSize: 12, color: "#6fa5a5" }}>
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                </div>

                <div
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    background: badge.bg,
                    color: badge.color,
                    textTransform: "uppercase"
                  }}
                >
                  {o.status}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
