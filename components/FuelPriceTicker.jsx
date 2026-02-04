export default function FuelPriceTicker() {
  const prices = [
    "Petrol ₹105/L",
    "Diesel ₹95/L",
    "Petrol ₹105/L",
    "Diesel ₹95/L",
     "Petrol ₹105/L",
    "Diesel ₹95/L",
    "Petrol ₹105/L",
    "Diesel ₹95/L",
     "Petrol ₹105/L",
    "Diesel ₹95/L",
    "Petrol ₹105/L",
    "Diesel ₹95/L",
     "Petrol ₹105/L",
    "Diesel ₹95/L",
    "Petrol ₹105/L",
    "Diesel ₹95/L",
     "Petrol ₹105/L",
    "Diesel ₹95/L",
    "Petrol ₹105/L",
    "Diesel ₹95/L",
     "Petrol ₹105/L",
    "Diesel ₹95/L",
    "Petrol ₹105/L",
    "Diesel ₹95/L"
  ];

  const Item = ({ text }) => (
    <div
      style={{
        marginRight: 40,
        fontSize: 14,
        fontWeight: 600,
        color: "#e6f7f6",
        whiteSpace: "nowrap"
      }}
    >
      {text}
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        background: "linear-gradient(180deg, #071b1b, #041616)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        height: 42,
        display: "flex",
        alignItems: "center"
      }}
    >
      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: "ticker-scroll 18s linear infinite"
        }}
      >
        {/* FIRST TRACK */}
        <div style={{ display: "flex" }}>
          {prices.map((p, i) => (
            <Item key={`a-${i}`} text={p} />
          ))}
        </div>

        {/* SECOND TRACK (duplicate for seamless loop) */}
        <div style={{ display: "flex" }}>
          {prices.map((p, i) => (
            <Item key={`b-${i}`} text={p} />
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes ticker-scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
        `}
      </style>
    </div>
  );
}
