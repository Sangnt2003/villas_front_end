/* eslint-disable no-unused-vars */
import "../styles/FilterPanel.css";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { fetchLocationWithVilla } from "../services/api/Location";
import Slider from "rc-slider"; // Cần cài đặt rc-slider
import "rc-slider/assets/index.css"; // Thêm CSS cho slider
import '../styles/FilterPanel.css'; // Thêm CSS cho slider'
import { useVillaContext } from "../contexts/VillaContext";
const FilterPanel = () => {
    const { filters, setFilters } = useVillaContext();
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const locationData = await fetchLocationWithVilla();
                setLocations(locationData);
            } catch (error) {
                setError("Failed to load data");
            }
        };
        loadData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle slider value change
    const handleSliderChange = (value, name) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    return (
        <div className="filter-panel">
            {/* Bộ lọc Hạng sao */}
            <h3>Hạng sao</h3>
            <div className="rating-slider-container">
                <label>
                    Hạng sao: {filters.Rating || 1} sao
                </label>
                <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={filters.Rating || 1}
                    onChange={(value) => handleSliderChange(value, "Rating")}
                    trackStyle={{ backgroundColor: '#2DBE60' }}
                    handleStyle={{
                        borderColor: '#2DBE60',
                        backgroundColor: '#2DBE60',
                    }}
                    railStyle={{ backgroundColor: '#d3d3d3' }}
                />
            </div>

            {/* Bộ lọc Khu vực */}
            <h3>Khu vực</h3>
            <div className="col-md-6 m-0 py-1 w-100">
                <select
                    name="LocationId"
                    className="rounded-3 form-select ip-data w-100"
                    required
                    value={filters.LocationId || ""}
                    onChange={handleFilterChange}
                >
                    <option value="">Vị trí</option>
                    {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                            {location.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Bộ lọc Giá */}
            <h3>Giá</h3>
            <div className="price-filters">
                <div className="slider-container">
                    <label>
                        Giá tối thiểu: {filters.MinPrice || 0} VNĐ
                    </label>
                    <Slider
                        min={0}
                        max={1000000}
                        step={50000}
                        value={filters.MinPrice || 0}
                        onChange={(value) => handleSliderChange(value, "MinPrice")}
                    />
                </div>
                <div className="slider-container">
                    <label>
                        Giá tối đa: {filters.MaxPrice || 1000000} VNĐ
                    </label>
                    <Slider
                        min={0}
                        max={10000000}
                        step={50000}
                        value={filters.MaxPrice || 1000000}
                        onChange={(value) => handleSliderChange(value, "MaxPrice")}
                    />
                </div>
            </div>

            {/* Bộ lọc Sức chứa */}
            <h3>Sức chứa</h3>
            <div className="capacity-filter">
                <div className="slider-container">
                    <label>
                        Sức chứa: {filters.Capacity || 0} người
                    </label>
                    <Slider
                        min={0}
                        max={20}
                        value={filters.Capacity || 0}
                        onChange={(value) => handleSliderChange(value, "Capacity")}
                    />
                </div>
            </div>

            {/* Bộ lọc Ngày */}
            <h3>Ngày</h3>
            <div className="date-filters">
                <input
                    type="date"
                    name="StartDate"
                    value={filters.StartDate || ""}
                    onChange={handleFilterChange}
                    className="form-control"
                />
                <input
                    type="date"
                    name="EndDate"
                    value={filters.EndDate || ""}
                    onChange={handleFilterChange}
                    className="form-control"
                />
            </div>

            {/* Lỗi hiển thị nếu có */}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};
export default FilterPanel;
