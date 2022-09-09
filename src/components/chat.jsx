import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "services/api";
import io from "socket.io-client";

const ENDPOINT = process.env.REACT_APP_BASE_URL || "";
let socket;

const Chat = () => {
  const { state } = useLocation();
  const { chatWith, email, token } = state;


  const [message, setMessage] = useState("");
  const [allMsgs, setAllMsgs] = useState([]);

  socket = io(ENDPOINT);

  const getUserChat = useCallback(async () => {
    const chat = await api.get(`/chat/${email}/${chatWith}`, token);
    setAllMsgs(chat.data.data.messages);
  }, [email, chatWith, token]);

  const updateMessages = useCallback(
    (msg) => {
      if (msg.from !== email) setAllMsgs((msgs) => [...msgs, msg]);
    },
    [email]
  );

  useEffect(() => {
    socket.emit("join", { from: email, to: chatWith }, (data) => {
      console.log(data);

      if (data.status === "success") {
        getUserChat();
      }
    });
  }, [getUserChat, email, chatWith]);

  useEffect(() => {
    socket.off("message").on("message", async (message) => {
      updateMessages(message);
    });

    socket.on("publicMessage", (message) => {
      console.log("Public Message", message);
    });

    socket.on("statusUpdate", (status) => {
      console.log("Status Update", status);
    });
    return () => {
      socket.emit("disconnection", { user: email });
      socket.removeAllListeners();
    };
  }, [updateMessages, email]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      setAllMsgs((msgs) => [...msgs, { from: email, to: chatWith, message }]);
      socket.emit("sendMessage", { from: email, to: chatWith, message }, (payload) =>
         (payload.status === 'error') ? alert(payload.text): null
      );
    }
    setMessage("");
  };

  return (
    <div>
      <h2 className="mt-2 text-lg">
        Hi, <span className="uppercase">{email.split("@")[0]}</span>
      </h2>
      <p className="mb-4 text-sm text-blue-500">
        Chatting with <span className="uppercase">{chatWith.split("@")[0]}</span>
      </p>
      <div className="h-[400px] w-[400px] border-4 border-grey-400 overflow-y-scroll">
        {allMsgs.map((e) => {
          return (
            <div
              className={`flex my-1 ${
                e.from === email ? "justify-end" : "justify-start"
              }`}
              key={e._id}
            >
              <span
                className={`text-black rounded w-32 p-1 ${
                  e.from === email ? "bg-green-200 mr-4" : "bg-blue-300 ml-4"
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
