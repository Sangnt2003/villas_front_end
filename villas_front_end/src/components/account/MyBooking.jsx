/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getBookingsByUserId, cancelBooking } from '../../services/api/booking';
import Review from '../review/Review';

function MyBooking({ user }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelling, setCancelling] = useState(false);  // Trạng thái khi đang hủy booking
    const [cancelError, setCancelError] = useState(null);  // Lỗi khi hủy booking

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await getBookingsByUserId(user.id);
                setBookings(data.bookings);
            } catch (err) {
                setError("Không thể tải danh sách đơn đặt.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    const handleCancelBooking = async (bookingId) => {
        try {
            setCancelling(true);
            setCancelError(null);  // Reset lỗi trước khi gọi API
            const token = "user-token";  // Lấy token của người dùng đã đăng nhập
            const result = await cancelBooking(bookingId, token);  // Gọi API hủy booking

            // Cập nhật lại danh sách đơn đặt sau khi hủy
            setBookings((prevBookings) => prevBookings.filter((booking) => booking.bookingId !== bookingId));
            alert("Đặt phòng đã được hủy và hoàn tiền.");
        } catch (error) {
            setCancelError("Hủy đặt thất bại. Vui lòng thử lại.");
        } finally {
            setCancelling(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Đơn đặt của tôi</h2>
            <h4 className='mb-4'>Hiển thị danh sách các đơn đặt của <strong>{user.fullName}</strong></h4>

            {loading && (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Đang tải...</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {cancelError && (
                <div className="alert alert-danger" role="alert">
                    {cancelError}
                </div>
            )}

            {!loading && !error && bookings.length === 0 && (
                <div className="alert alert-info" role="alert">
                    Không có đơn đặt nào.
                </div>
            )}

            {!loading && !error && bookings.length > 0 && (
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Tên Villa</th>
                            <th>Ngày đặt</th>
                            <th>Ngày nhận</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái duyệt</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.bookingId}>
                                <td>{booking.villaName}</td>
                                <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                                <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPrice)}</td>
                                <td>{booking.approvalStatus === 0 ? 'Chưa thanh toán' : booking.approvalStatus === 1 ? 'Đã thanh toán' : 'Đã hoàn thành'}</td>
                                <td>
                                    <Review bookingId={booking.bookingId} villaName={booking.villaName} />
                                </td>
                                <td>
                                    {/* Kiểm tra approvalStatus để quyết định hiển thị nút hủy */}
                                    {booking.approvalStatus === 1 && (
                                        <button
                                            className="bg-danger"
                                            onClick={() => handleCancelBooking(booking.bookingId)}
                                            disabled={cancelling}
                                        >
                                            {cancelling ? 'Đang hủy...' : 'Hủy đặt villa'}
                                        </button>
                                    )}
                                    {booking.approvalStatus === 2 && (
                                        <span className="text-muted">Không thể hủy vì đã hoàn thành.</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

MyBooking.propTypes = {
    user: PropTypes.object.isRequired, // Thông tin người dùng
}

export default MyBooking;
