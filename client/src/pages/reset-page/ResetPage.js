import React from "react";
import "./styles/ResetPage.css";

function Reset() {
  return <div>
    <h1 className="heading-reset-pass">THAY ĐỔI MẬT KHẨU</h1>

    {/* <div className="wrapper-reset-pass">
      <div className="wrapper-input-reset-pass">
        <label htmlFor="password">Mật khẩu</label>
        <input type="password" id="password" />
      </div>
      <div className="wrapper-input-reset-pass">
        <label htmlFor="password-confirm">Xác nhận mật khẩu</label>
        <input type="password" id="password-confirm" />
      </div>
      <div className="wrapper-input-reset-pass">
        <button className="btn-reset-pass">Thay đổi</button>
      </div>
    </div> */}
    
    <form id="password-reset-form">
      <label for="password">Nhập mật khẩu mới</label>
      <input type="password" id="password" name="password" />

      <label for="password-verify">Xác nhận mật khẩu mới</label>
      <input type="password" id="password-verify" name="passwordConfirm" />

      <button type="submit">Đồng ý</button>
    </form>
  </div>;
}

export default Reset;
