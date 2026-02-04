import { Outlet } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";

export default function MainUser() {
  return (
    <div style={{ padding: 24 }}>
      <UserNavbar />
      <Outlet />
    </div>
  );
}
