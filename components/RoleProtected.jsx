import React from "react";
import { Navigate } from "react-router-dom";

// allowedRoles: array like ['user'] or ['bunk']
export default function RoleProtected({ children, allowedRoles = [] }){
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  // decode token payload quickly (no verification) to read role
  function parsePayload(tok){
    try {
      const b64 = tok.split('.')[1];
      return JSON.parse(atob(b64));
    } catch (e) { return null; }
  }

  const payload = parsePayload(token);
  const role = payload?.role;

  if (!role || !allowedRoles.includes(role)){
    return <Navigate to="/login" replace />; // or show unauthorized page
  }

  return children;
}
