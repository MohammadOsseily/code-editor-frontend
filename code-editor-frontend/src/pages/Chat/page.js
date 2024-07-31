import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated.");
      return;
    }

    axios
      .get("http://localhost:8000/api/chats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setChats(response.data))
      .catch((error) => console.error("Error fetching chats:", error));

    axios
      .get("http://localhost:8000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleCreateChat = (user2) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated.");
      return;
    }

    const decodedToken = jwtDecode(token);
    const user1 = decodedToken.sub || decodedToken.id;

    if (user1 === user2) {
      alert("You cannot create a chat with yourself.");
      return;
    }

    axios
      .post(
        "http://localhost:8000/api/chats",
        { user1, user2 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => setChats([...chats, response.data.chat]))
      .catch((error) => {
        console.error("Error creating chat:", error.response.data);
        setError(error.response.data.error || "Error creating chat");
      });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = (chatId) => {
    navigate(`/messages/${chatId}`);
  };

  return (
    <div className="p-4">
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="">
        <h2 className="text-2xl text-primary font-bold mb-4">Search Users</h2>
        <input
          type="text"
          placeholder="Search for a user"
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 mb-4 rounded-xl w-1/2"
        />
        <div className="flex">
          <div className="w-1/2">
            <h2 className="text-2xl text-primary font-bold  mb-4">Users</h2>
            <ul className="mb-4">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="cursor-pointer p-2 text-lg text-white hover:text-secondary hover:bg-primary"
                  onClick={() => handleCreateChat(user.id)}
                >
                  {user.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-1/2">
            <h2 className="text-2xl font-bold text-primary  mb-4">Chats</h2>
            <ul>
              {chats.map((chat) => (
                <li
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)}
                  className="cursor-pointer p-2 text-lg text-white hover:text-secondary hover:bg-primary"
                >
                  Chat between {chat.user1.name} and {chat.user2.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
