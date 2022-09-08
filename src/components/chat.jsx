import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "services/api";
import io from "socket.io-client";

const ENDPOINT = process.env.REACT_APP_BASE_URL || "";
let socket;

const Chat = () => {
  const { state } = useLocation();
  const { user1, user2 } = state;

  const [message, setMessage] = useState("");
  const [allMsgs, setAllMsgs] = useState([]);

  socket = io(ENDPOINT);

  const getUserChat = useCallback(async () => {
    const token = localStorage.getItem('token');
    const chat = await api.get(`/chat/${user1}/${user2}`, token);
    setAllMsgs(chat.data.data.messages);
  }, [user1, user2]);

  useEffect(() => {
    socket.emit("join", { from: user1, to: user2 }, (data) => {
      console.log(data);

      if (data.status === "success") {
        getUserChat();
      }
    });
  }, [getUserChat, user1, user2]);

  useEffect(() => {
    socket.off('message').on("message", async (message) => {
      setAllMsgs(msgs => [...msgs, message])
    });

    socket.on("publicMessage", (message) => {
      console.log("Public Message", message);
    });

    socket.on("statusUpdate", (status) => {
      console.log("Status Update", status);
    });

  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", { from: user1, to: user2, message }, (e) =>
        alert(e)
      );
    }
    setMessage("");
  };

  return (
    <div>
      <h2 className="mt-2 text-lg">
        Hi, <span className="uppercase">{user1.split("@")[0]}</span>
      </h2>
      <p className="mb-4 text-sm text-blue-500">
        Chatting with <span className="uppercase">{user2.split("@")[0]}</span>
      </p>
      <div className="h-[400px] w-[400px] border-4 border-grey-400 overflow-y-scroll">
        {allMsgs.map((e) => {
          return (
            <div
              className={`flex my-1 ${
                e.from === user1 ? "justify-end" : "justify-start"
              }`}
              key={e._id}
            >
              <span
                className={`text-black rounded w-32 p-1 ${
                  e.from === user1 ? "bg-green-200 mr-4" : "bg-blue-300 ml-4"
                }`}
              >
                {e.message}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex w-[400px] justify-between items-center">
        <input
          className="border-2 my-2 border-blue-500 rounded p-2"
          placeholder="Message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.nativeEvent.key === "Enter") sendMessage(e);
          }}
        />
        <button
          className="bg-green-500 px-4 py-1 rounded-sm"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
