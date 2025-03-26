import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';  // Import useNavigate and useLocation
import MyInfo from './MyAccount';
import MyBooking from './MyBooking';
import MyVilla from './MyVilla';
import LikeVilla from './LikeVilla';
import ResetPassword from './ResetPassword';
import '../../styles/MainPage.css';
import PropTypes from 'prop-types';

function MainPage({ user, onLogout }) {
    const navigate = useNavigate();  // Initialize useNavigate
    const location = useLocation();  // To access the current URL
    const [selectedTab, setSelectedTab] = useState('account'); // Store the selected tab

    useEffect(() => {
        // Get the tab from the URL, if exists
        const tabFromUrl = new URLSearchParams(location.search).get('tab');
        if (tabFromUrl) {
            setSelectedTab(tabFromUrl);
        }
    }, [location]);

    if (!user) {
        return <div>Loading...</div>; // Show loading or redirect if no user
    }

    const handleTabClick = (tab) => {
        setSelectedTab(tab);  // Update the selected tab state
        // Update the URL based on the selected tab
        navigate(`?tab=${tab}`);
    };

    const renderContent = () => {
        switch (selectedTab) {
            case 'account':
                return <MyInfo user={user} onClose={() => setSelectedTab('')} onLogout={onLogout} />;
            case 'my-booking':
                return <MyBooking user={user} />;
            case 'my-villa':
                return <MyVilla user={user} />;
            case 'wishlist':
                return <LikeVilla user={user} />;
            case 'reset-password':
                return <ResetPassword user={user} />;
            default:
                return null;
        }
    };

    return (
        <div className='main-container d-flex justify-content-center'>
            <div className="d-flex modal-account py-5">
                <div className="sidebar" style={{ maxWidth: '300px' }}>
                    <div className='mb-4 title-hello'>
                        <h1>Xin chào bạn!</h1>
                    </div>
                    <ul className="sidebar-menu fs-4">
                        <li onClick={() => handleTabClick('account')} className={selectedTab === 'account' ? 'active' : ''}>
                            Thông tin cá nhân
                        </li>
                        <li onClick={() => handleTabClick('my-booking')} className={selectedTab === 'my-booking' ? 'active' : ''}>
                            Đơn đặt của tôi
                        </li>
                        <li onClick={() => handleTabClick('my-villa')} className={selectedTab === 'my-villa' ? 'active' : ''}>
                            Villa của tôi
                        </li>
                        <li onClick={() => handleTabClick('wishlist')} className={selectedTab === 'wishlist' ? 'active' : ''}>
                            Biệt thự yêu thích
                        </li>
                        <li onClick={() => handleTabClick('reset-password')} className={selectedTab === 'reset-password' ? 'active' : ''}>
                            Đổi mật khẩu
                        </li>
                        <li onClick={onLogout}>
                            Đăng xuất
                        </li>
                    </ul>
                </div>
                <div className="content-area" style={{ maxHeight: '1250px' }}>{renderContent()}</div>
            </div>
        </div>
    );
}

MainPage.propTypes = {
    user: PropTypes.object.isRequired,
    onLogout: PropTypes.func.isRequired,
};

export default MainPage;
