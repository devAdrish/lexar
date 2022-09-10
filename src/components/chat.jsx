import React, { useCallback, useEffect, useState } from "react";
import { api } from "services/api";

const Chat = ({ socket, chatWith, email, token, onCloseChat }) => {
  const [message, setMessage] = useState("");
  const [allMsgs, setAllMsgs] = useState([]);

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
      if (data.status === "success") {
        getUserChat();
      }
    });
  }, [getUserChat, email, chatWith, socket]);

  useEffect(() => {
    socket.off("message").on("message", async (message) => {
      updateMessages(message);
    });
  }, [updateMessages, email, socket]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      setAllMsgs((msgs) => [...msgs, { from: email, to: chatWith, message }]);
      socket.emit(
        "sendMessage",
        { from: email, to: chatWith, message },
        (payload) => (payload.status === "error" ? alert(payload.text) : null)
      );
    }
    setMessage("");
  };

  return (
    <div className="relative">
      <div className="flex justify-end">
        <button
          onClick={onCloseChat}
          className="bg-gray-200 -mb-[1px] block px-3 py-1"
        >
          x
        </button>
      </div>
      <div className="h-[78vh] w-[78vw] border border-grey-400 overflow-y-scroll relative">
        {allMsgs.map((e) => {
          return (
            <div
              className={`flex my-1 text-base ${
                e.from === email ? "justify-end" : "justify-start"
              }`}
              key={e._id}
            >
              <span
                className={`text-black rounded flex items-end p-1 ${
                  e.from === email ? "bg-green-300 mr-4" : "bg-blue-300 ml-4"
                }`}
              >
                {e.message} <span className="text-[10px] ml-3 text-gray-700"> { Date(e.time).toString().substring(0,10)} </span> 
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center">
        <input
          className="flex flex-grow border-2 my-2 mr-4 border-blue-500 rounded p-2"
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
