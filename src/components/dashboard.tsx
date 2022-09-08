import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");

  const navigate = useNavigate();
  const startChat = () => {
    if (user1 && user2)
      navigate("/chat", {
        state: { user1: user1.trim(), user2: user2.trim() },
      });
  };

  return (
    <div className="flex flex-col items-center">
      <input
        className="border-2 p-2 mt-8 mb-2 rounded block w-48"
        placeholder="your email"
        value={user1}
        onChange={(e) => {
          setUser1(e.target.value);
        }}
      />
      <input
        className="border-2 p-2 mb-4 rounded  block w-48"
        placeholder="your friend's email"
        value={user2}
        onChange={(e) => {
          setUser2(e.target.value);
        }}
      />

      <button
        className="bg-blue-600 p-2 rounded text-white"
        onClick={startChat}
      >
        Start Chat
      </button>

    </div>
  );
};

export default Dashboard;
