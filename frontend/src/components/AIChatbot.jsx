import React, { useState } from 'react';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);

    const sendMessage = async () => {
        if (!message.trim()) return;
        
        setChatMessages([...chatMessages, { text: message, sender: 'user' }]);
        setMessage('');
        
        try {
            const response = await fetch('http://localhost:5001/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, userId: 'test' })
            });
            const data = await response.json();
            setChatMessages(prev => [...prev, { text: data.message, sender: 'bot' }]);
        } catch (error) {
            setChatMessages(prev => [...prev, { text: 'Error: AI server not running', sender: 'bot' }]);
        }
    };

    const buttonStyle = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: '#667eea',
        color: 'white',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        zIndex: 9999
    };

    const chatStyle = {
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        width: '350px',
        height: '500px',
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '10px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column'
    };

    return (
        <>
            <button style={buttonStyle} onClick={() => setIsOpen(!isOpen)}>
                💬
            </button>
            {isOpen && (
                <div style={chatStyle}>
                    <div style={{ padding: '10px', background: '#667eea', color: 'white', borderRadius: '10px 10px 0 0' }}>
                        <strong>AI Assistant</strong>
                        <button onClick={() => setIsOpen(false)} style={{ float: 'right', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '5px 0' }}>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '8px 12px',
                                    borderRadius: '12px',
                                    background: msg.sender === 'user' ? '#667eea' : '#e0e0e0',
                                    color: msg.sender === 'user' ? 'white' : 'black'
                                }}>
                                    {msg.text}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div style={{ padding: '10px', borderTop: '1px solid #ccc', display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Ask me anything..."
                            style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <button onClick={sendMessage} style={{ padding: '8px 16px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChatbot;