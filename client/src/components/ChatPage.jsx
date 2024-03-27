import { useContext, useEffect, useRef, useState } from "react";
import ChatItem from "./ChatItem";
import Conversation from "./Conversation";

import "./components.css";
import { AppContext } from "../context/AppContex";
import useAxiosWrapper from "../hooks/useAxiosWrapper";
import { AiOutlineLogout } from "react-icons/ai";

import GroupCreatePopUp from "./addGroupPopUp.jsx";
import AddMemberPopUp from "./addContactPopUp";
const api_data = [];

export default function ChatPage() {
  const [chats, setChats] = useState(new Map());
  const [selectedChat, setSelectedChat] = useState(null);
  const {
    appState: { userId },
    dispatch,
  } = useContext(AppContext);
  const [isGroupPopUpOpen, setIsGroupPopUpOpen] = useState(false);
  const [isCreateMemeberPopUpOpen, setCreateMemberPopUpOpen] = useState(false);
  const { data: api_data, fetchData: getMessages } = useAxiosWrapper();
  const { data, fetchData: callLogout } = useAxiosWrapper();
  const { data: contactInfo, fetchData: fetchContact } = useAxiosWrapper();

  const wsRef = useRef(null);

  function onSelectedChatChange(sender_id) {
    //console.log(sender_id);
    setSelectedChat(sender_id);
  }
  function logout() {
    callLogout("/auth/logout", {
      method: "GET",
    });
  }
  useEffect(() => {
    if (data) dispatch({ type: "LOGIN_STATUS", value: false });
  }, [data]);

  useEffect(() => {
    //if(wsRef) return;
    if (wsRef.current) {
      console.log(wsRef);
      return;
    }
    wsRef.current = new WebSocket("ws://localhost:3005");
    /**This is for an incomming message */

    wsRef.current.onmessage = (message) => {
      //console.log(message);
      console.log("here");
      const data = JSON.parse(message.data);
      setChats((prevState) => {
        //const newState = new Map(prevState);
        const newState = new Map(
          JSON.parse(JSON.stringify(Array.from(prevState)))
        );
        console.log(message);
        //In case the user is sending message to himself we don't need to update the state from here
        //As when the user is sender_id the state is locally updated in the conversation page
        if (userId === data.sender_id) return prevState;

        //making a deep copy of the entire conversation array which is the value of chat Map
        //const conversation = JSON.parse(JSON.stringify(newState.get(data.sender_id)));

        newState.get(data.sender_id).push({
          type: "text",
          content: data.content,
          receiver_id: userId,
          //todo: the websocket should send the repsonse and from the response we should pick the timestamp
          timestamp: Date.now(), //this should not be done like this.
          url: null,
          sender_id: data.sender_id,
        });
        return newState;
      });
    };

    return () => {
      //wsRef.current.close();
    };
  }, []);

  useEffect(() => {
    getMessages("/messages", {
      method: "GET",
    });
  }, []);

  useEffect(() => {
    //this useEffect is setting up the chat_map 
    if (!api_data) return;
    console.log("api data", api_data);

    const tempChat = new Map();
    console.log("user id: " + userId);
    //sorting in decending order wtr timestamp of a message
    api_data[0].sort((a, b) => b.timestamp - a.timestamp);

    api_data[0].forEach((message) => {
      let key = message.sender_id;
      if (message.group_id !== null) {
        key = message.group_id;
      } else if (message.sender_id === userId) {
        key = message.receiver_id;
      }

      const value = tempChat.get(key);
      if (!value) {
        tempChat.set(key, []);
      }
      tempChat.get(key).push({
        type: message.message_type,
        content: message.content,
        timestamp: message.timestamp,
        url: message.url,
        sender_id: message.sender_id,
      });
    });
    tempChat.forEach((value, key) => {
      value.sort((a, b) => a.timestamp - b.timestamp);
    });

    setChats(tempChat);
  }, [api_data]);

  useEffect(() => {
    if(!contactInfo) return;
    
    console.log(contactInfo);
    setChats((prevState) => {
      const newState = new Map(
        JSON.parse(JSON.stringify(Array.from(prevState)))
      );
      newState.set(contactInfo.user.userId, []);

      return newState;
    })
    
  }, [contactInfo])

  function openAddGroupPopup() {
    console.log("create button clicked..");
    setIsGroupPopUpOpen(true);
  }
  function closeAddGroupPopup() {
    console.log("create button clicked..");
    setIsGroupPopUpOpen(false);
  }
  function openCreateMemberPopUp() {
    console.log("Member Add clicked");
    setCreateMemberPopUpOpen(true);
  }
  function closeContactPopup() {
    console.log("Add Member Close clicked ..");
    setCreateMemberPopUpOpen(false);
  }
  return (
    <div className="chat-container">
      <header>
        <h2>XChat</h2>
        <div className="tool-box">
          <button onClick={openCreateMemberPopUp} className="btn-add contacts">
            {" "}
            Add Contacts
          </button>
          <button onClick={openAddGroupPopup} className="btn-add group">
            Create Group
          </button>
          <button onClick={logout} className="btn-logout">
            <AiOutlineLogout /> Logout
          </button>
        </div>
      </header>
      <main>
        <div className="left">
          {Array.from(chats).map(([key, messages]) => (
            <ChatItem
              key={messages[0]?.timestamp ?? Date.now() + "" + key}
              sender_id={key}
              message={messages[0]}
              onClick={onSelectedChatChange}
              active={selectedChat === key}
            />
          ))}
        </div>
        <div className="right">
          {!selectedChat ? (
            <h3>Welcome to XChat</h3>
          ) : (
            <Conversation
              selectedChat={selectedChat}
              data={chats.get(selectedChat)}
              ws={wsRef.current}
              setChats={setChats}
            />
          )}
        </div>
      </main>
      {isGroupPopUpOpen && <GroupCreatePopUp onClose={closeAddGroupPopup} />}
      {isCreateMemeberPopUpOpen && (
        <AddMemberPopUp
          fetchContact={fetchContact}
          onClose={closeContactPopup}
        />
      )}
    </div>
  );
}
