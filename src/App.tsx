import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "components/home";
import Login from "components/login";
import SignUp from "components/signup";
import Dashboard from "components/dashboard";
import ProtectedRoute from "routes";
import Layout from "components/layout";
import Spinner from "components/spinner";

function App() {
  return (
    <div className="h-screen w-screen">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
      <div className="grid place-items-center h-screen">
        <Spinner show={true} />
      </div>
    </div>
  );
}

export default App;
