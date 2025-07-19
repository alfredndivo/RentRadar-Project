// src/pages/UserDashboard/MessagesPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Send, MessageSquareText } from 'lucide-react';
import API  from '../../../api';

const MessagesPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${API}/messages/conversations/${user._id}`);
        setConversations(res.data);
      } catch (err) {
        console.error('Failed to load conversations', err);
      }
    };
    fetchConversations();
  }, [user._id]);

  const selectConversation = async (otherUserId) => {
    setSelectedConversation(otherUserId);
    try {
      const res = await axios.get(`${ API }/messages/thread/${user._id}/${otherUserId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load thread', err);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    try {
      const res = await axios.post(`${ API }/messages`, {
        senderId: user._id,
        receiverId: selectedConversation,
        content: messageText
      });
      setMessages((prev) => [...prev, res.data]);
      setMessageText('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-gray-200 p-4 overflow-y-auto bg-white">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MessageSquareText className="w-5 h-5 text-blue-500" /> Conversations
        </h2>
        {conversations.length === 0 && (
          <p className="text-gray-500 text-sm">No conversations yet.</p>
        )}
        <ul>
          {conversations.map((conv, index) => (
            <li
              key={index}
              onClick={() => selectConversation(conv.otherUser._id)}
              className={`cursor-pointer p-2 rounded mb-2 ${
                selectedConversation === conv.otherUser._id
                  ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {conv.otherUser.name || conv.otherUser.email}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 bg-white flex flex-col">
        {selectedConversation ? (
          <>
            <div className="flex-1 overflow-y-auto mb-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 my-1 max-w-xs rounded-lg ${
                    msg.senderId === user._id
                      ? 'bg-blue-100 self-end text-right'
                      : 'bg-green-100 self-start text-left'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2 focus:outline-none"
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <button
                className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-4 py-2 rounded-full flex items-center gap-1"
                onClick={sendMessage}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400 my-auto text-lg">Select a conversation to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
