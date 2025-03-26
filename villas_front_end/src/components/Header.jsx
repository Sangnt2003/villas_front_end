/* eslint-disable no-undef */
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import userImage from '../../public/assets/info/avatar-default.jpg';
import { imageUrl } from '../services/enviroment.jsx';
import MyInfo from './account/MyAccount.jsx';
import Login from './login/login.jsx';
import Register from './register/register.jsx';
import { UserContext } from '../contexts/UserContext.jsx';
import AddVillaForm from './admin/Management/villa/Add.jsx';
import NotificationDropdown from './notifi/NotificationDropdown\'.jsx';
import '../styles/Header.css';
import LocationDropdown from './location/LocationDropdown.jsx';

function Header() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showAddVillaForm, setShowAddVillaForm] = useState(false);
    const [showMyInfo, setShowMyInfo] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUserInfo = localStorage.getItem('userInfo');
        if (savedUserInfo) {
            setUserInfo(JSON.parse(savedUserInfo));
        }
    }, [setUserInfo]);
    const handleAddVillaClick = () => {
        if (userInfo) {
            setShowAddVillaForm(true);  // Mở form thêm Villa
        } else {
            alert("Vui lòng đăng nhập để đăng Villa!");
            setShowLogin(true);
            navigate("/login");
        }
    };

    const handleCloseAddVillaForm = () => {
        setShowAddVillaForm(false);  // Đóng form khi thêm thành công
    };
    const handleLoginClick = () => {
        setShowLogin(true);
        setShowRegister(false);
        navigate('/login');
    };

    const handleRegisterClick = () => {
        setShowRegister(true);
        setShowLogin(false);
        navigate('/register');
    };

    const handleCloseModal = () => {
        setShowLogin(false);
        setShowRegister(false);
        navigate('/');
    };

    const handleMyInfoClick = () => {
        navigate('/account');
    };

    const handleCloseMyInfo = () => setShowMyInfo(false);

    const handleLoginSuccess = (userData) => {
        setUserInfo(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setShowLogin(false);
        navigate('/account');
    };

    const handleLogout = () => {
        setUserInfo(null);
        localStorage.removeItem('userInfo');
        setShowMyInfo(false);
        navigate('/');
    };

    const handleUpdateUser = (updatedUserInfo) => {
        setUserInfo(updatedUserInfo);
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        navigate(`/profile/${updatedUserInfo.id}`);
    };

    return (
        <div>
            <header className="d-flex justify-content-between align-items-center p-3" style={{ background: '#003B95' }}>
                <img className='' src='../../public/assets/logo.png' alt="Logo" style={{ width: '265px', height: '80px' }} />
                <div className="d-flex align-items-center">
                    <div>
                        <NotificationDropdown userInfo={userInfo} />
                    </div>
                    <div>
                        <button
                            className="fs-4 fw-bold bg-transparent"
                            onClick={handleAddVillaClick}
                        >
                            Đăng Villa của bạn

                        </button>
                    </div>
                    <div className="dropdown mx-2 me-3">
                        <h1 className="text-danger text-center fs-4">🇻🇳</h1>
                    </div>
                    <AuthButtons
                        userInfo={userInfo}
                        onLoginClick={handleLoginClick}
                        onRegisterClick={handleRegisterClick}
                        onMyInfoClick={handleMyInfoClick}
                    />
                </div>
            </header>
            {showAddVillaForm && <AddVillaForm onClose={handleCloseAddVillaForm} />}
            <NavbarLinks />

            <ModalContainer
                showLogin={showLogin}
                showRegister={showRegister}
                showMyInfo={showMyInfo}
                userInfo={userInfo}
                onCloseModal={handleCloseModal}
                onLoginSuccess={handleLoginSuccess}
                onCloseMyInfo={handleCloseMyInfo}
                onLogout={handleLogout}
                onUpdateUser={handleUpdateUser}
            />
        </div>
    );
}

function NavbarLinks() {
    return (
        <nav className="text-white d-flex justify-content-center py-3" style={{ backgroundColor: '#003B95' }}>
            <ul className="nav">
                <li className="nav-item h2">
                    <a className="nav-link text-white" href="/">Trang chủ</a>
                </li>
                <li className="nav-item h2">
                    <a className="nav-link text-white" href="/introduction">Giới thiệu</a>
                </li>
                <li className="nav-item h2" >
                    <LocationDropdown />
                </li>
            </ul>
        </nav>
    );
}

function AuthButtons({ userInfo, onLoginClick, onRegisterClick }) {
    const navigate = useNavigate();

    const handleAvatarClick = () => {
        if (userInfo) {
            navigate('/account', { state: { userInfo } });
        }
    };

    return (
        <>
            {!userInfo ? (
                <>
                    <button className=" h5 fw-bold border-0 p-0 bg-transparent text-dark" onClick={onRegisterClick}>
                        Đăng ký |
                    </button>
                    <button className="h5 fw-bold border-0 bg-transparent p-0 ms-1 text-dark" onClick={onLoginClick}>
                        Đăng nhập
                    </button>
                </>
            ) : (
                <div className="ms-2" id="myInfo" onClick={handleAvatarClick}>
                    <img
                        src={userInfo.pictureUrl == null ? userImage : `${imageUrl}user/${userInfo.pictureUrl}`}
                        alt="User Avatar"
                        className="img-fluid rounded-circle bg-warning"
                        style={{ width: '60px', height: '60px' }}
                    />
                </div>
            )}
        </>
    );
}

function ModalContainer({ showLogin, showRegister, showMyInfo, userInfo, onCloseModal, onLoginSuccess, onCloseMyInfo, onLogout, onUpdateUser }) {
    return (
        <>
            {showLogin && (
                <div className="modal-overlay">
                    <Login onClose={onCloseModal} onSuccess={onLoginSuccess} />
                </div>
            )}
            {showRegister && (
                <div className="modal-overlay" style={{ paddingTop: '100px', paddingBottom: '20px' }}>
                    <Register onClose={onCloseModal} />
                </div>
            )}
            {showMyInfo && userInfo && (
                <MyInfo user={userInfo} onClose={onCloseMyInfo} onLogout={onLogout} onUpdateUser={onUpdateUser} />
            )}
        </>
    );
}

AuthButtons.propTypes = {
    userInfo: PropTypes.shape({
        pictureUrl: PropTypes.string,
    }),
    onLoginClick: PropTypes.func.isRequired,
    onRegisterClick: PropTypes.func.isRequired,
    onMyInfoClick: PropTypes.func.isRequired,
};

ModalContainer.propTypes = {
    showLogin: PropTypes.bool.isRequired,
    showRegister: PropTypes.bool.isRequired,
    showMyInfo: PropTypes.bool.isRequired,
    userInfo: PropTypes.object,
    onCloseModal: PropTypes.func.isRequired,
    onLoginSuccess: PropTypes.func.isRequired,
    onCloseMyInfo: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onUpdateUser: PropTypes.func.isRequired,
};

export default Header;
