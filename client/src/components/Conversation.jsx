import { useContext, useState } from "react";
import { AppContext } from "../context/AppContex";

export default function Conversation({ selectedChat, data, ws, setChats }) {
  const {
    appState: { userId },
  } = useContext(AppContext);

  const [message, setMessage] = useState("");

  function handleChange(e) {
    setMessage(e.target.value);
  }

  function handleSend() {
    setMessage("");
    const comType = data.group_id !== null ? "multicast" : "unicast" ;
    
    const receiver_id = comType === "unicast" ? selectedChat : null;
    const group_id = comType === "multicast" ? selectedChat : null;

    const payload = {
      content: message,
      receiver_id: receiver_id,
      content_type: "text",
      communicationType: comType,
      group_id: group_id
    };
    console.log(payload);

    ws.send(JSON.stringify(payload));
    setChats((prevState) => {
      const newState = new Map(prevState);
      newState.get(selectedChat).push({
        type: "text",
        content: payload.content,

        //todo: the websocket should send the repsonse and from the response we should pick the timestamp
        timestamp: Date.now(), //this should not be done like this.
        url: null,
        sender_id: userId,
      });
      return newState;
    });
  }

  return (
    <div className="conversation-container">
      {/* <div>{selectedChat}</div> */}
      <div className="msg-row-cont">
        {data.map((message) => (
          <div
            className={`msg-row ${
              userId === message.sender_id ? "right-align" : "left-align"
            }`}
          >
            <div
              className={`msg ${
                userId === message.sender_id ? "outbound" : "inbound"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="msg-box-cont">
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
    </div>
  );
}
