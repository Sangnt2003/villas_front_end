import { useState, useEffect, useRef } from 'react';
import { getNotificationsByVillaOwnerId } from '../../services/api/Notification'; // API call
import { UserContext } from '../../contexts/UserContext';
import { useContext } from 'react';

const NotificationDropdown = () => {
    const { userInfo } = useContext(UserContext);
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getNotificationsByVillaOwnerId(userInfo.id);
                const sortedNotifications = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setNotifications(sortedNotifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        if (userInfo) {
            fetchNotifications();
        }
    }, [userInfo]);

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="notification-container" ref={dropdownRef}>
            <div onClick={handleToggleDropdown} className="notification-icon">
                <i className="bi bi-bell text-white fs-3"></i>
            </div>
            {isOpen && (
                <div className="notification-dropdown">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div key={notification.id} className="notification-item">
                                <h5>{notification.title}</h5>
                                <p>{notification.message}</p>
                                <span>{new Date(notification.createdAt).toLocaleString()}</span>
                            </div>
                        ))
                    ) : (
                        <div className="no-notifications">No notifications</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
