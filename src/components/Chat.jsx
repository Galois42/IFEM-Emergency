import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import './Chat.css';

const Chat = ({ socket, matchId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageInputRef = useRef(null);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("message_received", (msg) => {
      console.log(msg.message);
      setMessages((prevMessages) => [...prevMessages, { sender: "Other", text: msg.message }]);
    });

    return () => {
      // Cleanup the socket event listener on unmount
      socket.off("message_received");
    };
  }, [socket]);

  const sendMessage = () => {
    if (message.trim()) {
      // Send the message to the server
      socket.emit("send_message", {message, matchId});

      // Update the local state to display the sent message
      setMessages((prevMessages) => [...prevMessages, { sender: "You", text: message }]);

      // Clear the input field
      setMessage("");
      messageInputRef.current.focus();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with your match</h2>
      </div>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "You" ? "sent" : "received"}`}
          >
            <span className="message-sender">{msg.sender}: </span>
            <span className="message-text">{msg.text}</span>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          ref={messageInputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
