/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { DateRange } from 'react-date-range';
import PropTypes from 'prop-types';
import { format, parseISO, addDays } from 'date-fns';
import Select from 'react-select'; // Import react-select
import { vi } from 'date-fns/locale';
import { searchVilla } from '../../services/api/villa';
import { imageUrl } from '../../services/enviroment.jsx';
import { fetchLocationWithVilla } from '../../services/api/Location.jsx';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './search.css';

export let searchParams = {};

export const Search = ({ size, initialFilters = {} }) => {

    const navigate = useNavigate();
    const [locationId, setLocationId] = useState(initialFilters.locationId || '');
    const [dateRange, setDateRange] = useState([{
        startDate: initialFilters.startDate || new Date(),
        endDate: initialFilters.endDate || addDays(new Date(), 1),
        key: 'selection',
    }]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [capacity, setCapacity] = useState(initialFilters.capacity || 2);
    const [villas, setVillas] = useState([]);
    const dateRangeRef = useRef(null);

    // Close date picker when clicking outside
    const handleClickOutside = (event) => {
        if (dateRangeRef.current && !dateRangeRef.current.contains(event.target)) {
            setShowDatePicker(false);
        }
    };

    const extractSearchParams = () => {
        const params = new URLSearchParams(window.location.search);
        const locationId = params.get('locationId');
        const startDateParam = params.get('startDate');
        const endDateParam = params.get('endDate');
        const capacity = parseInt(params.get('capacity'), 10) || 2;

        let startDate = new Date();
        let endDate = addDays(startDate, 1);

        if (startDateParam) {
            try {
                startDate = startDateParam ? new Date(startDateParam) : new Date();

            } catch (error) {
                console.error('Invalid startDate:', error);
            }
        }

        if (endDateParam) {
            try {
                endDate = parseISO(endDateParam);
            } catch (error) {
                console.error('Invalid endDate:', error);
            }
        }

        searchParams = { locationId, startDate, endDate, capacity };
        return { locationId, startDate, endDate, capacity };
    };

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
    }, [initialFilters]);

    useEffect(() => {
        if (showDatePicker) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showDatePicker]);

    const handleCapacityChange = (type) => {
        setCapacity((prev) => (type === 'increment' ? prev + 1 : Math.max(1, prev - 1)));
    };
    const formatDate = (date) => {
        if (!(date instanceof Date) || isNaN(date)) {
            console.error("Invalid date passed to formatDate:", date);
            return 'Invalid Date'; // Hoặc giá trị mặc định khác
        }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleSearch = async (locId = locationId, start = null, end = null, cap = capacity) => {
        const isValidDate = (date) => date instanceof Date && !isNaN(date);

        const startDate = isValidDate(start) ? start : dateRange[0].startDate;
        const endDate = isValidDate(end) ? end : dateRange[0].endDate;

        if (!locId || !startDate || !endDate || !cap) {
            alert('Vui lòng nhập đầy đủ thông tin.');
            return;
        }


        // Format the dates if they're valid
        const startFormatted = formatDate(startDate);
        const endFormatted = formatDate(endDate);
        const searchParams = new URLSearchParams({ locationId: locId, startDate: startFormatted, endDate: endFormatted, capacity: cap }).toString();
        // console.log('searchParams', searchParams);
        try {
            const results = await searchVilla(locId, startFormatted, endFormatted, cap);
            // console.log('Search results:', results);

            if (results.length === 0) {
                alert('Không tìm thấy villa với thông tin bạn đã chọn.');
            } else {
                setVillas(results);
                navigate('/villa-list', {
                    state: {
                        villas: results,
                        searchParams: { locationId: locId, startDate: startFormatted, endDate: endFormatted, capacity: cap },
                    },
                });

                // console.log('Navigate state:', { villas: results, searchParams: { locationId: locId, startDate: startFormatted, endDate: endFormatted, capacity: cap } });
            }
        } catch (error) {
            console.error('Search Error:', error);
        }
    };


    if (loading) return <div>Loading locations...</div>;
    const locationOptions = locations.map((location) => ({
        value: location.id,
        label: (
            <div className="custom-option">
                <img src={`${imageUrl}location/${location.imageUrl}`} className="custom-option-img" alt="location" />
                <span className="custom-option-text">{location.name}</span>
            </div>
        ),
    }));

    const formClass = size === 'large' ? 'search-form-large' : 'search-form-small';
    const toggleDatePicker = (e) => {
        e.stopPropagation();
        setShowDatePicker((prev) => !prev);
    };

    return (
        <div className='w-100'>
            <div className={`search-form ${formClass}`}>
                <div className="d-flex justify-content-center w-100">
                    <Select
                        options={locationOptions}
                        onChange={(selectedOption) => setLocationId(selectedOption.value)}
                        placeholder="Bạn muốn đi đâu?"
                        classNamePrefix="custom-select"
                    />
                </div>

                <div className="w-100 row">
                    <div className="form-item date-input col-6" style={{ padding: 0 }}>
                        <div
                            className="date-display fw-bold d-flex align-items-center justify-content-center"
                            onClick={toggleDatePicker}
                        >
                            <div className="d-flex flex-column align-items-center mx-5">
                                <div className="fs-5 fw-bold">{dateRange[0].startDate ? formatDate(dateRange[0].startDate, 'dd MMMM', { locale: vi }) : 'Ngày nhận'}</div>
                                <div className="small text-secondary">{dateRange[0].startDate ? formatDate(dateRange[0].startDate, 'EEEE', { locale: vi }) : ''}</div>
                            </div>

                            <div className="mx-2 fs-5 text-muted">1<i className="bi bi-moon"></i></div>

                            <div className="d-flex flex-column align-items-center mx-5">
                                <div className="fs-5 fw-bold">{dateRange[0].endDate ? formatDate(dateRange[0].endDate, 'dd MMMM', { locale: vi }) : 'Ngày trả'}</div>
                                <div className="small text-secondary">{dateRange[0].endDate ? formatDate(dateRange[0].endDate, 'EEEE', { locale: vi }) : ''}</div>
                            </div>
                        </div>
                    </div>

                    <div className="form-item col-4">
                        <div className="input-group h-100">
                            <button onClick={() => handleCapacityChange('decrement')} className="btn py-4 z-0">-</button>
                            <input type="text" readOnly value={`Số người: ${capacity}`} className="h-100 form-control input-capacity" />
                            <button onClick={() => handleCapacityChange('increment')} className="btn py-4 z-0">+</button>
                        </div>
                    </div>
                    <button onClick={() => handleSearch()} className="btn-search py-4 col-2">Tìm kiếm</button>
                </div>
            </div>

            {showDatePicker && (
                <div className="date-range-wrapper" ref={dateRangeRef}>
                    <DateRange
                        editableDateInputs
                        onChange={(item) => {
                            let { startDate, endDate } = item.selection;
                            if (endDate <= startDate) {
                                endDate = addDays(startDate, 1);
                            }

                            setDateRange([{
                                startDate,
                                endDate,
                                key: 'selection',
                            }]);
                        }}
                        ranges={dateRange}
                        locale={vi}
                        minDate={new Date()}
                        firstDayOfWeek={1}
                        months={2}
                        direction="horizontal"
                        showDateDisplay={false}
                        weekdayDisplayFormat="EEEEEE"
                    />
                </div>
            )}
        </div>
    );
};

Search.propTypes = {
    size: PropTypes.string,
    initialFilters: PropTypes.object,
};

export default Search;
