/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import userImage from '../../../public/assets/info/avatar-default.jpg';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { updateUserInfo } from '../../services/api/user.jsx';
import { imageUrl } from '../../services/enviroment.jsx';
import '../../styles/MyInfo.css';
import { UserContext } from '../../contexts/UserContext.jsx';
import { useContext } from 'react';
import { getUserInfo } from '../../services/api/user.jsx';
function MyInfo() {
    const { userInfo, setUserInfo } = useContext(UserContext); // Get userInfo from context
    const [fullName, setFullName] = useState(userInfo.fullName || '');
    const [email, setEmail] = useState(userInfo.email || '');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState(userInfo.role || '');
    const [pictureUrl, setPictureUrl] = useState(userInfo.pictureUrl || '');
    const [updateMessage, setUpdateMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState(false);
    useEffect(() => {
        if (userInfo) {
            setFullName(userInfo.fullName || '');
            setEmail(userInfo.email || '');
            setRole(userInfo.role || '');
            setPhoneNumber(userInfo.phoneNumber || '');
            setPictureUrl(userInfo.pictureUrl || '');
            setAddress(userInfo.address || '');
            setBalance(userInfo.balance || '');
        }
    }, [userInfo]);

    const validateFields = () => {
        if (!fullName || !email || !phoneNumber || !address) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return false;
        }
        if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
            alert("Email không hợp lệ.");
            return false;
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            alert("Số điện thoại không hợp lệ.");
            return false;
        }

        return true;
    };
    console.log(userInfo);
    const handleUpdate = async () => {
        if (!validateFields()) return;

        setIsLoading(true);
        const token = localStorage.getItem('token');
        const userUpdateRequest = {
            email,
            fullName,
            pictureUrl,
            phoneNumber,
            address,
            role: Array.isArray(userInfo.roles) ? userInfo.roles[0] : userInfo.role,
        };
        try {
            const result = await updateUserInfo(userInfo.id, userUpdateRequest, token);
            if (result.success) {
                setUpdateMessage(result.message);
                setErrorMessage('');

                localStorage.setItem('token', token);
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                const userId = decodedToken.id || decodedToken.userId;
                if (!userId) throw new Error("Không tìm thấy userId trong token.");

                const userInfo = await getUserInfo(userId, token);

                localStorage.setItem("userInfo", JSON.stringify(userInfo));
                setUserInfo(userInfo);
            } else {
                setErrorMessage(`Lỗi: ${result.message}`);
            }
        } catch (error) {
            setErrorMessage("Đã xảy ra lỗi trong quá trình cập nhật.");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const savedUserInfo = localStorage.getItem('userInfo');
        if (savedUserInfo) {
            setUserInfo(JSON.parse(savedUserInfo));
        }
    }, [setUserInfo]);
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Adds leading zero if day < 10
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based, hence +1)
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <div className="container modal-myinfo py-3 w-100">
            <div className="row g-4">
                <div className="col-md-4 text-center">
                    <h2 className="fw-bold mb-3">Thông tin tài khoản</h2>
                    <div className="user-avatar-container p-3 shadow-sm rounded bg-white">
                        <img
                            src={pictureUrl ? `${imageUrl}user/${pictureUrl}` : userImage}
                            alt="User Avatar"
                            className="img-fluid rounded-circle border border-warning"
                            style={{ width: '150px', height: '150px' }}
                        />
                        <h4 className="mt-3">{fullName}</h4>
                        <p className="text-muted small">Tham gia: {formatDate(userInfo.createdAt)}</p>
                    </div>
                    <div className='mt-4'>
                        <h3 className='fw-bold'><i className="bi bi-wallet"></i>: {userInfo.balance.toLocaleString('vi')} VNĐ</h3>
                    </div>
                </div>

                <div className="col-md-8">
                    {updateMessage && <div className="alert alert-success">{updateMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="bg-light p-4 rounded shadow-sm">
                        <div className="mb-3">
                            <label htmlFor="fullName" className="form-label">Họ và tên:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="phoneNumber" className="form-label">Số điện thoại:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Địa chỉ:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-warning w-100" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Đang cập nhật...
                                </>
                            ) : 'Cập nhật thông tin'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

MyInfo.propTypes = {
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
};

export default MyInfo;
