import { useContext, useEffect, useRef, useState } from "react";
import ChatItem from "./ChatItem";
import Conversation from "./Conversation";

import "./components.css";
import { AppContext } from "../context/AppContex";
import useAxiosWrapper from "../hooks/useAxiosWrapper";
import { AiOutlineLogout } from "react-icons/ai";

// const api_data = [
//   {
//     sender: "cornhub",
//     message_type: "text",
//     content: "I am corn",
//     url: null,
//     group_id: null,
//     reciver_id: "milky dot com",
//     timestamp: 1710404168852,
//   },
//   {
//     sender: "milky dot com",
//     message_type: "text",
//     content: "I am tonmay",
//     url: null,
//     group_id: null,
//     reciver_id: "cornhub",
//     timestamp: 1710404168853,
//   },
//   {
//     sender: "come on sudra",
//     message_type: "text",
//     content: "I am tonmay",
//     url: null,
//     group_id: null,
//     reciver_id: "cornhub",
//     timestamp: 1710404168854,
//   },
  
//   {
//     sender: "milky dot com",
//     message_type: "text",
//     content: "I am tonmay",
//     url: null,
//     group_id: null,
//     reciver_id: "cornhub",
//     timestamp: 1710404168856,
//   },
//   {
//     sender: "come on sudra",
//     message_type: "text",
//     content: "hi",
//     url: null,
//     group_id: null,
//     reciver_id: "cornhub",
//     timestamp: 1710404168857,
//   },
// ];
const api_data = [];

export default function ChatPage() {
  const [chats, setChats] = useState(new Map());
  const [selectedChat, setSelectedChat] = useState(null);
  const {appState: {userId, token}, dispatch} = useContext(AppContext);
  const {data: api_data, fetchData: getMessages} = useAxiosWrapper();
  const {data, fetchData: callLogout} = useAxiosWrapper();
  const wsRef = useRef(null);

  function onSelectedChatChange(sender_id) {
    //console.log(sender_id);
    setSelectedChat(sender_id);
  }
  function logout() {
    callLogout("/auth/logout", {
        method: "GET"
    });
  }
  useEffect(() => {
    if(data)
        dispatch({type: "LOGIN_STATUS", value: false})
  }, [data]);

  useEffect(() => {
    //if(wsRef) return;
    if(wsRef.current) {
      console.log(wsRef);
      return;
    }
    wsRef.current = new WebSocket('ws://localhost:3005', [token]);
    /**This is for an incomming message */

    wsRef.current.onmessage = message => {
        //console.log(message);
        console.log("here");
        const data = JSON.parse(message.data);
        setChats((prevState) => {
            
            //const newState = new Map(prevState);
            const newState = new Map(JSON.parse(JSON.stringify(Array.from(prevState))));
            console.log(message);
            //In case the user is sending message to himself we don't need to update the state from here
            //As when the user is sender the state is locally updated in the conversation page
            if(userId === data.sender) return prevState;

            //making a deep copy of the entire conversation array which is the value of chat Map
            //const conversation = JSON.parse(JSON.stringify(newState.get(data.sender)));
            
            newState.get(data.sender).push({
              type: "text",
              content: data.content,
              reciver_id: userId,
              //todo: the websocket should send the repsonse and from the response we should pick the timestamp
              timestamp: Date.now(), //this should not be done like this.
              url: null,
              sender_id: data.sender,
            });
            return newState;
          });
    }

    return () => {
      //wsRef.current.close();
    };
    
  }, [])


  useEffect(() => {
    getMessages("/messages", {
        method: "GET"
    })
  }, [])

  useEffect(() => {
    if(!api_data) return;
    console.log("api data", api_data);

    const tempChat = new Map();
    console.log("user id: "+ userId)
    //sorting in decending order wtr timestamp of a message
    api_data[0].sort((a, b) => b.timestamp - a.timestamp);

    api_data[0].forEach((message) => {
      
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
  }, [api_data]);
  return (
    <div className="chat-container">
      <header>
        <h2>XChat</h2>
        <div className="tool-box">
            
            <button className="btn-add-contacts"> Add Contacts</button>
            <button className="btn-add-contacts"> Create Group</button>
            <button onClick={logout} className="btn-logout"> <AiOutlineLogout  /> Logout</button>
        </div>
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
              ws={wsRef.current}
              setChats={setChats}
            />
          )}
        </div>
      </main>
    </div>
  );
}
