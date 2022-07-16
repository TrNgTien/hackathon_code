import React, { useState } from "react";
import SearchIcon from "../assets/icons/search_icon.svg";
import "./styles/Header.css";
import { useNavigate } from "react-router-dom";
export default function Header({ triggerLogin }) {
  const [tabChoosing, setTabChoosing] = useState("");
  const navigate = useNavigate();
  return (
    <div className="wrapper-header">
      <div className="wrapper-header--left">
        <h1>Me.h</h1>
        <div className="navigation-tabs">
          <p
            onClick={(e) => {
              navigate("/chatting");
              setTabChoosing(e.target.title);
            }}
            title="chat"
            className={`chatting-tab ${
              tabChoosing === "chat" && "choosing-tab"
            }`}
          >
            Trò chuyện
          </p>
          <p
            onClick={(e) => setTabChoosing(e.target.title)}
            title="share"
            className={`sharing-tab ${
              tabChoosing === "share" && "choosing-tab"
            }`}
          >
            Chia sẻ sức khoẻ
          </p>
        </div>
      </div>
      <div className="wrapper-header--right">
        <div className="filter-topic">
          <input type="text" placeholder="Tìm kiếm chủ đề" />
          <img src={SearchIcon} className="search-icon" alt="logo" />
        </div>
        <div className="wrapper-btn">
          <button className="btn--register">Đăng ký</button>
          <button onClick={triggerLogin} className="btn--login ">
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
