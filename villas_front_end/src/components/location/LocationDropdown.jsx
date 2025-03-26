import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { fetchLocationWithVilla } from '../../services/api/Location.jsx';
import { searchVilla } from '../../services/api/villa';
import '../../styles/LocationDropdown.css';

const LocationDropdown = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
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

    if (loading) return <div>Loading locations...</div>;

    return (
        <div className="location-dropdown-container">
            <select
                className="location-select"
                onChange={(e) => handleSearch(e.target.value)}
            >
                <option value="">Chọn tỉnh thành</option>
                {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                        {location.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

LocationDropdown.propTypes = {
    toggleDropdown: PropTypes.func.isRequired,
    dropdownOpen: PropTypes.bool.isRequired,
};

export default LocationDropdown;
