import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <>
      <p> Hi, User </p>
      <span
        className="mt-5 text-orange-500 cursor-pointer "
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </span>
    </>
  );
};

export default Dashboard;
