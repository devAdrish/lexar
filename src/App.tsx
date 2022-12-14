import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "components/home";
import Login from "components/login";
import SignUp from "components/signup";
import Dashboard from "components/dashboard";
import { ProtectedRoute, ProtectedLoginSignUp } from "routes";
import Layout from "components/layout";

function App() {
  return (
    <div className="h-screen w-screen">
      <BrowserRouter>
        <Layout>
          <Routes>
          <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedLoginSignUp>
                  <Login />
                </ProtectedLoginSignUp>
              }
            />
            <Route
              path="/sign-up"
              element={
                <ProtectedLoginSignUp>
                  <SignUp />
                </ProtectedLoginSignUp>
              }
            />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
