import React, { useCallback, useEffect, useRef, useState } from "react";
import { api } from "services/api";
import { deepCopy, toMsgTime } from "utils/functions";
import Picker from "emoji-picker-react";
import { BsEmojiLaughingFill } from "react-icons/bs";
import { RiUser6Line } from "react-icons/ri";
import { Spin } from "antd";

const Chat = ({ socket, chatWith, email, token, onCloseChat }) => {
  const [message, setMessage] = useState("");
  const [allMsgs, setAllMsgs] = useState([]);
  const [emojiPicker, showEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(true);

  const chatBottomRef = useRef();

  const getUserChat = useCallback(async () => {
    const chat = await api.get(`/chat/${email}/${chatWith.email}`, token);
    setAllMsgs(chat.data.data.messages);
    setLoading(false);
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
    socket.emit("join", { from: email, to: chatWith.email }, (data) => {
      if (data.status === "success") {
        getUserChat();
      }
    });
  }, [getUserChat, email, chatWith.email, socket]);

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
        {
          _id: Date.now().toString(),
          time: new Date(),
          from: email,
          to: chatWith.email,
          message,
        },
      ]);
      socket.emit(
        "sendMessage",
        { from: email, to: chatWith.email, message },
        ({ status }) => {
          afterMessage(status, {
            _id: Date.now().toString(),
            from: email,
            to: chatWith.email,
            message,
            time: new Date(),
          });
        }
      );
    }
    setMessage("");
  };

  const onEmojiPick = (_, data) => {
    const newMsg = message + " " + data.emoji;
    setMessage(newMsg);
  };

  return (
    <div className="h-[102vh] md:h-[100vh]">
      <div className="pt-6 md:pt-2">
        <div className="flex justify-between items-center p-2 border-b">
          {chatWith.photo ? (
            <img
              src={chatWith.photo}
              alt="profile"
              className="rounded-full w-8 h-8 border"
            />
          ) : (
            <span className="rounded-full w-8 h-8 border flex justify-center items-center bg-gray-100">
              <RiUser6Line className="w-7 h-7" />
            </span>
          )}
          <div className="ml-2 truncate font-medium w-[90%]">
            {chatWith.name}
            <p
              className={`text-[8px] ${
                chatWith.isOnline ? "text-green-500" : "text-gray-500"
              } `}
            >
              {chatWith.isOnline ? "Online" : "Offline"}
            </p>
          </div>
          <button
            onClick={onCloseChat}
            className="bg-gray-200 md:rounded-tr-lg px-3 py-1 md:mr-3"
          >
            x
          </button>
        </div>
        <div className={`overflow-y-scroll h-[80vh]`}>
          {loading ? (
            <div className="w-100 h-[85vh] md:h-[80vh] flex flex-col items-center justify-center">
              <Spin />
            </div>
          ) : null}

          {allMsgs.map((e) => {
            return (
              <div
                className={`flex my-1 text-base ${
                  e.from === email ? "flex-row-reverse" : "flex-row"
                } `}
                key={e._id}
              >
                <div>
                  <div
                    className={`text-black rounded flex flex-col p-1 ${
                      e.from === email ? "items-end" : "items-start"
                    } ${
                      e.from === email
                        ? "bg-green-300 mr-4"
                        : "bg-blue-300 ml-4"
                    } ${e.failed ? "bg-orange-500" : ""}`}
                  >
                    {e.message}
                    <div className="text-[10px] text-gray-700">
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
      </div>

      <div className="border-t px-3 flex justify-between items-center relative">
        <div className="absolute bottom-14 left-2">
          {emojiPicker && (
            <Picker onEmojiClick={onEmojiPick} preload disableAutoFocus />
          )}
        </div>
        <button
          onClick={() => showEmojiPicker(!emojiPicker)}
          className="text-yellow-500 text-lg mr-2"
        >
          <BsEmojiLaughingFill />
        </button>
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
