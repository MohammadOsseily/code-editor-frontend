import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../index.css";

const Message = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [senderId, setSenderId] = useState("");

  useEffect(() => {
    console.log("Fetching messages for chatId:", chatId);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated.");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.sub || decodedToken.id;
    setSenderId(userId);

    axios
      .get(`http://localhost:8000/api/message/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Fetched messages:", response.data);
        setMessages(response.data);
      })
      .catch((error) => console.error(error));

    window.Echo.private(`chat.${chatId}`).listen("MessageSent", (e) => {
      setMessages((messages) => [...messages, e.message]);
    });

    return () => {
      window.Echo.leave(`chat.${chatId}`);
    };
  }, [chatId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated.");
      return;
    }

    axios
      .post(
        `http://localhost:8000/api/messages/${chatId}`,
        { sender_id: senderId, message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => setMessages([...messages, response.data.message]))
      .catch((error) => console.error(error));
  };

  return (
    <div className="flex flex-col bg-secondary h-screen">
      <div className="flex-grow p-4 overflow-auto">
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className={`chat ${
                msg.sender_id == senderId ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-bubble  break-words text-lg bg-accent max-w-[50%]">
                <strong className="pr-2 text-xl">
                  {msg.sender ? msg.sender.name : "Unknown"}
                </strong>
                : {msg.message}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form
        onSubmit={handleSendMessage}
        className="flex p-4 bg-secondary border-t fixed bottom-0 left-0 right-0 w-3/4 mx-auto"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          className="border w-3/4 p-2 rounded-xl flex-grow mr-2"
        />
        <button
          type="submit"
          className="bg-primary rounded-xl w-1/4 text-white p-2"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Message;
