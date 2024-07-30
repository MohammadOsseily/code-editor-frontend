import React, { useState, useEffect } from "react";
import axios from "axios";

const Message = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [senderId, setSenderId] = useState("");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/messages/${chatId}`)
      .then((response) => setMessages(response.data))
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
    axios
      .post(`http://127.0.0.1:8000/api/messages/${chatId}`, {
        sender_id: senderId,
        message,
      })
      .then((response) => setMessages([...messages, response.data.message]))
      .catch((error) => console.error(error));
  };

  return (
    <div className="p-4">
      <ul className="mb-4">
        {messages.map((msg) => (
          <li key={msg.id} className="mb-2">
            <strong>{msg.sender_id}</strong>: {msg.message}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
          placeholder="Your ID"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-green-500 text-white p-2">
          Send
        </button>
      </form>
    </div>
  );
};

export default Message;
