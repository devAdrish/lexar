import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


interface User {
  name: string, email: string, photo: string
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
      <p> Hi, {user!.email} </p>
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
