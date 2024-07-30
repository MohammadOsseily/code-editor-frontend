import React, { useState, useEffect } from "react";
import axios from "axios";

const Chat = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/chats")
      .then((response) => setChats(response.data))
      .catch((error) => console.error("Error fetching chats:", error));
  }, []);

  const handleCreateChat = (e) => {
    e.preventDefault();
    setError("");
    axios
      .post("http://127.0.0.1:8000/api/chats", { user1, user2 })
      .then((response) => setChats([...chats, response.data.chat]))
      .catch((error) => {
        console.error("Error creating chat:", error.response.data);
        setError(error.response.data.error || "Error creating chat");
      });
  };

  return (
    <div className="p-4">
      <form onSubmit={handleCreateChat} className="mb-4">
        <input
          type="text"
          value={user1}
          onChange={(e) => setUser1(e.target.value)}
          placeholder="User 1 ID"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={user2}
          onChange={(e) => setUser2(e.target.value)}
          placeholder="User 2 ID"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Create Chat
        </button>
      </form>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className="cursor-pointer p-2 hover:bg-gray-200"
          >
            Chat between {chat.user1} and {chat.user2}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
