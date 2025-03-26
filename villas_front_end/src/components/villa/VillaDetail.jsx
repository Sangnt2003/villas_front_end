import { bookVilla } from "../../services/api/Booking.jsx";
import { imageUrl } from '../../services/enviroment.jsx'; // Đảm bảo imageUrl được sử dụng đúng
import { useLocation } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import Booking from '../booking/Booking.jsx';
import '../../styles/VillaDetail.css';
import { generateStarElements } from '../../services/elementsUtils.jsx';
import { villaServiceIcons } from "./VillaServiceIcons.jsx";
import { getReviewsByVillaId } from "../../services/api/Review.jsx";
import Review from "../review/Review.jsx";

const VillaDetail = () => {
    const location = useLocation();
    const { userInfo } = useContext(UserContext);
    const { villa } = location.state || {};
    const [mainImage, setMainImage] = useState(villa?.imageUrls ? `${imageUrl}villa/${villa.imageUrls[0]}` : '');
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    console.log(reviews);
    useEffect(() => {
        if (villa && villa.imageUrls && villa.imageUrls.length > 0) {
            setMainImage(`${imageUrl}villa/${villa.imageUrls[0]}`);
        }
        const fetchReviews = async () => {
            try {
                const fetchedReviews = await getReviewsByVillaId(villa.id); // Giả sử bạn có API để lấy reviews theo villa.id
                setReviews(fetchedReviews);
            } catch (error) {
                setError(error.message || "Không thể tải đánh giá.");
            }
        };
        if (villa && villa.id) {
            fetchReviews();
        }
    }, [villa, villa.id]);

    if (!villa) {
        return <p className="error-message">Không có dữ liệu chi tiết.</p>; // Xử lý trường hợp không có dữ liệu
    }
    const handleShowBookingForm = () => setShowBookingForm(true);
    const handleCancelBooking = () => setShowBookingForm(false);
    const defaultUser = {
        id: '',
        fullName: '',
        email: '',
        phoneNumber: '',
    };

    const handleBookingSubmit = async (bookingData) => {
        try {
            const token = localStorage.getItem("token");
            const result = await bookVilla(bookingData, token);
            alert(`Đặt phòng thành công! ${result.message}`);
            handleCancelBooking();
        } catch (error) {
            setError(error.message || "Đặt phòng thất bại. Vui lòng thử lại.");
        }
    };

    const renderServiceIcon = (service) => {
        return villaServiceIcons[service] || null;
    };

    const isOwner = userInfo?.id === villa.userId;
    return (
        <div className="card-detail">
            <div className="villa-detail">
                <div className="row header-villa-detail align-items-center mb-4">
                    <div className="col-md-8">
                        <h1 className="villa-title">{villa.name} ❤️</h1>
                        <div className="rating">
                            <span className="fs-3">{generateStarElements(villa.rating)}</span>
                            <span> | 767 đánh giá</span>
                        </div>
                        <div className="address-villa">
                            <i className="bi fs-4 bi-geo-alt-fill text-danger"></i> {villa.address}
                        </div>
                    </div>
                    <div className="col-md-4 text-end">
                        <span>Giá chỉ từ </span>
                        <p className="price m-0">{villa.listedPrice.toLocaleString('vi-VN')} VNĐ</p>
                        <button
                            className="btn booking-btn"
                            onClick={handleShowBookingForm}
                            disabled={isOwner}
                        >
                            Đặt ngay
                        </button>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-md-8">
                        <div className="main-image">
                            <img src={mainImage} alt={villa.name} width={1045} height={785} />
                            <div className="promotion py-3 fs-4">
                                <span>1 Ngày 1 Đêm | Giá tốt chỉ với</span>
                                <span className="price-highlight">{villa.listedPrice.toLocaleString('vi')} VNĐ/khách</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 position-relative">
                        <div className="villa-review">
                            <h4>Đánh giá của khách hàng</h4>
                            {reviews.length > 0 ? (
                                reviews.slice(0, 5).map((review, index) => (
                                    <div className="review-item border-bottom mt-4" key={index}>
                                        <div className="review-author">
                                            <strong>{userInfo.fullName}</strong>
                                            <span> | {new Date(review.createdAt).toLocaleString('vi-VN', { hour12: false })}</span>
                                        </div>
                                        <div className="review-rating p-0">
                                            {generateStarElements(review.rating)}
                                        </div>
                                        <p className="m-1">{review.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p>Chưa có đánh giá nào.</p>
                            )}
                        </div>

                        <a
                            className={`position-absolute bottom-0 start-0 w-100 bg-primary rounded ${isOwner ? 'disabled-link' : ''}`}
                            style={isOwner ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                        >
                            <Review villaId={villa.id} villaName={villa.name} />
                        </a>
                    </div>
                    <div className="gallery mt-3 row">
                        {villa.imageUrls.slice(0, 7).map((image, index) => (
                            <div className="col-2" key={index}>
                                <img
                                    src={`${imageUrl}villa/${image}`}
                                    alt={`Gallery Image ${index + 1}`}
                                    onClick={() => setMainImage(`${imageUrl}villa/${image}`)}
                                    style={{ height: '180px', width: '240px' }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="container my-4 villa-description">
                        <div className="row">
                            <div className="col-12">
                                <h4 className="villa-description-title">Trải nghiệm phải thử ở {villa.name}</h4>
                                {villa.description?.split('\n').map((paragraph, index) => {
                                    const trimmedParagraph = paragraph.trim();
                                    if (trimmedParagraph) {
                                        return (
                                            <p key={index} className="description-paragraph">
                                                {trimmedParagraph}
                                            </p>
                                        );
                                    }
                                    return null; // Bỏ qua đoạn trống
                                })}
                                <p className="description-paragraph">Các vị khách đã từng ở đây và họ đã cho <strong>{villa.rating * 2} điểm</strong> về chất lượng dịch vụ</p>
                            </div>
                        </div>
                    </div>

                    {villa.villaServices && villa.villaServices.length > 0 && (
                        <div className="villa-services mt-4">
                            <h4 className="services-title">Dịch vụ tại villa</h4>
                            <div className="row">
                                {villa.villaServices.map((service, index) => (
                                    <div className="col-3" key={index}>
                                        <div className="service-item text-center">
                                            {/* Hiển thị icon và tên dịch vụ */}
                                            <div className="service-icon">
                                                {renderServiceIcon(service)}
                                            </div>
                                            <div className="service-name">
                                                <span>{service}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Booking Form */}
                {showBookingForm && (
                    <Booking
                        villa={villa}
                        user={userInfo || defaultUser}
                        onSubmit={handleBookingSubmit}
                        onCancel={handleCancelBooking}
                    />
                )}

                {/* Error Message */}
                {error && <p className="error-message">{error}</p>}
            </div>
        </div >
    );
};

export default VillaDetail;
