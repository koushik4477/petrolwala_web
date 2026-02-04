import { NavLink, useNavigate } from "react-router-dom";

export default function UserNavbar() {
  const navigate = useNavigate();

  const baseLink = {
    textDecoration: "none",
    color: "#bff7f7",
    padding: "8px 14px",
    borderRadius: "8px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "6px"
  };

  const activeLink = {
    color: "#00ffff",
    background: "rgba(0,255,255,0.15)"
  };

  return (
    <nav
      style={{
        /* 🔥 FIXED NAVBAR */
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100vw",

        background: "rgba(4,22,22,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0,255,255,0.15)",
        padding: "14px 32px",
        boxSizing: "border-box",
        zIndex: 100
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%"
        }}
      >
        {/* LEFT BRAND */}
        <div
          style={{
            color: "#00ffff",
            fontWeight: "bold",
            letterSpacing: "0.5px"
          }}
        >
          ⛽ PetrolWala
        </div>

        {/* RIGHT MENU */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <NavLink
            to="/main/user"
            end
            style={({ isActive }) =>
              isActive ? { ...baseLink, ...activeLink } : baseLink
            }
          >
            🏠 Home
          </NavLink>

          <NavLink
            to="/main/user/order"
            style={({ isActive }) =>
              isActive ? { ...baseLink, ...activeLink } : baseLink
            }
          >
            ⛽ Order
          </NavLink>

          <NavLink
            to="/main/user/locate"
            style={({ isActive }) =>
              isActive ? { ...baseLink, ...activeLink } : baseLink
            }
          >
            📍 Locate
          </NavLink>

          <NavLink
            to="/main/user/history"
            style={({ isActive }) =>
              isActive ? { ...baseLink, ...activeLink } : baseLink
            }
          >
            📜 History
          </NavLink>

          <NavLink
            to="/main/user/account"
            style={({ isActive }) =>
              isActive ? { ...baseLink, ...activeLink } : baseLink
            }
          >
            👤 Account
          </NavLink>

          <button
            onClick={() => navigate("/login")}
            style={{
              marginLeft: "14px",
              padding: "8px 14px",
              borderRadius: "8px",
              background: "rgba(255,80,80,0.15)",
              color: "#ff8080",
              border: "1px solid rgba(255,80,80,0.35)",
              cursor: "pointer"
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
