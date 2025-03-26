/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import React, { useState, useEffect } from "react";
import { getAllService, deleteService } from "../../../../services/api/Service";
import "../../../../styles/VillaManagement.css";
import ConfirmDeleteModal from "./ConfirmDeleteServices";

const ServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);

    // Helper function to fetch services
    const fetchServices = async () => {
        try {
            const response = await getAllService(currentPage); // Pass currentPage to API
            if (response && Array.isArray(response.services)) {
                setServices(response.services);
                setTotalPages(response.totalPages || 0);
            } else {
                console.error("Invalid data format:", response);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    // Fetch services when the component mounts or when the page changes
    useEffect(() => {
        fetchServices();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update the current page
    };

    const handleDeleteClick = (serviceId) => {
        setSelectedServiceId(serviceId);
        setIsConfirmModalOpen(true);
    };

    const handleModalClose = () => {
        setIsConfirmModalOpen(false);
        setSelectedServiceId(null);
    };

    const handleModalConfirm = async () => {
        try {
            await deleteService(selectedServiceId);
            setIsConfirmModalOpen(false);
            setSelectedServiceId(null);
            fetchServices(); // Re-fetch updated services after deletion
        } catch (error) {
            console.error("Failed to delete service:", error);
        }
    };

    return (
        <div className="mt-4">
            <h1 className="fw-bold my-5 text-center">Quản Lý Dịch Vụ</h1>
            {services.length > 0 ? (
                <div>
                    <table className="table table-bordered">
                        <thead className="table-primary">
                            <tr className="text-center">
                                <th className="col-2">Tên</th>
                                <th className="col-5">Mô tả</th>
                                <th className="col-1">Giá</th>
                                <th>Xử lý</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service.id} className="items">

                                    <td>{service.name}</td>
                                    <td>{service.description}</td>
                                    <td>{service.price} VNĐ</td>
                                    <td className="g-1">
                                        <button className="btn p-0 me-2" title="Chỉnh sửa">
                                            <i className="bi bi-pencil-square text-primary fs-4"></i>
                                        </button>
                                        <button className="btn p-0 me-2" title="Chi tiết giảm giá">
                                            <i className="bi bi-ticket-detailed text-success fs-4"></i>
                                        </button>
                                        <button
                                            className="btn p-0"
                                            title="Xóa"
                                            onClick={() => handleDeleteClick(service.id)}
                                        >
                                            <i className="bi bi-trash3 text-danger fs-4"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination Controls */}
                    <div className="pagination d-flex justify-content-center">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`btn mx-1 ${page === currentPage ? "btn-primary" : "btn-secondary"
                                    }`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <p>No services available</p>
            )}
            {/* Confirm Delete Modal */}
            {isConfirmModalOpen && (
                <ConfirmDeleteModal
                    show={isConfirmModalOpen}
                    serviceId={selectedServiceId}
                    onClose={handleModalClose}
                    onConfirm={handleModalConfirm}
                />
            )}
        </div>
    );
};

export default ServiceManagement;
