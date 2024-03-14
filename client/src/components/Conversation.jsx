import { useContext } from "react";
import { AppContext } from "../context/AppContex";

export default function Conversation({ sender, data }) {
  const {
    appState: { userId },
  } = useContext(AppContext);
  return (
    <div className="conversation-container">
      <div>{sender}</div>
      <div className="msg-row-cont">
        {data.map((message) => (
          <div className={`msg-row ${userId === message.sender_id ? "right-align" : "left-align"}`}>
            <div
              className={`msg ${userId === message.sender_id ? "outbound" : "inbound"}`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="msg-box-cont">
        <input className="message-box" placeholder="Type Your XChat here.." type="text" />
        <button className="msg-send-btn">Send</button>
      </div>
    </div>
  );
}
