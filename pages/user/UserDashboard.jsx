import { useNavigate } from "react-router-dom";
import LightRays from "../../components/LightRays";
import TrueFocus from "../../components/TrueFocus";
import FuelPriceTicker from "../../components/FuelPriceTicker";

export default function UserDashboard() {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        background: "linear-gradient(180deg, #041616, #071b1b)",
        overflowX: "hidden",
        overflowY: "hidden"
      }}
    >
      {/* LIGHT RAYS (BACKGROUND ONLY) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none"
        }}
      >
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={0.4}          // toned down
          lightSpread={1.2}
          rayLength={0.9}
          followMouse={false}
          noiseAmount={0.03}
          distortion={0.01}
        />
      </div>

      {/* CONTENT LAYER */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          paddingTop: "80px" // navbar height
        }}
      >
        {/* 🔥 FUEL PRICE TICKER */}
        <FuelPriceTicker />

        {/* MAIN CARD SECTION */}
        <div
          style={{
            minHeight: "calc(100vh - 140px)",
            display: "flex",
            justifyContent: "center",
            alignItems: isMobile ? "flex-start" : "center",
            padding: "40px 16px"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: isMobile ? "92%" : "720px",
              background: "rgba(10, 26, 26, 0.85)", // less glassy
              padding: isMobile ? "36px 28px" : "56px 56px",
              borderRadius: "20px",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.6)"
            }}
          >
            {/* TITLE */}
            <h2
              style={{
                fontSize: isMobile ? "26px" : "34px",
                marginBottom: "12px",
                color: "#ffffff"
              }}
            >
              <TrueFocus
                sentence="Welcome to PetrolWala"
                manualMode={false}
                blurAmount={4}
                borderColor="transparent"
                animationDuration={1.6}
                pauseBetweenAnimations={1}
              />
            </h2>

            <p
              style={{
                color: "#cfeeee",
                fontSize: "15px",
                marginBottom: "36px"
              }}
            >
              Order fuel delivered to your location
            </p>

            {/* ACTIONS */}
            <button
              onClick={() => navigate("/main/user/order?fuel=petrol")}
              style={{
                width: "100%",
                padding: "15px",
                marginBottom: "16px",
                fontSize: "16px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                background: "#00b4b4",
                color: "#002222",
                fontWeight: 700
              }}
            >
              ⛽ Order Petrol
            </button>

            <button
              onClick={() => navigate("/main/user/order?fuel=diesel")}
              style={{
                width: "100%",
                padding: "15px",
                fontSize: "16px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                background: "#e3a008",
                color: "#2a1a00",
                fontWeight: 700
              }}
            >
              🛢️ Order Diesel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
