import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "utils/functions";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex justify-between border-b border-grey-700">
      <span
        className="px-4 py-2 m-1 mr-2"
        // onClick={() => {
        //   navigate("/");
        // }}
      >
        Lexar
      </span>
      <span>
        {isLoggedIn ? (
          <>
            <button
              className="hover:bg-black hover:text-white transition-all duration-500 rounded-md px-4 py-2 m-1 m-1"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Chat
            </button>
            <button
              className="hover:bg-orange-500 hover:text-white transition-all duration-500 rounded-md px-4 py-2 m-1 mr-2"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="hover:bg-green-500 hover:text-white transition-all duration-500 rounded-md px-4 py-2 m-1"
              onClick={() => {
                navigate("/sign-up");
              }}
            >
              Sign Up
            </button>
            <button
              className="hover:bg-blue-500 hover:text-white transition-all duration-500 rounded-md px-4 py-2 m-1 mr-2"
              onClick={() => {
                navigate("/");
              }}
            >
              Login
            </button>
          </>
        )}
      </span>
    </div>
  );
};
export default Navbar;
