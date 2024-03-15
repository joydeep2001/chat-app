import { CiUser } from "react-icons/ci";
//chatType can be group (multicast) or DM (unicast)
export default function ChatItem({ sender, message, onClick, active }) {
  function handleClick(e) {
    onClick(e.currentTarget.dataset.id);
  }
  return (
    <div onClick={handleClick}  data-id={sender} className={`chat-item ${active && "active-chat"}`}>
      <div className="icon">
        <CiUser />
      </div>
      <div className="display-text">
        <span className="sender">{sender}</span>
        <span className="last-message">{message?.content}</span>
      </div>
    </div>
  );
}
