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
  const { data: logoutData, fetchData: callLogout } = useAxiosWrapper();
  const { data: contactInfo, fetchData: fetchContact } = useAxiosWrapper();
  const [message, setMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);

  function handleAttachment(e) {
    setAttachedFile(e.target.files[0]);
  }

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
    if (logoutData) dispatch({ type: "LOGIN_STATUS", value: false });
  }, [logoutData]);

  useEffect(() => {
    //if(wsRef) return;
    if (wsRef.current) {
      console.log(wsRef);
      return;
    }
    wsRef.current = new WebSocket(`ws://${process.env.REACT_APP_BACKEND_URL}/ws`);
    /**This is for an incomming message */

    wsRef.current.onmessage = (message) => {
      //console.log(message);
      console.log("Incomming message");
      const data = JSON.parse(message.data);
      setChats((prevState) => {
        //making a deep copy of the entire conversation array which is the value of chat Map
        const newState = new Map(
          JSON.parse(JSON.stringify(Array.from(prevState)))
        );
        console.log(message);
        //In case the user is sending message to himself we don't need to update the state from here
        //As when the user is sender_id the state is locally updated. So if we update the state again
        //the message will be shown twice

        if (userId === data.sender_id && data.message_type !== "media") return prevState;

        let inboxId = data.group_id !== null ? data.group_id : data.sender_id;
        console.log("inbox " + inboxId);

        const inbox = newState.get(inboxId);

        if (!inbox) newState.set(inboxId, []);

        console.log(
          "setting chat state from onmessage() " +
            data.sender_id +
            " " +
            data.user_id
        );
        newState.get(inboxId).push({
          type: data.message_type,
          content: data.content,
          receiver_id: userId,
          //todo: the websocket should send the repsonse and from the response we should pick the timestamp
          timestamp: Date.now(), //this should not be done like this.
          url: data.url,
          sender_id: data.sender_id,
          group_id: data.group_id
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
        group_id: message.group_id, //We actually assuming the group_name is the group_id and it is unique across all the groups
      });
    });
    tempChat.forEach((value, key) => {
      value.sort((a, b) => a.timestamp - b.timestamp);
    });

    setChats(tempChat);
  }, [api_data]);

  useEffect(() => {
    if (!contactInfo) return;

    console.log(contactInfo);
    setChats((prevState) => {
      const newState = new Map(
        JSON.parse(JSON.stringify(Array.from(prevState)))
      );
      newState.set(contactInfo.user.userId, [
        {
          type: "text",
          content: "Contact Added",
          timestamp: Date.now(),
          url: null,
          sender_id: userId,
          group_id: null, //We actually assuming the group_name is the group_id and it is unique across all the groups
        },
      ]);

      return newState;
    });
  }, [contactInfo]);

  function createGroup(groupName, groupId) {
    setChats((prevState) => {
      const newState = new Map(
        JSON.parse(JSON.stringify(Array.from(prevState)))
      );
      //So we are pushing a temporary local message to the group so that the rendering happens
      //this is a temporary 4am hack
      //we will figure it out how to do it properly later
      //Also we are assuming that group name must be unique across the whole system
      newState.set(groupName, [
        {
          type: "text",
          content: "Group created",
          timestamp: Date.now(),
          url: null,
          sender_id: userId,
          group_id: groupName, //We actually assuming the group_name is the group_id and it is unique across all the groups
        },
      ]);

      return newState;
    });
  }
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


  function sendFile(payload) {
    console.log("File Sending .. ");

    if (!attachedFile) {
      console.error("No file selected");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const fileData = event.target.result;
      const filename = attachedFile.name;
      console.log(filename);
      payload.content = new Uint8Array(fileData);
      payload.file_name = filename;
      console.log(JSON.stringify(payload));
      wsRef.current.send(JSON.stringify(payload));
    };
    reader.onerror = function (event) {
      console.error("Error reading file:", event.target.error);
    };

    reader.readAsArrayBuffer(attachedFile);
  }


  function handleChange(e) {
    setMessage(e.target.value);
  }

  function handleSend() {

    //checking the first message only to make sure that the message has a null group_id or not
    //in case one message has a null group id all messages will have the same
    //so depending on that we can be sure it is a group or a person
    const data = chats.get(selectedChat);
    const comType = data[0]?.group_id !== null ? "multicast" : "unicast";

    const receiver_id = comType === "unicast" ? selectedChat : null;
    const group_id = comType === "multicast" ? selectedChat : null;
    const content_type = attachedFile ? "media" : "text"; 
    const content =  attachedFile ?? message;

    const payload = {
      content,
      receiver_id: receiver_id,
      content_type: content_type,
      communicationType: comType,
      group_id: group_id,
    };
    
    console.log(payload);

    setMessage(""); //reseting the message input box
    setAttachedFile(null);

    if(content_type === "media") {
      sendFile(payload);
      return;
    }

    wsRef.current.send(JSON.stringify(payload));
    console.log("setting chat state from handleSend()");
    
    setChats((prevState) => {
      const newState = new Map(
        JSON.parse(JSON.stringify(Array.from(prevState)))
      );
      newState.get(selectedChat).push({
        type: "text",
        content: payload.content,
        timestamp: Date.now(),
        url: null,
        sender_id: userId,
      });
      return newState;
    });
  }
  return (
    <div className="chat-container">
      <header>
        <h2>VaartalUp</h2>
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
              message={messages[messages.length - 1]}
              onClick={onSelectedChatChange}
              active={selectedChat === key}
            />
          ))}
        </div>
        <div className="right">
          {!selectedChat ? (
            <h3>Welcome to XChat</h3>
          ) : (
            <>
              <Conversation data={chats.get(selectedChat)} />
              <div className="msg-box-cont">
                <input
                  onChange={handleAttachment}
                  type="file"
                  className="msg-send-file"
                />
                <input
                  value={message}
                  onChange={handleChange}
                  className="message-box"
                  placeholder="Type Your XChat here.."
                  type="text"
                />
                <button onClick={handleSend} className="msg-send-btn">
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      {isGroupPopUpOpen && (
        <GroupCreatePopUp
          createGroup={createGroup}
          onClose={closeAddGroupPopup}
        />
      )}
      {isCreateMemeberPopUpOpen && (
        <AddMemberPopUp
          fetchContact={fetchContact}
          onClose={closeContactPopup}
        />
      )}
    </div>
  );
}
