import React, { useState } from "react";
import FbIcon from "../assets/icons/fb_icon.svg";
import GGIcon from "../assets/icons/gg_icon.svg";
import CloseIcon from "../assets/icons/close_icon.svg";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "./styles/LoginForm.css";
function LoginForm({ triggerClosePopUp }) {
  const [showPassword, setShowPassword] = useState(false);
  const RenderIcon = ({ showPassword }) => {
    if (!showPassword) return <AiFillEyeInvisible />;
    else return <AiFillEye />;
  };
  return (
    <div className="wrapper-login__popup">
      <div className="wrapper-header-popup">
        <h1>ĐĂNG NHẬP</h1>
        <img src={CloseIcon} onClick={triggerClosePopUp} alt="" />
      </div>
      <div className="wrapper-body-popup">
        <div className="wrapper-body--left">
          <div className="wrapper-input">
            <label htmlFor="userName">Tên đăng nhập:</label>
            <input type="text" id="userName" />
          </div>
          <div className="wrapper-input password-wrapper">
            <label htmlFor="pwd">Mật khẩu:</label>
            <input type={showPassword ? "text" : "password"} id="pwd" />
            <i
              className="icon-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              <RenderIcon showPassword={showPassword} />
            </i>
          </div>

          <button className="btn-login-popup">Đăng nhập</button>
          <i>Quên mật khẩu</i>
          <i>
            Chưa có tài Khoản?&nbsp;
            <i className="register-option">Đăng ký tại đây</i>
          </i>
        </div>
        <div className="divider">&nbsp;</div>

        <div className="wrapper-body--right">
          <p>Bạn có thể đăng nhập qua:</p>
          <div className="login-method login-method--fb">
            <img src={FbIcon} alt="" />
            <p>Đăng nhập bằng Facebook</p>
          </div>
          <div className="login-method login-method--gg">
            <img src={GGIcon} alt="" />
            <p>Đăng nhập bằng Google</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
