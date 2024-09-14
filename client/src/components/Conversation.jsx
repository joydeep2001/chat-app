import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContex";

export default function Conversation({ data }) {
  const {
    appState: { userId },
  } = useContext(AppContext);

  
  function formatDateTime(timestamp) {
    const dateTime = new Date(timestamp);
    // let displayHour = dateTime.getHours();
    // if(displayHour < 10) displayHour = '0' + displayHour; 
    // let displayMinute = dateTime.getMinutes();
    return dateTime.toLocaleString();

  }
  const containerRef = useRef();

    //for scrolling to bottom on load
    useEffect(() => {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollTopMax,
        behavior: "smooth",
      });
      console.log("Scrolled");
    }, [data]);
  

  return (
    <div className="conversation-container">
      {/* <div>{selectedChat}</div> */}
      <div ref={containerRef} className="msg-row-cont">
        {data.map((message) => (
          <div
            key={`msg-row-${message.timestamp}-${message.sender_id}`}
            className={`msg-row ${
              userId === message.sender_id ? "right-align" : "left-align"
            }`}
          >
            
            <div
              className={`msg ${
                userId === message.sender_id ? "outbound" : "inbound"
              }`}
            >
              {message.group_id !== null && <div className="sender-id">{message.sender_id}</div>}
              {message.type === "text" ? (
                message.content
              ) : (
                <img src={message.url} alt="media" />
              )}
               <div className="timestamp">{formatDateTime(message.timestamp)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
