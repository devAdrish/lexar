import useAuth from "hooks/useAuth";
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
