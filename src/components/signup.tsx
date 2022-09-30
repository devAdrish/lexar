import { message } from "antd";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "services/api";
import LoadingIndicator from "./loading-indicator";

const SignUp = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = useCallback(() => {
    return String(user.email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }, [user.email]);
  const navigate = useNavigate();

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/register", user);
      const { token } = res.data.data;
      localStorage.setItem("token", token);
      setIsLoading(false);
      navigate("/chat");
      message.success('Sucess')
    } catch (er: allAnyTypes) {
      message.error(er?.response?.data?.message ?? 'Some Error Occured!');
      setIsLoading(false);
    }
  };
  const validatePassword = useCallback(() => {
    return (
      /[a-z]/.test(user.password) &&
      /[0-9]/.test(user.password) &&
      user.password.length > 5
    );
  }, [user.password]);

  const isFormValid = () => {
    if (user.name && user.name.length > 4) {
      if (validateEmail()) {
        if (validatePassword()) {
          return true;
        }
      }
    }
  };

  return (
    <div className="flex justify-center">
      <div className="h-48 w-96 p-4">
        <LoadingIndicator show={isLoading} />
        <input
          className="p-2 border-0 shadow-md w-96"
          value={user.name}
          placeholder="Name"
          required
          onChange={(e) => {
            setUser({ ...user, name: e.target.value });
          }}
        />
        {user.name && user.name.length < 5 && (
          <p className="mt-1 mb-3 w-96 text-sm text-white bg-red-500 italic rounded-sm p-2">
            Name must be atleast 5 characters long.
          </p>
        )}

        <input
          className="p-2 border-0 shadow-md mt-2 w-96"
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
        {user.password && !validatePassword() && (
          <p className="mt-1 mb-3 w-96 text-sm text-white bg-red-500 italic rounded-sm p-2">
            Password must contain atleast 1 Alphabet, 1 Number and must be
            atleast 6 characters.
          </p>
        )}
        <button
          onClick={onSubmit}
          type="submit"
          disabled={!isFormValid()}
          className="p-2 mt-8 w-96 bg-blue-500 shadow-md text-white rounded-md disabled:bg-gray-300"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default SignUp;
