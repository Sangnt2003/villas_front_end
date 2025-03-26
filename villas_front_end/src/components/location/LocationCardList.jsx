import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { fetchLocationWithVilla } from '../../services/api/Location.jsx';
import { searchVilla } from '../../services/api/villa';
import { imageUrl } from '../../services/enviroment.jsx';
import '../../styles/LocationCardList.css'; // Ensure CSS is present

const LocationCardList = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0); // Current page
    const locationsPerPage = 4; // Locations per page
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const data = await fetchLocationWithVilla();
                setLocations(data);
            } catch (error) {
                console.error('Failed to fetch locations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocationData();
    }, []);

    const handleSearch = async (locationId) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        const startDate = formatDate(today);
        const endDate = formatDate(tomorrow);
        const capacity = 1;
        try {
            const results = await searchVilla(locationId, startDate, endDate, capacity);

            if (results.length === 0) {
                alert('Không tìm thấy Villa ở tỉnh này');
            } else {
                navigate('/villa-list', {
                    state: {
                        villas: results,
                        searchParams: { locationId, startDate, endDate, capacity }
                    },
                });
            }
        } catch (error) {
            console.error('Error during villa search:', error);
        }
    };

    const nextPage = () => {
        if ((currentPage + 1) * locationsPerPage < locations.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) return <div>Loading locations...</div>;

    const filteredLocations = locations.filter(location => location.totalBooking > 0);

    const displayedLocations = filteredLocations.slice(
        currentPage * locationsPerPage,
        (currentPage + 1) * locationsPerPage
    );

    return (
        <div className="location-card-list-container">
            <button onClick={prevPage} hidden={currentPage === 0} className="pagination-btn left-btn">
                <i className="bi bi-chevron-left"></i>
            </button>

            <div className="location-card-list">
                {displayedLocations.map((location) => (
                    <div
                        key={location.id}
                        className="location-card"
                        onClick={() => handleSearch(location.id)}
                    >
                        <img
                            src={`${imageUrl}location/${location.imageUrl}`}
                            alt={location.name}
                            className="location-card-img"
                        />
                        <div className="location-card-info py-3 mx-2">
                            <div className="location-stats d-flex justify-content-between">
                                {/* Total Villas */}
                                <div className="d-flex align-items-center fs-5">
                                    <i className="bi bi-house-door-fill me-2"></i>
                                    <span>{location.totalVilla} Villa</span>
                                </div>
                                <div className="d-flex align-items-center fs-5">
                                    <i className="bi bi-bookmark-check-fill me-2"></i>
                                    <span>{location.totalBooking} Lượt đến  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={nextPage}
                disabled={(currentPage + 1) * locationsPerPage >= filteredLocations.length}
                className="pagination-btn right-btn"
            >
                <i className="bi bi-chevron-right"></i>
            </button>
        </div>
    );
};

LocationCardList.propTypes = {
    onSearch: PropTypes.func,
};

export default LocationCardList;
