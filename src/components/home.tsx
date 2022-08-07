import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <h1>HOME</h1>
      <div className="flex mt-4">
        <Link to={"/sign-up"}>
          <p className="bg-green-500 text-white rounded-md px-4 py-2">
            Sign Up
          </p>
        </Link>
        <Link to={"/login"}>
          <p className="bg-blue-500 text-white rounded-md px-4 py-2 ml-4">
            Login
          </p>
        </Link>
      </div>
    </>
  );
};

export default Home;
