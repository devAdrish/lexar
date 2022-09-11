import React, { useCallback, useContext, useEffect, useState } from "react";
import { api } from "services/api";
import { deepCopy, useAuth } from "utils/functions";
import { MainContext } from "contexts/MainContext";
import { Modal } from "antd";
import LoadingIndicator from "./loading-indicator";
import Chat from "./chat";
import io, { Socket } from "socket.io-client";

let socket: Socket;

const Dashboard = () => {
  const {  raiseToast } = useContext(MainContext);
  const { userData, token } = useAuth();
  const [friendsList, setFriendsList] = useState<FriendInfo[]>([]);
  const [chatWith, setChatWith] = useState("");
  const [chatVisible, setChatVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [friend, setFriend] = useState("");

  useEffect(() => {
    if (userData.email) {
      const ENDPOINT = process.env.REACT_APP_BASE_URL!;
      socket = io(ENDPOINT, { query: { email: userData.email } });
    }
  }, [userData.email]);

  const getFriendsList = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await api.get("/getFriendsInfo", token);
      setFriendsList(result.data.data);
      setIsLoading(false);
    } catch (er: allAnyTypes) {
      setIsLoading(false);
      raiseToast({ message: er?.response?.data?.message, type: "error" });
    }
  }, [raiseToast, token]);

  useEffect(() => {
    getFriendsList();
  }, [getFriendsList]);

  const updateFriendsStatus = useCallback(
    (payload: any) => {
      const { user, isOnline } = payload;
      const friend = friendsList.find((f) => f.email === user);
      if (friend) {
        friend.isOnline = isOnline;
        const index = friendsList.indexOf(friend);
        const list = deepCopy(friendsList);
        list.splice(index, 1, friend);
        setFriendsList(list);
      }
    },
    [friendsList]
  );

  useEffect(() => {
    socket.off("userOnlineStatusUpdate")
      .on("userOnlineStatusUpdate", updateFriendsStatus);
  }, [updateFriendsStatus]);

  const showChat = (e: FriendInfo) => {
    setChatWith(e.email);
    setChatVisible(true);
  };

  const closeChat = () => {
    setChatVisible(false);
    setChatWith("");
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFriend("");
  };

  const addFriend = async () => {
    try {
      if (!friend) return;
      setIsLoading(true);
      const res = await api.get(`/addFriend/${friend}`, token!);
      const { status, data } = res.data;
      if (status === "Ok") {
        setFriendsList(data);
        closeModal();
      }
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-between w-screen p-2">
      <LoadingIndicator show={isLoading} />
      <Modal
        visible={showModal}
        destroyOnClose
        onCancel={closeModal}
        footer={null}
        title="Search Friend"
      >
        <div className="flex">
          <input
            placeholder="Your Friend's Email"
            type="text"
            onChange={(e) => setFriend(e.target.value)}
            value={friend}
            className="border p-2 flex flex-grow"
          />
          <button
            onClick={addFriend}
            className="ml-2 bg-green-600 text-white px-6 py-1"
          >
            Add
          </button>
        </div>
      </Modal>

      <div className="h-[90vh] w-[30vw] overflow-y-scroll border border-grey-700 rounded-md p-2">
        <button
          className="bg-green-600 p-2 w-[90%] mx-[5%] text-center rounded text-white mb-4"
          onClick={openModal}
        >
          Add Friend
        </button>
        {friendsList.map((f: FriendInfo) => {
          return (
            <div
              className={`border rounded-md p-2 flex justify-between cursor-pointer my-1 ${
                f.email === chatWith ? "bg-blue-300" : ""
              }`}
              key={f.email}
              onClick={() => showChat(f)}
            >
              <div className="truncate w-[70%]">{f.name}</div>
              {f.isOnline ? (
                <span className="text-green-600 italic"> Online </span>
              ) : (
                <span className="text-gray-400 italic"> Offline </span>
              )}
            </div>
          );
        })}
      </div>

      {chatVisible && socket && (
        <Chat
          chatWith={chatWith}
          email={userData.email}
          token={token}
          socket={socket}
          onCloseChat={closeChat}
        />
      )}
    </div>
  );
};

export default Dashboard;
