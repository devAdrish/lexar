import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "utils/functions";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};
const ProtectedLoginSignUp = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useAuth();
  return !isLoggedIn ? children : <Navigate to="/chat" />;
};

export { ProtectedRoute, ProtectedLoginSignUp };
