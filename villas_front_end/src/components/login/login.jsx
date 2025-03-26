import { useState } from 'react';
import PropTypes from 'prop-types';
import FacebookLogin from 'react-facebook-login';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { getUserInfo } from '../../services/api/user';
import { login, loginWithGoogle } from '../../services/api/account';
import PasswordReset from '../forgot-password/PasswordReset';
import '../../styles/login.css';
import { useNavigate } from 'react-router-dom';
import Register from '../register/register';
function Login({ onClose, onSuccess }) {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [currentView, setCurrentView] = useState('login'); // Quản lý các chế độ hiển thị: 'login', 'register', 'reset'
    const navigate = useNavigate();

    const onShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const token = await login(username, password);
            if (!token) throw new Error("Không tìm thấy token trong phản hồi đăng nhập.");

            localStorage.setItem('token', token);
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userId = decodedToken.id || decodedToken.userId;
            if (!userId) throw new Error("Không tìm thấy userId trong token.");

            const userInfo = await getUserInfo(userId, token);

            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            onSuccess(userInfo);

            alert("Đăng nhập thành công. Chào mừng bạn!");

            if (userInfo.role === 'Admin') {
                navigate('/admin', { replace: true });
            } else {
                navigate('/account', { replace: true });
            }
        } catch (error) {
            setErrorMessage('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
            console.error("Error during login:", error);
        }
    };

    const responseFacebook = (response) => {
        console.log('Facebook Login:', response);
    };

    const responseGoogle = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse;
            const token = await loginWithGoogle(credential);
            if (!token)
                throw new Error("Không tìm thấy token trong phản hồi đăng nhập Google.");
            localStorage.setItem('token', token);
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userId = decodedToken.id || decodedToken.userId;
            if (!userId) throw new Error("Không tìm thấy userId trong token.");
            const userInfo = await getUserInfo(userId, token);
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            onSuccess(userInfo); alert("Đăng nhập Google thành công. Chào mừng bạn!");
            if (userInfo.role === 'Admin') {
                navigate('/admin', { replace: true });
            } else {
                navigate('/account', { replace: true });
            }
        } catch (error) {
            setErrorMessage('Đăng nhập Google không thành công. Vui lòng thử lại.');
            console.error("Error during Google login:", error);
        }
    };


    const handleViewChange = (view) => {
        setCurrentView(view);  // Cập nhật view hiện tại
    }

    return (
        <div className="d-flex justify-content-center mt-5 login-modal">
            {currentView === 'login' && (
                <>
                    <div className="col-md-6 col-lg-4 p-4 rounded " style={{ border: 'solid 2px', width: '600px', backgroundColor: 'white', minHeight: '700px' }}>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-link text-danger" onClick={onClose}>
                                <i className="bi bi-x h4"></i>
                            </button>

                        </div>
                        <div className="text-center mb-3">
                            <div className='d-flex justify-content-center'>
                                <img src='../../../public/assets/logo.png' alt="Logo" style={{ width: '265px', height: '80px' }} />
                            </div>
                            <p className="mt-2 fw-bold" style={{ fontSize: '1.7rem' }}>Chào mừng bạn đến với ECOVA VILLA</p>
                        </div>
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        <form onSubmit={handleLogin}>
                            <div className="form-group mb-3">
                                <input
                                    type="text"
                                    className="form-control border-input fs-5 border-3 text-black"
                                    style={{ padding: '30px 10px' }}
                                    id="username"
                                    placeholder="Nhập tên đăng nhập"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control border-input fs-5 border-3 text-black"
                                    style={{ padding: '30px 10px' }}
                                    id="password"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="form-check mt-2">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="showPassword"
                                        onChange={onShowPassword}
                                    />
                                    <label className="form-check-label fs-5" htmlFor="showPassword">Hiển thị mật khẩu</label>
                                </div>
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-warning btn-block mt-2 w-100 fs-3 fw-bold text-white">Đăng nhập</button>
                            </div>
                        </form>
                        <div className="text-center mt-3">
                            <div className='row'>
                                <div className='col-6'>
                                    <FacebookLogin
                                        appId="YOUR_FACEBOOK_APP_ID"
                                        fields="name,email,picture"
                                        callback={responseFacebook}
                                        cssClass="btn btn-primary w-100 mb-2"
                                        icon="fa-facebook"
                                        textButton=" Đăng nhập với Facebook"
                                    />
                                </div>
                                <div className='col-6'>
                                    <GoogleOAuthProvider clientId="901822029691-gdnt1g3kvhrj62r786d1e31jfu3e76ar.apps.googleusercontent.com">
                                        <GoogleLogin onSuccess={responseGoogle} onError={() => console.log('Login Failed')} useOneTap />
                                    </GoogleOAuthProvider>
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-3">
                            <button className="btn btn-link text-decoration-none fs-6 fw-bold" onClick={() => handleViewChange('reset')}>
                                Quên mật khẩu?
                            </button>
                            <button className="btn btn-link text-decoration-none fs-6 fw-bold" onClick={() => handleViewChange('register')}>
                                Tạo tài khoản
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Chỉ hiển thị register khi đang ở chế độ 'register' */}
            {currentView === 'register' && (
                <div style={{ paddingTop: '100px', paddingBottom: '20px' }}>
                    <Register onClose={() => handleViewChange('login')} />
                </div>
            )}

            {/* Chỉ hiển thị reset khi đang ở chế độ 'reset' */}
            {currentView === 'reset' && (
                <div>
                    <PasswordReset onClose={() => handleViewChange('login')} />
                </div>
            )}
        </div>
    );

}

Login.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default Login;
