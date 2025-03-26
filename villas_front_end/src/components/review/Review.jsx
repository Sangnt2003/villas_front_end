/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useContext, useEffect } from "react";
import { addReview } from "../../services/api/Review";
import { getBookingById } from "../../services/api/booking";
import { UserContext } from "../../contexts/UserContext";
import "../../styles/Review.css";

export const Review = ({ villaId, bookingId, villaName }) => {
    const { userInfo } = useContext(UserContext);
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [resolvedVillaId, setResolvedVillaId] = useState(villaId);

    useEffect(() => {
        if (bookingId && !villaId) {
            const fetchBooking = async () => {
                try {
                    const booking = await getBookingById(bookingId);
                    setResolvedVillaId(booking.villaId);
                } catch (err) {
                    setError("Không thể lấy thông tin đặt phòng.");
                }
            };
            fetchBooking();
        }
    }, [bookingId, villaId]);

    const handleOpenForm = () => {
        setShowForm(true);
        setError(null);
        setSuccessMessage(null);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!resolvedVillaId) {
            setError("Không có villaId để gửi đánh giá.");
            return;
        }

        try {
            const reviewRequest = {
                villaId: resolvedVillaId, // Sử dụng villaId đã giải quyết
                userId: userInfo.id,
                rating,
                comment,
                preCmtId: 0,
            };

            await addReview(reviewRequest);
            setSuccessMessage("Đánh giá thành công!");
            setShowForm(false);
        } catch (err) {
            setError(err.message || "Có lỗi xảy ra!");
        }
    };

    return (
        <div>
            {!showForm ? (
                <button
                    href="#"
                    className="btn text-warning w-100"
                    onClick={handleOpenForm}
                >
                    Đánh giá <i className="bi bi-chat-right-heart-fill"></i>
                </button>
            ) : (
                <div className="review-overlay">
                    <div className="review-popup">
                        <form onSubmit={handleSubmit}>
                            <h3 className="text-center fw-bold">Đánh giá {villaName}</h3>
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            {successMessage && (
                                <p style={{ color: "green" }}>{successMessage}</p>
                            )}
                            <div className="mb-3">
                                <label>Đánh giá (1- 5) sao:</label>
                                <div className="rating-stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <i
                                            key={star}
                                            className={`bi ${rating >= star ? "bi-star-fill text-warning" : "bi-star text-muted"}`}
                                            onClick={() => setRating(star)}
                                        ></i>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="comment">Nội dung đánh giá:</label>
                                <textarea
                                    id="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    maxLength="1000"
                                    className="form-control"
                                    required
                                ></textarea>
                            </div>
                            <div className="d-flex justify-content-between">
                                <button type="submit" className="btn btn-submit bg-warning p-2">
                                    Gửi đánh giá
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-cancel bg-secondary p-2"
                                    onClick={handleCloseForm}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Review;
