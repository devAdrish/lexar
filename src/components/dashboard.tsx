import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "./spinner";

interface User {
  name?: string;
  email?: string;
  photo?: string;
  contact?: string;
  address?: string;
  age?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [editableText, setEditableText] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getUserInfo = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const res = await axios.get("https://lexar-api.vercel.app/getUserInfo", {
      headers: {
        "x-access-token": token!,
      },
    });

    setUser(res.data.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getUserInfo();
  }, []);
  const handleInput = () => {
    setEditableText(true);
  };
  const submitInputFields = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    await axios.post(`https://lexar-api.vercel.app/updateUserInfo`, {
      ...user,
      token,
    });
    setEditableText(false);
    setIsLoading(false);
  };

  return (
    <div className="grid grid-rows-2 gap-4 content-between">
      <div>
        {" "}
        <h1>Profile Details</h1>
        Hi, {user?.name}
        <br />
        <h2>Contact</h2>
        <input
          disabled={!editableText}
          value={user?.contact || ""}
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Contact"
          onChange={(e) => setUser({ ...user, contact: e.target.value })}
        />
        <h2>Age </h2>
        <input
          disabled={!editableText}
          value={user?.age || ""}
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="age"
          id="age"
          onChange={(e) => setUser({ ...user, age: e.target.value })}
        />
        <h2>Address </h2>
        <input
          disabled={!editableText}
          value={user?.address || ""}
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="address"
          id="address"
          onChange={(e) => setUser({ ...user, address: e.target.value })}
        />
      </div>
      <div className=" grid place-items-center grid-cols-3 gap-1">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-20 h-20 "
          onClick={handleInput}
        >
          Edit
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-20 h-20"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-20 h-20"
          onClick={submitInputFields}
        >
          Submit
        </button>
      </div>
      <Spinner show={isLoading}></Spinner>
    </div>
  );
};

export default Dashboard;
