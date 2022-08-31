import { Result } from "antd";
import React, { useEffect, useState, FC } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
  photo: string;
  contact: string;
  address: string;
  age: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();

  const getUserInfo = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("https://lexar-api.vercel.app/getUserInfo", {
      headers: {
        "x-access-token": token!,
      },
    });
    const result = await res.json();
    setUser(result.data);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div>
      <p>
        {" "}
        <h1>Profile Details</h1>
        Hi, {user?.name}
        <h2>Email</h2> {user?.email}
        <h2>Contact </h2> {user?.contact}
        <h2>Age </h2>
        {user?.age}
        <h2>Address </h2>
        {user?.address}
        <h2>Photo </h2>
        <div className="relative w-12 h-12">
          <img
            className="rounded-full border border-gray-100 shadow-sm"
            src={user?.photo}
            alt="retailo"
          />
        </div>
      </p>
      <span
        className="mt-5 text-orange-500 cursor-pointer "
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </span>
    </div>
  );
};

export default Dashboard;
