/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { updatePassword } from '../../services/api/user';
import PropTypes from 'prop-types';

function ResetPassword({ user }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    useEffect(() => {
        if (isUpdated) {
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setUpdateMessage('');
            setErrorMessage('');
            setIsUpdated(false); // Reset the update status
        }
    }, [isUpdated]);

    const handleReset = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Mật khẩu mới và xác nhận không khớp.');
            return;
        }

        setIsLoading(true);

        const token = localStorage.getItem('token');
        const request = {
            currentPassword: oldPassword,
            newPassword,
        };

        try {
            const result = await updatePassword(user.id, request, token);
            setIsLoading(false);

            if (result.success) {
                setUpdateMessage(result.message);
                setErrorMessage('');
                alert('Mật khẩu đã được thay đổi thành công!');
                window.location.reload();
            } else {
                setErrorMessage(`Lỗi: ${result.message}`);
            }
        } catch (error) {
            setIsLoading(false);
            setErrorMessage(error.response?.data?.message || "Đã xảy ra lỗi trong quá trình cập nhật.");
            console.error("Error during password reset:", error);
        }
    };


    return (
        <div>
            {updateMessage && <div className="alert alert-success">{updateMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={(e) => { e.preventDefault(); handleReset(); }} className="bg-light p-4 rounded shadow-sm">
                <h2>Đổi mật khẩu</h2>
                <div className="form-group">
                    <label>Mật khẩu cũ:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Mật khẩu mới:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Xác nhận mật khẩu mới:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-warning w-100" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang cập nhật...
                        </>
                    ) : 'Đổi mật khẩu'}
                </button>
            </form>
        </div>
    );
}

ResetPassword.propTypes = {
    user: PropTypes.object.isRequired,
};

export default ResetPassword;
