import { useContext, useState } from "react";
import { AppContext } from "../context/AppContex";

export default function Conversation({ data }) {
  const {
    appState: { userId },
  } = useContext(AppContext);

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
              {message.type === "text" ? (
                message.content
              ) : (
                <img src={message.url} alt="media" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
