import React, { useCallback, useEffect, useRef, useState } from "react";
import { api } from "services/api";
import { deepCopy, toMsgTime } from "utils/functions";

const Chat = ({ socket, chatWith, email, token, onCloseChat }) => {
  const [message, setMessage] = useState("");
  const [allMsgs, setAllMsgs] = useState([]);

  const chatBottomRef = useRef();

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
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMsgs]);

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

  const afterMessage = (status, failedMsg) => {
    if (status !== "error") return;
    const copy = deepCopy(allMsgs);
    copy.splice(copy.length - 1, 1, { ...failedMsg, failed: true });
    setAllMsgs(copy);
  };

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      setAllMsgs((msgs) => [
        ...msgs,
        { _id: new Date(), from: email, to: chatWith, message },
      ]);
      socket.emit(
        "sendMessage",
        { from: email, to: chatWith, message },
        ({ status }) => {
          afterMessage(status, {
            _id: Date.now().toString(),
            from: email,
            to: chatWith,
            message,
          });
        }
      );
    }
    setMessage("");
  };

  return (
    <div>
      <div className="h-[78vh] w-[68vw] pt-8 rounded-md border border-grey-400 overflow-y-scroll relative">
        <button
          onClick={onCloseChat}
          className="absolute top-0 right-0 bg-gray-200 rounded-bl px-3 py-1"
        >
          x
        </button>
        {allMsgs.map((e) => {
          return (
            <div
              className={`flex my-1 text-base ${
                e.from === email ? "flex-row-reverse" : "flex-row"
              }`}
              key={e._id}
            >
              <div>
                <div
                  className={`text-black rounded flex flex-col p-1 ${
                    e.from === email ? "items-end" : "items-start"
                  } ${
                    e.from === email ? "bg-green-300 mr-4" : "bg-blue-300 ml-4"
                  } ${e.failed ? "bg-orange-500" : ""}`}
                >
                  {e.message}
                  <div className="text-[10px] text-gray-700">
                    {/* {toMsgTime(Date().toString())} */}
                    {toMsgTime(e.time)}
                  </div>
                </div>

                {e.failed && (
                  <div className="text-[10px] text-red-500">
                    Couldn't Send Message
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <p className="h-[5px]" ref={chatBottomRef}></p>
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
