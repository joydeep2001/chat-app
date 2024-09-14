import React from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";

export default function ProfilePopup({ userId, logout }) {
  return (
    <div className="profile-popup">
      <div className="user-cont">
        <FaUserAlt />
        <p>
          {userId}
          <span></span>
        </p>
      </div>
      <button onClick={logout} className="btn-logout">
        <AiOutlineLogout /> Logout
      </button>
    </div>
  );
}
