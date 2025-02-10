import React, { useState, useEffect } from 'react';
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const App = () => {
  const [username, setUserName] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("receive-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  const handleStartChat = () => {
    if (username.trim() !== "") {
      setChatActive(true);
      socket.emit("joinChat", { username });
    } else {
      alert("Please enter a username to start the chat.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const messageData = {
      message: newMessage,
      user: username,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    };

    socket.emit("send-message", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage("");
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-blue-500 to-purple-700 flex items-center justify-center">
      {chatActive ? (
        <div className="text-center w-full max-w-md bg-white shadow-lg rounded-lg p-4 relative">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Chat Room</h1>
          <div className="h-64 overflow-y-auto bg-gray-100 border rounded-md p-4 mb-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.user === username ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${
                    msg.user === username
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                  style={{ maxWidth: "75%", wordBreak: "break-word" }}
                >
                  <span className="block text-xs font-bold">
                    {msg.user === username ? "You" : msg.user}
                  </span>
                  {msg.message}
                  <span className="block text-xs text-gray-200 mt-1">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <form className="flex items-center gap-2" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="px-5 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-all"
            >
              Send
            </button>
          </form>
          <div className="absolute top-2 right-2">
            <button
              onClick={() => setChatActive(false)}
              className="text-sm bg-red-500 text-white px-2 py-1 rounded-full"
            >
              Leave Chat
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800">Join the Chat</h1>
          <input
            type="text"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition-all"
            onClick={handleStartChat}
          >
            Start Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
