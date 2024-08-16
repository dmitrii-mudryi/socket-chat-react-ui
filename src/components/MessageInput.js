// MessageInput.js
import React from 'react';

const MessageInput = ({ sendMessage, handleTyping }) => {
    const [message, setMessage] = React.useState('');

    const handleChange = (e) => {
        setMessage(e.target.value);
        handleTyping(true);
    };

    const handleBlur = () => {
        handleTyping(false);
    };

    const handleSend = () => {
        if (message.trim()) {
            sendMessage(message);
            setMessage('');
        }
    };

    return (
    <div className="input-group mt-3">
        <input type="text" className="form-control" placeholder="Enter your message" value={message}
               onChange={handleChange}
               onBlur={handleBlur}/>
        <div className="input-group-append">
            <button className="btn btn-success" onClick={handleSend}>Send</button>
        </div>
    </div>
)
    ;
};

export default MessageInput;