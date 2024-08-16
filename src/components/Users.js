// src/components/Users.js
import React from 'react';

const Users = ({ users, setPrivateRecipient }) => {
    return (
        <div id="users" className="mb-3" style={{ height: '100px', overflowY: 'scroll', backgroundColor: '#f8f9fa', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '20px' }}>
            <strong>Connected Users:</strong>
            <div id="users-list">
                {users.map((user, index) => (
                    <div key={index} className="user-item" style={{ cursor: 'pointer', marginBottom: '5px', padding: '5px', border: '1px solid transparent', borderRadius: '3px' }} onClick={() => setPrivateRecipient(user)}>
                        {user}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Users;