// Search.jsx
import { useState } from 'react';
import { searchVilla } from '../../services/api/villa';
import Location from '../location/location.jsx';
import './search.css';

const Search = () => {
    const [locationId, setLocationId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [capacity, setCapacity] = useState(1);
    const [villas, setVillas] = useState([]);

    const handleSearch = async () => {
        if (!locationId || !startDate || !endDate || !capacity) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        try {
            const results = await searchVilla(locationId, startDate, endDate, capacity);
            setVillas(results);
        } catch (error) {
            console.error("Search Error:", error);
        }
    };

    return (
        <div className="search-container">
            <h2>Tìm kiếm Villa</h2>
            <div className="search-form">
                <div>
                    <Location onSelectLocation={setLocationId} />
                </div>

                <div>
                    <label>Ngày bắt đầu:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div>
                    <label>Ngày kết thúc:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div>
                    <label>Số người:</label>
                    <input
                        type="number"
                        min="1"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="search-input"
                    />
                </div>

                <button onClick={handleSearch} className="search-button">
                    Tìm kiếm
                </button>
            </div>

            {villas.length > 0 && (
                <ul className="villa-list">
                    {villas.map((villa) => (
                        <li key={villa.id}>{villa.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Search;
