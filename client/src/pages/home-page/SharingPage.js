import React, { useState } from "react";
import Header from "../../components/Header";
import OverLay from "../../components/OverLay";
import LoginForm from "../../components/LoginForm";
import Banner from "../../assets/images/banner.png";
import "./styles/SharingPage.css";

const SharingPage = () => {
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const triggerLogin = () => {
    setIsOpenLogin(true);
  };
  const triggerClosePopUp = () => {
    setIsOpenLogin(false);
  };
  return (
    <div className="wrapper-sharing-page">
      <Header triggerLogin={triggerLogin} />
      {isOpenLogin && (
        <>
          <OverLay />
          <LoginForm triggerClosePopUp={triggerClosePopUp} />
        </>
      )}
      <div className="sharing-page-body">
        <img src={Banner} alt="" />
        <div>
          <p>Các chủ đề được đề xuất:</p>
          <div className="wrapper-topic">
            <p className="topic-item">Trầm Cảm</p>
            <p className="topic-item">tình yêu</p>
            <p className="topic-item">căng thẳng</p>
            <p className="topic-item">gia đình</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharingPage;
