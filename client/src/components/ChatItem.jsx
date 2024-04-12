import { CiUser } from "react-icons/ci";
//chatType can be group (multicast) or DM (unicast)
export default function ChatItem({ sender_id, message, onClick, active }) {
  function handleClick(e) {
    onClick(e.currentTarget.dataset.id);
  }
  return (
    <div
      onClick={handleClick}
      data-id={message.group_id ?? sender_id}
      className={`chat-item ${active && "active-chat"}`}
    >
      <div className="icon">
        <CiUser />
      </div>
      <div className="display-text">
        <span className="sender">{sender_id}</span>
        <span className="last-message">{message?.type === "text"  ? message?.content : "Image"}</span>
      </div>
    </div>
  );
}
