// src/components/Chat.js
import React, { useEffect } from 'react';

const Chat = ({ messages, username, sendReadReceipt }) => {
    useEffect(() => {
        const chatElement = document.getElementById('chat');
        const handleClick = () => {
            const visibleMessages = messages.filter(message => {
                const messageElement = document.getElementById(`message-${message.id}`);
                return messageElement && messageElement.getBoundingClientRect().top < window.innerHeight;
            });
            visibleMessages.forEach(message => {
                if (!message.readReceipt) {
                    sendReadReceipt(message.id, message.sender);
                }
            });
        };

        window.addEventListener('click', handleClick, { once: true });

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [messages, sendReadReceipt]);

    return (
        <div id="chat" style={{ height: '300px', overflowY: 'scroll', backgroundColor: '#f8f9fa', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
            {messages.map((message, index) => (
                <div
                    key={index}
                    id={`message-${message.id}`}
                    className={`chat-message ${message.type === 'SYSTEM' ? 'system' : message.type === 'PRIVATE' ? 'private' : ''}`}
                    style={{ backgroundColor: message.sender === username ? '#e0f7fa' : 'inherit' }}
                >
                    {message.type === 'PRIVATE' ? `(Private) ` : ''}{message.sender}: {message.content}
                    {message.readReceipt && <div className="read-receipt" style={{ fontSize: 'small' }}>Read by {message.readReceipt.recipient} at {new Date(message.readReceipt.timestamp).toLocaleTimeString()}</div>}
                </div>
            ))}
        </div>
    );
};

export default Chat;