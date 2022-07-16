import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Chatting from "./pages/chat-page/ChattingPage";
import SharingPage from "./pages/home-page/SharingPage";

function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chatting" element={<Chatting />} />
        <Route path="/" element={<SharingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MainRoutes;
