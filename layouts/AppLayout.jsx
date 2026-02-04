export default function AppLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",            // black page background
        border: "4px solid #000000",      // black border frame
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, #0b1a1a 0%, #040b0b 100%)",
          borderRadius: "8px",
          overflow: "hidden"
        }}
      >
        {children}
      </div>
    </div>
  );
}
