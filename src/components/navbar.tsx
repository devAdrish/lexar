import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const result = useAuth();

  return (
    <div className=" content-end border-b-2 flex justify-end mb-2">
      {!result && (
        <>
          <button
            className="bg-green-500 text-white rounded-md px-4 py-2 m-1"
            onClick={() => {
              navigate("/sign-up");
            }}
          >
            Sign Up
          </button>
          <button
            className="bg-blue-500 text-white rounded-md px-4 py-2 m-1 mr-2"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
        </>
      )}
    </div>
  );
};
export default Navbar;
