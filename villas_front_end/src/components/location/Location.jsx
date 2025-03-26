import { useEffect, useState } from 'react';
import Select from 'react-select';  // Import react-select
import { fetchLocations } from '../../services/api.jsx';
import PropTypes from 'prop-types';
import '../../styles/Location.css';
import { imageUrl } from '../../services/enviroment.jsx';
const Location = ({ onSelectLocation }) => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getLocations = async () => {
            try {
                const data = await fetchLocations();
                setLocations(data);
            } catch (error) {
                console.error("Failed to fetch locations:", error);
            } finally {
                setLoading(false);
            }
        };

        getLocations();
    }, []);

    if (loading) {
        return <div>Loading locations...</div>;
    }

    const locationOptions = locations.map((location) => ({
        value: location.id,
        label: (
            <div className="custom-option">
                <img
                    src={`${imageUrl}${location.imageUrl}`}
                    alt={location.name}
                    className="custom-option-img"
                />
                <span className="custom-option-text">{location.name}</span>
            </div>
        ),
    }));

    return (
        <Select
            options={locationOptions}
            onChange={(selectedOption) => onSelectLocation(selectedOption.value)}
            placeholder="Chọn vị trí"
            className="location-select"
            isSearchable
        />
    );
};

Location.propTypes = {
    onSelectLocation: PropTypes.func.isRequired,
};

export default Location;
