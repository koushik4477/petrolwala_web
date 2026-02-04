import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

import MainUser from "./pages/MainUser";
import MainBunk from "./pages/MainBunk";
import MainAgent from "./pages/MainAgent";
import RoleProtected from "./components/RoleProtected";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import UserDashboard from "./pages/user/UserDashboard";
import OrderPage from "./pages/user/OrderPage";
import LocatePage from "./pages/user/LocatePage";
import HistoryPage from "./pages/user/HistoryPage";
import AccountPage from "./pages/user/AccountPage";

export default function App() {
  return (
    <AppLayout>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/main/user"
        element={
          <RoleProtected allowedRoles={["user"]}>
            <MainUser />
          </RoleProtected>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="order" element={<OrderPage />} />
        <Route path="locate" element={<LocatePage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="account" element={<AccountPage />} />
      </Route>

      <Route
        path="/main/bunk"
        element={
          <RoleProtected allowedRoles={["bunk"]}>
            <MainBunk />
          </RoleProtected>
        }
      />

      <Route
        path="/main/agent"
        element={
          <RoleProtected allowedRoles={["agent"]}>
            <MainAgent />
          </RoleProtected>
        }
      />

      <Route path="*" element={<div style={{ padding: 20 }}>404</div>} />
    </Routes>
    </AppLayout>
  );
}
