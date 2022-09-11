import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "components/home";
import Login from "components/login";
import SignUp from "components/signup";
import Dashboard from "components/dashboard";
import { ProtectedRoute, ProtectedLoginSignUp } from "routes";
import Layout from "components/layout";
import MainContextProvider from "contexts/MainContext";

function App() {
  return (
    <div className="h-screen w-screen">
      <MainContextProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route
              path="/"
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
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Home />}></Route>
          </Routes>
        </Layout>
      </BrowserRouter>
      </MainContextProvider>
    </div>
  );
}

export default App;
