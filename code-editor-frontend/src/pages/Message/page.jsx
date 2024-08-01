import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Message from "../../components/Message";

const MessagePage = () => {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [senderId, setSenderId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated.");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.sub || decodedToken.id;
    setSenderId(userId);

    axios
      .get(`http://localhost:8000/api/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setChat(response.data))
      .catch((error) => console.error("Error fetching chat:", error));
  }, [chatId]);

  if (!chat) {
    return <div>Loading...</div>;
  }

  const otherUser =
    chat.user1.id === senderId ? chat.user2.name : chat.user1.name;

  return (
    <div className="w-3/4 mx-auto pt-5 bg-secondary">
      <h1 className="text-4xl text-primary pl-8 font-bold mb-4">{otherUser}</h1>
      <Message chatId={chatId} />
    </div>
  );
};

export default MessagePage;
