import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchVillas } from '../../services/api/villa.jsx';
import { imageUrl } from '../../services/enviroment.jsx';
import { addToWishlist, removeFromWishlist, getWishlistsByUserId } from '../../services/api/WishList.jsx';
import { UserContext } from '../../contexts/UserContext.jsx';
import '../../styles/VillaCardList.css';
import { checkWishList } from '../../services/api/WishList.jsx';
const VillaCardList = () => {
    const { userInfo } = useContext(UserContext); // Get userInfo from context
    const [villas, setVillas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [wishlist, setWishlist] = useState(new Set()); // Use a Set for wishlist items
    const villasPerPage = 4;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVillaData = async () => {
            try {
                const data = await fetchVillas();
                console.log(data);
                setVillas(data);
            } catch (error) {
                console.error('Failed to fetch villas:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchWishlist = async () => {
            if (!userInfo || !userInfo.id) return;
            try {
                const wishlistData = await getWishlistsByUserId(userInfo.id);
                console.log('Fetched wishlist data:', wishlistData);
                if (Array.isArray(wishlistData.wishlists)) {
                    const wishlistSet = new Set(wishlistData.wishlists.map(item => item.villaId)); // Map wishlist items to a Set
                    setWishlist(wishlistSet);
                } else {
                    setWishlist(new Set());
                }
            } catch (error) {
                console.error('Failed to fetch wishlist:', error);
            }
        };

        fetchVillaData();
        fetchWishlist();
    }, [userInfo]);

    const handleShowDetail = (villa) => {
        try {
            navigate(`/villa-detail/${villa.name}`, { state: { villa } });
        } catch (error) {
            console.error("Error navigating to villa details:", error);
        }
    };

    const handleAddToWishlist = async (villa) => {
        if (!userInfo || !userInfo.id) {
            navigate('/login');
            return;
        }

        try {
            const response = await checkWishList(userInfo.id, villa.id);
            console.log("Check Wishlist Response:", response);

            if (response.exists) {
                const wishlistId = response.exists.id;
                const removeResponse = await removeFromWishlist(wishlistId);
                console.log('Villa removed from wishlist:', removeResponse);
                // Remove the villa from the Set
                setWishlist(prevWishlist => {
                    const updatedWishlist = new Set(prevWishlist); // Create a new Set to trigger re-render
                    updatedWishlist.delete(villa.id); // Remove the villa from the Set
                    return updatedWishlist;
                });

            } else {
                // If villa does not exist in the wishlist, add it
                const addResponse = await addToWishlist(userInfo.id, villa.id);
                console.log('Villa added to wishlist:', addResponse);
                // Add the villa to the Set
                setWishlist(prevWishlist => new Set(prevWishlist).add(villa.id)); // Create a new Set to trigger re-render
            }
        } catch (error) {
            console.error('Error handling wishlist:', error);
        }
    };

    const nextPage = () => {
        if ((currentPage + 1) * villasPerPage < villas.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const getEmotion = (rating) => {
        const doubledRating = rating * 2;
        if (doubledRating >= 9) return 'Xuất sắc';
        if (doubledRating >= 7) return 'Tuyệt vời';
        if (doubledRating >= 5) return 'Tốt';
        if (doubledRating >= 3) return 'Dễ chịu';
        return 'Tệ';
    };

    if (loading) return <div>Loading Villas...</div>;

    const displayedVillas = villas.slice(
        currentPage * villasPerPage,
        (currentPage + 1) * villasPerPage
    );

    return (
        <div className="villa-card-list-container">
            <button onClick={prevPage} hidden={currentPage === 0} className="pagination-btn left-btn">
                <i className="bi bi-chevron-left"></i>
            </button>

            <div className="villa-card-list">
                {displayedVillas.map((villa) => (
                    <div
                        key={villa.id}
                        className="villa-card"
                        onClick={() => handleShowDetail(villa)}
                    >
                        <div
                            className="heart-overlay"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToWishlist(villa);
                            }}
                        >
                            <i
                                className={`bi bi-heart${wishlist.has(villa.id) ? '-fill' : ''}`}
                                style={{
                                    color: wishlist.has(villa.id) ? 'red' : 'black'
                                }}
                            ></i>

                        </div>
                        <img
                            src={`${imageUrl}villa/${villa.imageUrls[0]}`}
                            alt={villa.name}
                            className="villa-card-img"
                        />
                        <div className='row'>
                            <div className='mt-2 ms-2 col-6'>
                                <h4 className='fw-bold'>{villa.name}</h4>
                                <p className='fw-bold h6 py-2 text-secondary text-start'>
                                    <i className="bi bi-geo-alt-fill "></i>{villa.locationName}
                                </p>
                                <div className="d-flex align-items-center mb-2">
                                    <div className="villa-card-rating-container text-center me-2">
                                        <div className="fw-bold villa-card-rating">{villa.rating * 2}</div>
                                    </div>
                                    <div className="emotion-container me-2 fw-bold">
                                        <div>{getEmotion(villa.rating)}</div>
                                    </div>
                                    <div className="reviews-container">
                                        <div>60 đánh giá</div>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <div className="">
                                    <div className="promotion py-3">
                                        <span>1 Ngày 1 Đêm | Chỉ với</span>
                                        <span className="price-highlight">{villa.listedPrice.toLocaleString('vi')} VNĐ/khách</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={nextPage}
                disabled={(currentPage + 1) * displayedVillas >= villas.length}
                className="pagination-btn right-btn"
            >
                <i className="bi bi-chevron-right"></i>
            </button>
        </div>
    );
};



export default VillaCardList;
