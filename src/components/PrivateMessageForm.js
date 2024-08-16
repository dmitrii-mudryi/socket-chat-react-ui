// src/components/PrivateMessageForm.js
import React, { useState } from 'react';

const PrivateMessageForm = ({ recipient, sendPrivateMessage }) => {
    const [message, setMessage] = useState('');

    const handleSendPrivateMessage = () => {
        if (message.trim() !== '') {
            sendPrivateMessage(message);
            setMessage('');
        }
    };

    return (
        <div className="input-group mt-3">
            <input type="text" className="form-control" placeholder={`Message to ${recipient}`} value={message} onChange={(e) => setMessage(e.target.value)} />
            <div className="input-group-append">
                <button className="btn btn-info" onClick={handleSendPrivateMessage}>Send Private</button>
            </div>
        </div>
    );
};

export default PrivateMessageForm;