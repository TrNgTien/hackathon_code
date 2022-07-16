import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Chatting from "./pages/chat-page/ChattingPage";
import SharingPage from "./pages/home-page/SharingPage";
import ResetPage from "./pages/reset-page/ResetPage";

function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chatting" element={<Chatting />} />
        <Route path="/" element={<SharingPage />} />
        <Route path="/resetPass" element={<ResetPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MainRoutes;
