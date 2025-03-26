/* eslint-disable react/prop-types */
import { useState, useContext } from 'react';
import { searchVillasByAddress } from "../../services/api/villa";
import { UserContext } from '../../contexts/UserContext';
import '../../styles/Chat.css';
import { useNavigate } from 'react-router-dom';
const Chat = ({ setShowChat }) => {
    const navigate = useNavigate();
    const { userInfo } = useContext(UserContext);
    const [villas, setVillas] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGetNearbyVillas = async () => {
        if (!userInfo || !userInfo.id) {
            return;
        }

        try {
            setLoading(true);
            const data = await searchVillasByAddress(userInfo.id);
            setVillas(data);
        } catch (error) {
            console.error('Failed to fetch nearby villas:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleShowDetail = (villa) => {
        navigate(`/villa-detail/${villa.id}`, { state: { villa } });
        setShowChat(false);
    };
    return (
        <div className="chat-container position-absolute bottom-0 end-0">
            <div className="chat-body">
                {loading ? (
                    <div>Loading villas...</div>
                ) : (
                    <ul className="list-group mb-2">
                        {villas.length > 0 ? (
                            villas.map((villa) => (
                                <li
                                    key={villa.id}
                                    className="villa-item "
                                    onClick={() => handleShowDetail(villa)}
                                >
                                    {villa.name}
                                </li>
                            ))
                        ) : (
                            ''
                        )}
                    </ul>
                )}

                <button
                    className="btn btn-primary w-100   "
                    onClick={handleGetNearbyVillas}
                >
                    Villa gần tôi
                </button>
            </div>
        </div>
    );
};

export default Chat;
