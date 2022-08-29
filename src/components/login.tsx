import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "services/api";
import Spinner from "./spinner";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = useCallback(() => {
    return String(user.email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }, [user.email]);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/login", user);
      const { token } = res.data.data;
      localStorage.setItem("token", token);
      setIsLoading(false);
      navigate("/dashboard");
    } catch {
      setIsLoading(false);
    }

  };

  return (
    <div className="h-48 w-96 p-4">
      <Spinner show={ isLoading }></Spinner>
      <Link to={"/"}>
        <span className="py-8">{"<- Back"} </span>
      </Link>
      <input
        className="p-2 border-0 shadow-md w-96"
        value={user.email}
        placeholder="Email"
        required
        onChange={(e) => {
          setUser({ ...user, email: e.target.value });
        }}
      />
      {user.email && !validateEmail() && (
        <p className="mt-1 mb-3 w-96 text-sm text-white bg-red-500 italic rounded-sm p-2">
          Email is not valid.
        </p>
      )}
      <input
        className="p-2 border-0 shadow-md mt-2 w-96"
        value={user.password}
        placeholder="Password"
        type="password"
        required
        onChange={(e) => {
          setUser({ ...user, password: e.target.value });
        }}
      />
      <button
        onClick={handleLogin}
        type="submit"
        disabled={!validateEmail() || user.password.length < 6}
        className="p-2 mt-8 w-96 bg-blue-500 shadow-md text-white rounded-md disabled:bg-gray-300"
      >
        Log In
      </button>
    </div>
  );
};

export default Login;
