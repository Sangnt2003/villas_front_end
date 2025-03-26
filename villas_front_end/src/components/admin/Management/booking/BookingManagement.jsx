/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import { useState, useEffect } from "react";
import { GetAllBookings } from "../../../../services/api/Booking";
import "../../../../styles/BookingManagement.css";

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // Hàm chuyển đổi trạng thái
    const getApprovalStatusLabel = (status) => {
        switch (status) {
            case 0:
                return "Đang chờ";
            case 1:
                return "Đã thanh toán";
            case 2:
                return "Lỗi";
            case 3:
                return "Hủy";
            default:
                return "Unknown";
        }
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await GetAllBookings(currentPage);
                if (response && Array.isArray(response.bookings) && response.bookings.length) {
                    setBookings(response.bookings);
                    setTotalPages(response.totalPages);
                } else {
                    console.error("Invalid data format:", response);
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchBookings();
    }, [currentPage]); // Re-fetch data when currentPage changes

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update the current page
    };

    return (
        <div className="">
            <h1 className="fw-bold my-5 text-center">Quản Lý Đặt Villa</h1>
            {Array.isArray(bookings) && bookings.length > 0 ? (
                <div>
                    <table className="table table-bordered">
                        <thead className="table-primary">
                            <tr className="text-center">
                                <th className="col-2">Họ và tên</th>
                                <th className="col-2">Tên Villa</th>
                                <th className="col-2">Ngày Check-in</th>
                                <th className="col-2">Ngày Check-out</th>
                                <th className="col-2">Tổng tiền</th>
                                <th className="col-2">Tình trạng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.bookingId} className="text-center">
                                    <td>{booking.fullName}</td>
                                    <td>{booking.villaName}</td>
                                    <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                                    <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                                    <td>{booking.totalPrice.toLocaleString()} VND</td>
                                    <td>{getApprovalStatusLabel(booking.approvalStatus)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination Controls */}
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`btn ${page === currentPage ? "btn-primary" : "btn-secondary"} mx-1`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <p>No bookings available</p>
            )}
        </div>
    );
};

export default BookingManagement;
