/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import '../../styles/Booking.css';
import { searchParams } from '../search/search';
import { bookVilla } from '../../services/api/booking';

export const Booking = ({ villa, onSubmit, onCancel }) => {
    const userFromStorage = (() => {
        if (typeof localStorage === 'undefined') return {};
        try {
            return JSON.parse(localStorage.getItem('userInfo')) || {};
        } catch (e) {
            console.error('Lỗi khi phân tích JSON từ localStorage:', e);
            return {};
        }
    })();

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [bookingData, setBookingData] = useState({
        checkInDate: today.toISOString().split('T')[0],
        checkOutDate: tomorrow.toISOString().split('T')[0],
        checkInHour: '14',
        userId: userFromStorage.id || '',
        villaId: villa?.id || '',
        fullName: userFromStorage.fullName || '',
        approvalStatus: 0,
        email: userFromStorage.email || '',
        phoneNumber: userFromStorage.phoneNumber || '',
        paymentMethod: 'Thanh Toán VnPay',
        capacity: 1,
        totalPrice: 0,
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // 'en-CA' outputs yyyy-mm-dd
    };

    useEffect(() => {
        setBookingData((prev) => ({
            ...prev,
            checkInDate: searchParams?.startDate ? formatDate(searchParams.startDate) : prev.checkInDate,
            checkOutDate: searchParams?.endDate ? formatDate(searchParams.endDate) : prev.checkOutDate,
            capacity: searchParams?.capacity || prev.capacity,
        }));
    }, [searchParams]);

    useEffect(() => {
        if (bookingData.checkInDate && bookingData.checkOutDate && villa?.listedPrice) {
            const checkInDate = new Date(bookingData.checkInDate);
            const checkOutDate = new Date(bookingData.checkOutDate);
            const diffDays = Math.max(0, (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
            const totalPrice = diffDays * villa.listedPrice * bookingData.capacity;

            if (totalPrice !== bookingData.totalPrice) {
                setBookingData((prev) => ({
                    ...prev,
                    totalPrice,
                }));
            }
        }
    }, [bookingData.checkInDate, bookingData.checkOutDate, bookingData.capacity, villa?.listedPrice]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingData({ ...bookingData, [name]: value });
    };

    const validateForm = () => {
        const { checkInDate, checkOutDate, capacity } = bookingData;
        const errors = {};
        if (!checkInDate || isNaN(new Date(checkInDate).getTime())) {
            errors.checkInDate = 'Vui lòng chọn ngày nhận phòng hợp lệ.';
        }
        if (!checkOutDate || isNaN(new Date(checkOutDate).getTime())) {
            errors.checkOutDate = 'Vui lòng chọn ngày trả phòng hợp lệ.';
        }
        if (new Date(checkInDate) >= new Date(checkOutDate)) {
            errors.dateRange = 'Ngày nhận phòng phải trước ngày trả phòng.';
        }
        if (capacity < 1) {
            errors.capacity = 'Số khách phải lớn hơn hoặc bằng 1.';
        }
        setError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleBooking = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await bookVilla(bookingData, token);
            if (response?.paymentUrl) {
                window.location.href = response.paymentUrl;
            } else if (response) {
                onSubmit?.(response);
            } else {
                throw new Error('Phản hồi API không đúng.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đã xảy ra lỗi không mong muốn.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    return (
        <div className="booking-form-overlay">
            <div className="booking-form">
                <h2 className="fw-bold">{villa.fullName}</h2>
                <div className="form-group">
                    <label>Ngày nhận phòng:</label>
                    <input
                        type="date"
                        className="form-control"
                        name="checkInDate"
                        value={bookingData.checkInDate}
                        onChange={handleInputChange}
                        min={today.toISOString().split('T')[0]} // Disable past dates
                    />
                </div>
                <div className="form-group">
                    <label>Ngày trả phòng:</label>
                    <input
                        type="date"
                        className="form-control"
                        name="checkOutDate"
                        value={bookingData.checkOutDate}
                        onChange={handleInputChange}
                        min={today.toISOString().split('T')[0]} // Disable past dates
                    />
                    {error?.dateRange && <p className="text-danger">{error.dateRange}</p>}
                </div>
                <div className="form-group">
                    <label>Số khách:</label>
                    <input
                        type="number"
                        className="form-control"
                        name="capacity"
                        value={bookingData.capacity}
                        min="1"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Giờ nhận phòng:</label>
                    <select
                        className="form-control"
                        name="checkInHour"
                        value={bookingData.checkInHour}
                        onChange={handleInputChange}
                    >
                        <option value="14">14:00</option>
                        <option value="15">15:00</option>
                        <option value="16">16:00</option>
                        <option value="17">17:00</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Họ và tên:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="fullName"
                        value={bookingData.fullName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Số điện thoại:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="phoneNumber"
                        value={bookingData.phoneNumber}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={bookingData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Tổng giá tiền:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formatCurrency(bookingData.totalPrice)}
                        readOnly
                    />
                </div>

                <div className="d-flex justify-content-between">
                    <button className="btn btn-primary" onClick={handleBooking} disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                    <button className="btn btn-secondary" onClick={onCancel}>
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Booking;
