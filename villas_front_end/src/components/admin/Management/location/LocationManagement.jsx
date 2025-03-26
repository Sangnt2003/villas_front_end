/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import { useState, useEffect } from "react";
import { imageUrl } from "../../../../services/enviroment";
import { getAllLocation, deleteLocation, fetchLocations } from "../../../../services/api/Location";
import '../../../../styles/VillaManagement.css';
import ConfirmDeleteModal from "../villa/ConfirmDeleteVilla";
import AddLocation from "./Add";

const LocationManagement = () => {
    const [locations, setLocations] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false); // State to manage AddLocation modal

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await getAllLocation(currentPage); // Pass the current page to API

                if (response && Array.isArray(response.locations) && response.locations.length) {
                    setLocations(response.locations);
                    setTotalPages(response.totalPages);
                } else {
                    console.error("Invalid data format:", response);
                }
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };

        fetchLocations();
    }, [currentPage]); // Re-fetch data when currentPage changes

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update the current page
    };

    const handleDeleteClick = (locationId) => {
        setSelectedLocationId(locationId);
        setIsConfirmModalOpen(true);
    };

    const handleModalClose = () => {
        setIsConfirmModalOpen(false);
        setSelectedLocationId(null);
    };

    const handleModalConfirm = async () => {
        try {
            await deleteLocation(selectedLocationId);
            setIsConfirmModalOpen(false);
            setSelectedLocationId(null);
            await fetchLocations(); // Gọi lại API để tải dữ liệu mới
        } catch (error) {
            console.error("Failed to delete location:", error);
        }
    };

    const openAddLocationModal = () => {
        setIsAddLocationModalOpen(true); // Open Add Location Modal
    };

    const closeAddLocationModal = () => {
        setIsAddLocationModalOpen(false); // Close Add Location Modal
    };

    return (
        <div className="">
            <h1 className="fw-bold my-5 text-center">Quản Lý Khu Vực</h1>
            <div className="text-center mb-4">
                <button className="btn btn-primary" onClick={openAddLocationModal}>Thêm Khu Vực</button>
            </div>
            {Array.isArray(locations) && locations.length > 0 ? (
                <div>
                    <table className="table table-bordered">
                        <thead className="table-primary">
                            <tr className="text-center">
                                <th className="col-2">Ảnh</th>
                                <th className="col-1">Tên</th>
                                <th className="col-5">Mô tả</th>
                                <th className="col-1">Số lượng Villa</th>
                                <th>Xử lý</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.map((location) => (
                                <tr key={location.id} className="text-center items">
                                    <td>
                                        {location.imageUrl ? (
                                            <img
                                                src={`${imageUrl}location/${location.imageUrl}`}
                                                alt={`${location.name}'s Avatar`}
                                                style={{ width: '200px', height: '200px' }}
                                            />
                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </td>
                                    <td>{location.name}</td>
                                    <td>{location.description}</td>
                                    <td>{location.totalVilla}</td>
                                    <td className="g-1">
                                        <button className="btn p-0 me-2" title="Chỉnh sửa">
                                            <i className="bi bi-pencil-square text-primary fs-2"></i>
                                        </button>
                                        <button className="btn p-0 me-2" title="Chi tiết giảm giá">
                                            <i className="bi bi-ticket-detailed text-success fs-2"></i>
                                        </button>
                                        <button
                                            className="btn p-0"
                                            title="Xóa"
                                            onClick={() => handleDeleteClick(location.id)}
                                        >
                                            <i className="bi bi-trash3 text-danger fs-2"></i>
                                        </button>
                                        {isConfirmModalOpen && (
                                            <ConfirmDeleteModal
                                                show={isConfirmModalOpen} // Kiểm soát hiển thị
                                                locationId={selectedLocationId} // Truyền ID location để xóa
                                                onClose={handleModalClose} // Hàm đóng modal
                                                onConfirm={handleModalConfirm} // Hàm xử lý xác nhận xóa
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination Controls */}
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`btn ${page === currentPage ? "btn-primary" : "btn-secondary"} mx-1`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <p>No locations available</p>
            )}

            {/* Add Location Modal */}
            {isAddLocationModalOpen && (
                <AddLocation
                    onClose={closeAddLocationModal} // Close modal handler
                />
            )}

        </div>
    );
};

export default LocationManagement;
