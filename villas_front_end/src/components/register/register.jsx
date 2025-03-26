// Register.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { registerUser } from '../../services/api/user';
import { checkEmailExists, checkUsernameExists } from '../../services/api/account.jsx';  // Import the function from api.jsx

function Register({ onClose }) {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [image, setImage] = useState(null);
    const [address, setAddress] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        if (!username || !fullname || !email || !password || !passwordConfirm || !image) {
            setErrorMessage('Vui lòng điền đầy đủ tất cả các trường.');
            return;
        }

        if (password !== passwordConfirm) {
            setErrorMessage('Mật khẩu xác nhận không khớp.');
            return;
        }

        try {

            const emailExists = await checkEmailExists(email);
            if (emailExists) {
                setErrorMessage('Email đã tồn tại.');
                return;
            }

            const usernameExists = await checkUsernameExists(username);
            if (usernameExists) {
                setErrorMessage('Tên đăng nhập đã tồn tại.');
                return;
            }

            // Nếu không trùng lặp, tiến hành đăng ký
            const formData = new FormData();
            formData.append('UserName', username);
            formData.append('FullName', fullname);
            formData.append('Email', email);
            formData.append('PasswordHash', password);
            formData.append('Role', 'CUSTOMER');
            formData.append('PictureUrl', image.name);
            formData.append('image', image);
            formData.append('address', address);
            formData.append('phonenumber', phonenumber);

            // eslint-disable-next-line no-unused-vars
            const data = await registerUser(formData);
            alert("Tạo tài khoản thành công. Chào mừng bạn!");

        } catch (error) {
            setErrorMessage(error.message || 'Đăng ký không thành công. Vui lòng thử lại sau.');
        }
    };


    return (
        <div className="mt-5 d-flex justify-content-center">
            <div className="col-md-6 col-lg-4 p-4 rounded shadow bg-white" style={{ border: 'solid 2px', width: '600px', backgroundColor: 'white', minHeight: '700px' }}>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-link text-danger p-0" onClick={onClose}>
                        <i className="bi bi-x h3"></i>
                    </button>
                </div>
                <div className="text-center mb-3">
                    <div className='d-flex justify-content-center'>
                        <img src='../../../public/assets/logo.png' alt="Logo" style={{ width: '265px', height: '80px' }} />
                    </div>
                    <p className="mt-2 fw-bold" style={{ fontSize: '1.7rem', }}>Chào mừng bạn đến với ECOVA VILLA</p>
                </div>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <form onSubmit={handleRegister}>
                    <div className="form-group mb-2">
                        <input
                            type="text"
                            className="form-control  fs-5 border-3 border-dark text-black  py-3"
                            id="fullname"
                            placeholder="Họ và tên"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-2">
                        <input
                            type="email"
                            className="form-control fs-5 border-3 border-dark text-black  py-3"
                            id="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-2">
                        <input
                            type="text"
                            className="form-control fs-5 border-3 border-dark text-black  py-3"
                            id="phonenumber"
                            placeholder="Số điện thoại"
                            value={phonenumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-2">
                        <input
                            type="text"
                            className="form-control fs-5 border-3 border-dark text-black  py-3"
                            id="address"
                            placeholder="Địa chỉ"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-2">
                        <input
                            type="text"
                            className="form-control fs-5 border-3 border-dark text-black py-3"
                            id="username"
                            placeholder="Tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-2 show-password">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control fs-5 border-3 border-dark text-black  py-3"
                            id="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-2 show-password">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control fs-5 border-3 border-dark text-black py-3"
                            id="passwordConfirm"
                            placeholder="Xác nhận mật khẩu"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-2">
                        <input
                            type="file"
                            className="form-control fs-5 border-3 border-dark text-black  py-3"
                            id="image"
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="form-check d-flex align-items-center mt-2 ms-3">
                        <input
                            type="checkbox"
                            className="form-check-input me-2 fs-4 mt-0"
                            id="showPassword"
                            onChange={togglePasswordVisibility}
                        />
                        <label className="form-check-label fs-5 mb-0" htmlFor="showPassword">
                            Hiển thị mật khẩu
                        </label>
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-warning btn-block mt-2 w-100 fs-3 fw-bold text-white">Đăng ký</button>
                    </div>
                </form>
            </div>

        </div>
    );
}

Register.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default Register;
