import React, { useState } from "react";
import Chat from "../../components/Chat";
import Message from "../../components/Message";

const ChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <div className="container mx-auto p-4 flex">
      <div className="w-1/3">
        <Chat onSelectChat={setSelectedChatId} />
      </div>
      <div className="w-2/3">
        {selectedChatId ? (
          <Message chatId={selectedChatId} />
        ) : (
          <div className="p-4 text-center text-gray-500">
            Select a chat to view messages
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
