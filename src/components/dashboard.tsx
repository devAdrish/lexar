import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "utils/functions";

const Dashboard = () => {
  const [chatWith, setChatWith] = useState("");
  const { userData, token } = useAuth();

  const navigate = useNavigate();
  const startChat = () => {
    if (chatWith)
      navigate("/chat", {
        state: { chatWith: chatWith.trim(), email: userData.email, token },
      });
  };

  return (
    <div className="flex flex-col items-center">
      <input
        className="border-2 p-2 mb-4 rounded  block w-48"
        placeholder="chat with"
        value={chatWith}
        onChange={(e) => {
          setChatWith(e.target.value);
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
