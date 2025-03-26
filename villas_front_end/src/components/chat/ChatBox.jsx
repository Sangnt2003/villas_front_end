/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Chat from './Chat'; // Import component Chat của bạn

const ChatBox = ({ user }) => {
    const [showChat, setShowChat] = useState(false);
    console.log(user);
    const toggleChat = () => {
        setShowChat(!showChat);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.closest('.chat-box') === null && event.target.id !== 'chat-icon') {
                setShowChat(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div>
            {/* Biểu tượng chat */}
            <button
                id="chat-icon"
                className="btn btn-primary position-fixed bottom-0 end-0 m-4"
                style={{
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    fontSize: '30px',
                    backgroundColor: '#00aaff',
                    color: 'white',
                    border: 'none',
                }}
                onClick={toggleChat}
            >
                💬
            </button>

            {/* Hộp chat */}
            {showChat && (
                <div className="chat-box position-fixed bottom-0 end-0 m-4">
                    <div className="card shadow-lg" style={{ width: '350px', height: '450px' }}>
                        <div className="card-body p-2" style={{ height: '100%', overflowY: 'auto' }}>
                            <h5 className='fw-bold' style={{ color: '#23527C' }}>Xin chào {user.fullName}</h5>
                            <Chat setShowChat={setShowChat} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBox;
