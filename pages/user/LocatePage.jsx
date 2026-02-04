import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/UserNavbar";

export default function LocatePage() {
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("Detecting your location…");
  const [error, setError] = useState(null);

  useEffect(() => {
    detectLocation();
  }, []);

  function detectLocation() {
    setStatus("Detecting your location…");
    setError(null);
    setLocation(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
        setStatus("Using your current location");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location permission denied. Please allow access.");
        } else if (err.code === err.TIMEOUT) {
          setError("Location request timed out. Please try again.");
        } else {
          setError("Unable to detect your location.");
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 25000,
        maximumAge: 30000
      }
    );
  }

  function orderFuel(type) {
    navigate("/main/user/order", {
      state: { fuel: type, location }
    });
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <UserNavbar />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "70px"
        }}
      >
        <div
          style={{
            width: "420px",
            background: "rgba(20,30,30,0.75)",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "28px",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.45)"
          }}
        >
          {/* Location Icon */}
          <div
            style={{
              fontSize: "42px",
              marginBottom: "14px",
              color: location ? "#3ddc84" : "#ccc"
            }}
          >
            📍
          </div>

          {/* Title */}
          <h2
            style={{
              color: "#e6f7f6",
              fontWeight: 600,
              marginBottom: "6px"
            }}
          >
            Your delivery location
          </h2>

          {/* Status */}
          <p
            style={{
              color: error ? "#ff8a8a" : "#ddd",
              marginTop: "6px"
            }}
          >
            {error ? error : status}
          </p>

          {/* Confirmation */}
          {location && (
            <p
              style={{
                fontSize: "13px",
                color: "#9fbcbc",
                marginBottom: "18px"
              }}
            >
              Location confirmed for delivery
            </p>
          )}

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "18px"
            }}
          >
            <button
              onClick={() => orderFuel("petrol")}
              disabled={!location}
              style={{
                flex: 1,
                height: "44px",
                fontWeight: 600,
                borderRadius: "8px",
                border: "none",
                cursor: location ? "pointer" : "not-allowed",
                background: location ? "#4f7cff" : "#2f3f55",
                color: "#fff"
              }}
            >
              Order Petrol
            </button>

            <button
              onClick={() => orderFuel("diesel")}
              disabled={!location}
              style={{
                flex: 1,
                height: "44px",
                fontWeight: 600,
                borderRadius: "8px",
                border: "none",
                cursor: location ? "pointer" : "not-allowed",
                background: location ? "#f1f1f1" : "#555",
                color: location ? "#111" : "#aaa"
              }}
            >
              Order Diesel
            </button>
          </div>

          {/* Retry */}
          <button
            onClick={detectLocation}
            style={{
              marginTop: "14px",
              background: "none",
              border: "none",
              color: "#6ecbff",
              cursor: "pointer",
              fontSize: "13px"
            }}
          >
            Retry location
          </button>
        </div>
      </div>
    </div>
  );
}
