import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { placeOrder, getOrders } from "../../services/orderService";

export default function OrderPage() {
  const [params] = useSearchParams();
  const [fuel, setFuel] = useState(params.get("fuel") || "");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [orders, setOrders] = useState([]);

  const pricePerLitre = fuel === "petrol" ? 105 : fuel === "diesel" ? 95 : 0;
  const totalPrice = quantity ? quantity * pricePerLitre : 0;

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        address: "GPS detected"
      });
    });
  };

  const submitOrder = async () => {
    if (!fuel || !quantity || !location) return;

    setPlacing(true);
    await placeOrder({
      fuel,
      quantity: Number(quantity),
      location
    });
    setQuantity("");
    setPlacing(false);
    loadOrders();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #071b1b 0%, #041212 100%)",
        padding: "120px 16px 40px",
        fontFamily: "system-ui, -apple-system, Segoe UI"
      }}
    >
      {/* ORDER CARD */}
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          background: "#0c1f1f",
          borderRadius: 16,
          padding: 28,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.06)",
          color: "#e6f7f6"
        }}
      >
        <h2 style={{ marginBottom: 6 }}>Order Fuel</h2>
        <p style={{ color: "#9bbcbc", fontSize: 14, marginBottom: 20 }}>
          Fuel will be delivered to your current location
        </p>

        {!fuel && (
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <button onClick={() => setFuel("petrol")} style={fuelBtn}>
              ⛽ Petrol
            </button>
            <button onClick={() => setFuel("diesel")} style={fuelBtn}>
              🛢️ Diesel
            </button>
          </div>
        )}

        {fuel && (
          <>
            <div style={{ fontSize: 14, marginBottom: 12 }}>
              Fuel: <b>{fuel.toUpperCase()}</b>{" "}
              <span
                onClick={() => setFuel("")}
                style={{ color: "#00d4d4", cursor: "pointer", marginLeft: 8 }}
              >
                Change
              </span>
            </div>

            <input
              type="number"
              placeholder="Quantity (litres)"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              style={input}
            />

            <button onClick={detectLocation} style={secondaryBtn}>
              📍 Detect my location
            </button>

            {location && (
              <div style={{ fontSize: 12, color: "#7dd3d3" }}>
                Location saved
              </div>
            )}

            {/* SUMMARY */}
            <div style={summaryBox}>
              <div>Price/Litre: ₹{pricePerLitre}</div>
              <div>Quantity: {quantity || 0} L</div>
              <div style={{ fontWeight: 600 }}>
                Total: ₹{totalPrice}
              </div>
            </div>

            <button
              onClick={submitOrder}
              disabled={placing || !location}
              style={{
                ...primaryBtn,
                opacity: placing || !location ? 0.6 : 1
              }}
            >
              {placing ? "Placing Order..." : "Confirm Order"}
            </button>
          </>
        )}
      </div>

      {/* ORDER HISTORY */}
      <div
        style={{
          maxWidth: 520,
          margin: "40px auto 0",
          color: "#e6f7f6"
        }}
      >
        <h3 style={{ marginBottom: 12 }}>Your Orders</h3>

        {orders.length === 0 && (
          <div style={{ color: "#7aa7a7", fontSize: 14 }}>
            No orders placed yet
          </div>
        )}

        {orders.map(o => (
          <div
            key={o._id}
            style={{
              background: "#0b1a1a",
              padding: 14,
              borderRadius: 10,
              marginBottom: 10,
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ fontSize: 14 }}>
                {o.quantity} L · ₹{o.totalPrice}
              </div>
              <div style={{ fontSize: 12, color: "#8fbcbc" }}>
                Status: {o.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* STYLES */
const fuelBtn = {
  flex: 1,
  padding: 14,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "#0f2a2a",
  color: "#e6f7f6",
  cursor: "pointer",
  fontWeight: 600
};

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "#081616",
  color: "#e6f7f6",
  marginBottom: 12
};

const secondaryBtn = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "#081616",
  color: "#e6f7f6",
  cursor: "pointer",
  marginBottom: 8
};

const summaryBox = {
  marginTop: 16,
  padding: 14,
  borderRadius: 10,
  background: "#081616",
  border: "1px solid rgba(255,255,255,0.1)",
  fontSize: 14
};

const primaryBtn = {
  width: "100%",
  marginTop: 18,
  padding: 14,
  borderRadius: 10,
  border: "none",
  background: "#00b4b4",
  color: "#002222",
  fontWeight: 700,
  cursor: "pointer"
};
