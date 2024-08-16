// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chat from './components/Chat';
import Users from './components/Users';
import MessageInput from './components/MessageInput';
import PrivateMessageForm from './components/PrivateMessageForm';
import TypingIndicator from './components/TypingIndicator';

const App = () => {
  const [stompClient, setStompClient] = useState(null);
  const [username, setUsername] = useState('');
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [privateRecipient, setPrivateRecipient] = useState(null);
  const [typingStatus, setTypingStatus] = useState('');

  const connect = () => {
    const socket = new SockJS('http://localhost:8080/chat');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: (frame) => {
        setStompClient(client);
        setConnected(true);
        client.subscribe('/topic/public', (messageOutput) => {
          const message = JSON.parse(messageOutput.body);
          if (message.type === 'CHAT') {
            setMessages((prevMessages) => [...prevMessages, message]);
          } else if (message.type === 'JOIN' || message.type === 'LEAVE') {
            if (message.userList) {
              setUsers(message.userList);
            }
            setMessages((prevMessages) => [...prevMessages, { sender: 'System', content: `${message.sender} ${message.type === 'JOIN' ? 'joined' : 'left'} the chat`, type: 'SYSTEM' }]);
          }
        });
        client.subscribe(`/user/${username}/queue/private`, (messageOutput) => {
          const message = JSON.parse(messageOutput.body);
          setMessages((prevMessages) => [...prevMessages, { ...message, type: 'PRIVATE' }]);
        });
        client.subscribe('/topic/typing', (typingStatus) => {
          const status = JSON.parse(typingStatus.body);
          setTypingStatus(status.typing ? `${status.username} is typing...` : '');
        });
        client.subscribe(`/user/${username}/queue/read-receipt`, (receiptOutput) => {
          const receipt = JSON.parse(receiptOutput.body);
          setMessages((prevMessages) => prevMessages.map((msg) => msg.id === receipt.messageId ? { ...msg, readReceipt: receipt } : msg));
        });
        client.publish({ destination: "/app/chat.addUser", body: JSON.stringify({ sender: username, type: 'JOIN' }) });
      }
    });
    client.activate();
  };

  const sendMessage = (content) => {
    if (content && stompClient) {
      const chatMessage = { sender: username, content, type: 'CHAT' };
      stompClient.publish({ destination: "/app/chat.sendMessage", body: JSON.stringify(chatMessage) });
    }
  };

  const sendPrivateMessage = (content) => {
    if (content && stompClient && privateRecipient) {
      const chatMessage = { sender: username, recipient: privateRecipient, content, type: 'CHAT' };
      stompClient.publish({ destination: "/app/chat.sendPrivateMessage", body: JSON.stringify(chatMessage) });
    }
  };

  const handleTyping = (isTyping) => {
    if (stompClient) {
      stompClient.publish({ destination: "/app/chat.typing", body: JSON.stringify({ username, typing: isTyping }) });
    }
  };

  const sendReadReceipt = (messageId, recipient) => {
    if (stompClient) {
      const readReceipt = { sender: username, messageId, recipient, timestamp: new Date().toISOString() };
      stompClient.publish({ destination: "/app/chat.sendReadReceipt", body: JSON.stringify(readReceipt) });
    }
  };

  return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h3 className="text-center">WebSocket Chat</h3>
            <Users users={users} setPrivateRecipient={setPrivateRecipient} />
            <Chat messages={messages} username={username} sendReadReceipt={sendReadReceipt} />
            <TypingIndicator typingStatus={typingStatus} />
            {!connected ? (
                <div className="input-group mt-3">
                  <input type="text" className="form-control" placeholder="Enter your name" value={username} onChange={(e) => setUsername(e.target.value)} />
                  <div className="input-group-append">
                    <button className="btn btn-primary" onClick={connect}>Connect</button>
                  </div>
                </div>
            ) : (
                <>
                  <MessageInput sendMessage={sendMessage} handleTyping={handleTyping} />
                  {privateRecipient && <PrivateMessageForm recipient={privateRecipient} sendPrivateMessage={sendPrivateMessage} />}
                </>
            )}
          </div>
        </div>
      </div>
  );
};

export default App;