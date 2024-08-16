// src/components/TypingIndicator.js
import React from 'react';

const TypingIndicator = ({ typingStatus }) => {
    return (
        <div id="typingIndicator" data-testid="typingIndicator" style={{ fontStyle: 'italic', color: '#888', display: 'block', minHeight: '25px' }}>
            {typingStatus}
        </div>
    );
};

export default TypingIndicator;