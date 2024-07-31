import React from "react";

import "./styles.css";
import ChatPage from "../Chat/page";

const Home = () => {
  return (
    <div className="h-screen">
      <div className="container mx-auto p-4">
        <ChatPage />
      </div>
    </div>
  );
};

export default Home;
