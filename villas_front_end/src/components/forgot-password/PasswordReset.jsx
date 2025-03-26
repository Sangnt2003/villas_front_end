import { useState } from "react";
import axios from "axios";
import PropTypes from 'prop-types';
function PasswordReset({ onResetComplete, onClose }) {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handleRequestResetCode = async () => {
        setLoading(true);
        setMessage("");
        try {
            const response = await axios.post("https://localhost:44325/api/account/request-reset-code", { email });
            setMessage(response.data.Message);
            setStep(2);
        } catch (error) {
            setMessage(error.response?.data?.Message || "Có lỗi xảy ra. Kiểm tra lại email.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyResetCode = async () => {
        setLoading(true);
        setMessage("");
        try {
            const response = await axios.post("https://localhost:44325/api/account/verify-reset-code", { email, code });
            setMessage(response.data.Message);

            const newPasswordResponse = await axios.post("https://localhost:44325/api/account/generate-new-password", { email });
            setMessage(newPasswordResponse.data.Message);
            alert('Chúng tôi đã gửi mật khẩu mới về mail của bạn!');
            onResetComplete();
        } catch (error) {
            setMessage(error.response?.data?.Message || "Mã xác thực không hợp lệ hoặc không thể tạo mật khẩu mới.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" d-flex justify-content-center w-100 ">
            <div className="col-md-6 col-lg-4 p-4 rounded shadow bg-white" style={{ border: 'solid 2px', width: '600px', backgroundColor: 'white', minHeight: '450px' }}>
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
                {step === 1 && (
                    <div className="card p-4 shadow-sm w-100">
                        <h3>Bước 1: Yêu Cầu Mã Xác Thực</h3>
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Nhập email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            className="btn btn-primary w-100"
                            onClick={handleRequestResetCode}
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Yêu Cầu Mã Xác Thực"}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="card p-4 shadow-sm mt-4 w-100">
                        <h3>Bước 2: Nhập Mã Xác Thực</h3>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập mã xác thực"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                        <button
                            className="btn btn-success w-100"
                            onClick={handleVerifyResetCode}
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Xác Thực Mã"}
                        </button>
                    </div>
                )}

                {message && (
                    <div className={`alert mt-4 ${message.includes('thành công') ? 'alert-success' : 'alert-danger'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>

    );
}

PasswordReset.propTypes = {
    onResetComplete: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default PasswordReset;
