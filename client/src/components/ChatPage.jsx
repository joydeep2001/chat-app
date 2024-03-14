import { useContext, useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import Conversation from "./Conversation";

import "./components.css";
import { AppContext } from "../context/AppContex";

const api_data = [
  {
    sender: "cornhub",
    message_type: "text",
    content: "I am corn",
    url: null,
    group_id: null,
    reciver_id: "milky dot com",
    timestamp: 1710404168852,
  },
  {
    sender: "milky dot com",
    message_type: "text",
    content: "I am tonmay",
    url: null,
    group_id: null,
    reciver_id: "cornhub",
    timestamp: 1710404168853,
  },
  {
    sender: "come on sudra",
    message_type: "text",
    content: "I am tonmay",
    url: null,
    group_id: null,
    reciver_id: "cornhub",
    timestamp: 1710404168854,
  },
  
  {
    sender: "milky dot com",
    message_type: "text",
    content: "I am tonmay",
    url: null,
    group_id: null,
    reciver_id: "cornhub",
    timestamp: 1710404168856,
  },
  {
    sender: "come on sudra",
    message_type: "text",
    content: "hi",
    url: null,
    group_id: null,
    reciver_id: "cornhub",
    timestamp: 1710404168857,
  },
];
export default function ChatPage() {
  const [chats, setChats] = useState(new Map());
  const [selectedChat, setSelectedChat] = useState(null);
  const {appState: {userId}} = useContext(AppContext)

  function onSelectedChatChange(sender_id) {
    //console.log(sender_id);
    setSelectedChat(sender_id);
  }

  useEffect(() => {
    const tempChat = new Map();
    console.log("user id: "+ userId)
    //sorting in decending order wtr timestamp of a message
    api_data.sort((a, b) => b.timestamp - a.timestamp);

    api_data.forEach((message) => {
      
      let key = message.sender;
      if(message.group_id !== null) {
        key = message.group_id;
      } else if(message.sender === userId) {
        key = message.reciver_id
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
        sender_id: message.sender
      });
    });

    //sorting the chats in ascending order for 2 benifits
    //1. when new chat will come we can directly push it into the array
    //2. no extra processing will require when we will display the chat in the conversation component
    tempChat.forEach((value, key) => {
      value.sort((a, b) => a.timestamp - b.timestamp);
    });

    // const result = Array.from(tempChat).map(([key, messages]) => ({
    //     name: key,
    //     lastMessage: messages[0]
    //   }));
    // console.log(result);

    setChats(tempChat);
  }, []);
  return (
    <div className="chat-container">
      <header>
        <h2>XChat</h2>
      </header>
      <main>
        <div className="left">
          {Array.from(chats).map(([key, messages]) => (
            <ChatItem
              key={messages[0].timestamp + "" + key}
              sender={key}
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
            />
          )}
        </div>
      </main>
    </div>
  );
}
