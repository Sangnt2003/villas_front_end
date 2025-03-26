import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchVillasByAddress } from '../../services/api/villa';
import { UserContext } from '../../contexts/UserContext';
import { imageUrl } from '../../services/enviroment';
import '../../styles/VillaCardList.css';
import { generateStarElements } from '../../services/elementsUtils';

const VillaSearchNearby = () => {
    const { userInfo } = useContext(UserContext);
    const [villas, setVillas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const villasPerPage = 4;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNearbyVillas = async () => {
            if (!userInfo || !userInfo.id) {
                return;
            }
            try {
                const data = await searchVillasByAddress(userInfo.id);
                setVillas(data);
            } catch (error) {
                console.error('Failed to fetch nearby villas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNearbyVillas();
    }, [userInfo]);

    const handleShowDetail = (villa) => {
        navigate(`/villa-detail/${villa.id}`, { state: { villa } });
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

    if (loading) return <div>Loading villas...</div>;

    const displayedVillas = villas.slice(currentPage * villasPerPage, (currentPage + 1) * villasPerPage);

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
                        onClick={() => handleShowDetail(villa)}>
                        <img
                            src={`${imageUrl}villa/${villa.imageUrls[0]}`}
                            alt={villa.name}
                            className="villa-card-img" />
                        <div className="mt-2 ms-2">
                            <h4 className="fw-bold">{villa.name}</h4>
                            <p className="fw-bold h6 text-start py-2 text-secondary">
                                <i className="bi bi-geo-alt-fill"></i> {villa.locationName}
                            </p>
                            <div className="d-flex align-items-center mb-2">
                                <div className="villa-card-rating-container text-center me-2">
                                    <div className="fw-bold villa-card-rating">{villa.rating * 2}</div>
                                </div>
                                <div className="emotion-container me-2 fw-bold">
                                    <div>{generateStarElements(villa.rating)}</div>
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
                ))}
            </div>

            <button
                onClick={nextPage}
                hidden={villas.length <= villasPerPage || (currentPage + 1) * villasPerPage >= villas.length}
                className="pagination-btn right-btn">
                <i className="bi bi-chevron-right"></i>
            </button>

        </div>
    );
};

export default VillaSearchNearby;
