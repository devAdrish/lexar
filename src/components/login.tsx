import { message } from "antd";
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "services/api";
import LoadingIndicator from "./loading-indicator";

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
      navigate("/");
    } catch(er: allAnyTypes) {
      message.error(er?.response?.data?.message ?? 'Some Error Occured!');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <LoadingIndicator show={isLoading} />
      <div className="flex flex-col items-center p-4">
        <input
          className="p-2 border-0 shadow-md md:w-96"
          value={user.email}
          placeholder="Email"
          required
          onChange={(e) => {
            setUser({ ...user, email: e.target.value.trim().toLowerCase() });
          }}
        />
        {user.email && !validateEmail() && (
          <p className="mt-1 mb-3 md:w-96 text-sm text-white bg-red-500 italic rounded-sm p-2">
            Email is not valid.
          </p>
        )}
        <input
          className="p-2 border-0 shadow-md mt-2 md:w-96"
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
          className="p-2 mt-8 md:w-96 bg-blue-500 shadow-md text-white rounded-md disabled:bg-gray-300"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default Login;
