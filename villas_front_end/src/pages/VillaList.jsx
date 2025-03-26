/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import VillaCard from '../components/villa/VillaCard';
import Search from '../components/search/search';
import FilterPanel from '../components/FilterPanel';
import '../styles/VillaList.css';
import { fetchFilteredVillas, searchVilla } from '../services/api/villa';
import { useVillaContext } from '../contexts/VillaContext';

export const VillaList = () => {
    const location = useLocation();
    const { search, setSearchParams, filters, villas, setVillas, selectedVilla, setSelectedVilla } = useVillaContext();

    const [currentPage, setCurrentPage] = useState(1);
    const villasPerPage = 5;

    const loadSearchVillas = async () => {
        if (!search.locationId || !search.startDate || !search.endDate || !search.capacity) {
            console.error("Missing search parameters:", search);
            return;
        }

        try {
            const fetchedVillas = await searchVilla(search);
            const filteredVillas = fetchedVillas.filter(villa => villa.locationId === search.locationId);
            setVillas(filteredVillas);
            setCurrentPage(1); // Reset to first page on new search
        } catch (error) {
            console.error('Lỗi khi tải villa:', error);
        }
    };

    const loadFilteredVillas = async () => {
        try {
            const fetchedVillas = await fetchFilteredVillas(filters);
            setVillas(fetchedVillas);
            setCurrentPage(1);
        } catch (error) {
            console.error('Lỗi khi tải villa:', error);
        }
    };

    useEffect(() => {
        const storedData = localStorage.getItem('villaSearch');
        if (storedData) {
            const { searchParams, searchResults } = JSON.parse(storedData);
            setSearchParams(searchParams);
            setVillas(searchResults);
        } else if (location.state) {
            if (location.state.searchParams) setSearchParams(location.state.searchParams);
            if (location.state.villas) setVillas(location.state.villas);
        } else {
            console.warn('No search data found.');
        }
    }, [location.state, setSearchParams, setVillas]);

    useEffect(() => {
        if (!villas || villas.length === 0) {
            if (Object.keys(search).length > 0) {
                loadSearchVillas();
            }
        }
    }, [search, villas, loadSearchVillas]);


    useEffect(() => {
        if (Object.keys(filters).length > 0) {
            loadFilteredVillas();
        }
    }, [filters]);

    const handleShowBookingForm = (villa) => {
        setSelectedVilla(villa);
    };

    const handleCancelBooking = () => {
        setSelectedVilla(null);
    };

    // Pagination logic
    const totalPages = Math.ceil(villas.length / villasPerPage);
    const paginatedVillas = villas.slice(
        (currentPage - 1) * villasPerPage,
        currentPage * villasPerPage
    );

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className="villa-list-page pb-5 d-flex justify-content-center">
            <div style={{ width: '90%' }}>
                <div className="search-villas">
                    <Search size="large" initialFilters={search} />
                </div>
                <h1>Danh sách Villa</h1>
                <div className="row">
                    <div className="filter-villas col-3">
                        <FilterPanel />
                    </div>
                    <div className="data-villas col-9">
                        {paginatedVillas.length > 0 ? (
                            paginatedVillas.map((villa) => (
                                <VillaCard
                                    key={villa.id}
                                    villa={villa}
                                    showBookingForm={selectedVilla?.id === villa.id}
                                    onShowBookingForm={handleShowBookingForm}
                                    onCancelBooking={handleCancelBooking}
                                />
                            ))
                        ) : (
                            <div className="no-results-message">
                                <p>Chúng tôi không tìm thấy villa phù hợp với tiêu chí của bạn. Vui lòng thử lại với bộ lọc khác.</p>
                            </div>
                        )}
                        {(villas.length > 5) && (
                            <div className="pagination-controls mt-4">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="btn btn-primary me-2"
                                >
                                    Trang trước
                                </button>
                                <span>Trang {currentPage} / {totalPages}</span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="btn btn-primary ms-2"
                                >
                                    Trang sau
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default VillaList;
