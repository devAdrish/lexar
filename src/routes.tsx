import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "utils/functions";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useAuth();
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  if(!isStandalone) return <Navigate to="/home" />
  return isLoggedIn ? children : <Navigate to="/login" />;
};
const ProtectedLoginSignUp = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useAuth();
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  if(!isStandalone) return <Navigate to="/home" />
  return !isLoggedIn ? children : <Navigate to="/" />;
};

export { ProtectedRoute, ProtectedLoginSignUp };
