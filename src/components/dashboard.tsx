import React, { useCallback, useEffect, useRef, useState } from "react";
import { api } from "services/api";
import { deepCopy, useAuth } from "utils/functions";
import { message, Modal } from "antd";
import LoadingIndicator from "./loading-indicator";
import Chat from "./chat";
import io, { Socket } from "socket.io-client";
import ActionSheet, { ActionSheetRef } from "actionsheet-react";

let socket: Socket;

const Dashboard = () => {
  const { userData, token } = useAuth();
  const [friendsList, setFriendsList] = useState<FriendInfo[]>([]);
  const [chatWith, setChatWith] = useState("");
  const [chatVisible, setChatVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [friend, setFriend] = useState("");

  const ref = useRef<ActionSheetRef>();

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
      message.error(er?.response?.data?.message ?? "Some Error Occurred");
    }
  }, [token]);

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
    socket
      .off("userOnlineStatusUpdate")
      .on("userOnlineStatusUpdate", updateFriendsStatus);
  }, [updateFriendsStatus]);

  const showChat = (e: FriendInfo) => {
    setChatWith(e.email);
    setChatVisible(true);
    ref?.current?.open();
  };

  const closeChat = () => {
    setChatVisible(false);
    setChatWith("");
    ref?.current?.close();
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
      await api.get(`/addFriend/${friend}`, token!);
      await getFriendsList();
      setIsLoading(false);
    } catch (er: any) {
      setIsLoading(false);
      message.error(er?.response?.data?.message ?? "Some Error Occurred");
    }
  };

  return (
    <div className="flex justify-center pt-2 w-screen">
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

      <div className="h-[90vh] w-screen md:w-[600px] overflow-y-scroll md:border md:border-grey-700 md:rounded-md p-2">
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

      <ActionSheet ref={ref}
      sheetTransition='transform 0.3s ease-in-out' 
      touchEnable 
      mouseEnable
      onClose={closeChat}>
      {chatVisible && socket && (
        <Chat
          chatWith={chatWith}
          email={userData.email}
          token={token}
          socket={socket}
          onCloseChat={closeChat}
        />
      )}
      </ActionSheet>
    </div>
  );
};

export default Dashboard;
