import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getWishlistsByUserId } from '../../services/api/WishList';
import { imageUrl } from '../../services/enviroment';
import { useNavigate } from 'react-router-dom';
import { generateStarElements } from '../../services/elementsUtils';

function WishList({ user }) {
    const [likedVillas, setLikedVillas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const villasPerPage = 6;
    const navigate = useNavigate();

    // Navigate to villa detail page
    const handleShowDetail = (villa) => {
        if (!villa || !villa.name) {
            console.error("Villa data is missing or invalid:", villa);
            return;
        }
        try {
            navigate(`/villa-detail/${villa.name}`, { state: { villa } });
        } catch (error) {
            console.error("Error navigating to villa detail:", error);
        }
    };

    // Fetch liked villas when user or currentPage changes
    useEffect(() => {
        if (user?.id) {
            const fetchLikedVillas = async () => {
                setIsLoading(true);
                try {
                    const { wishlists, totalPages } = await getWishlistsByUserId(user.id, currentPage);
                    const validWishlists = Array.isArray(wishlists)
                        ? wishlists.filter(villa => villa?.name)
                        : [];
                    const sortedVillas = validWishlists.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    setLikedVillas(sortedVillas);
                    setTotalPages(totalPages);
                } catch (err) {
                    setError('Không thể tải danh sách biệt thự yêu thích.');
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchLikedVillas();
        }
    }, [user, currentPage]);

    const handlePageChange = (page) => {
        if (page !== currentPage) setCurrentPage(page);
    };

    const currentVillas = likedVillas.slice(0, villasPerPage);

    return (
        <div className="container" style={{ maxWidth: '1250px' }}>
            <h2 className="text-center mt-4">Villa yêu thích</h2>
            <p>
                Danh sách các biệt thự yêu thích của <strong>{user?.fullName || 'người dùng'}:</strong>
            </p>

            {isLoading ? (
                <p className="text-center">Đang tải...</p>
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : currentVillas.length === 0 ? (
                <p className="text-center">Không có biệt thự yêu thích nào.</p>
            ) : (
                <div className="row">
                    {currentVillas.map((villa) => (
                        <div
                            key={villa.id}
                            className="col-4 mb-4"
                            onClick={() => handleShowDetail(villa)}
                        >
                            <div
                                className="border-primary h-100"
                                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                            >
                                <img
                                    src={villa.imageUrls?.[0] ? `${imageUrl}villa/${villa.imageUrls[0]}` : '/default-placeholder.png'}
                                    className="card-img-top rounded-top"
                                    alt={villa.name || "Unnamed Villa"}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body mt-2">
                                    <h5 className="card-title text-primary fw-bold fs-3">
                                        {villa.name || "Biệt thự chưa có tên"}
                                    </h5>
                                    <p
                                        className="card-text text-secondary mb-2 fs-5"
                                        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    >
                                        {villa.description || 'Mô tả không có sẵn.'}
                                    </p>
                                    <div className="rating-villa mb-2 fs-3">
                                        {generateStarElements(villa.rating)}
                                    </div>
                                    <p className="card-text fw-bold text-danger fs-5">
                                        <span className="text-secondary">Một đêm chỉ: </span>
                                        {villa.listedPrice?.toLocaleString('vi-VN') || "N/A"} VND /1 khách
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <nav className="mt-4">
                <ul className="pagination justify-content-center">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li
                            key={index}
                            className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

WishList.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
    }).isRequired,
};

export default WishList;
