/* eslint-disable no-debugger */
import { useState, useEffect } from "react";
import { imageUrl } from "../../../../services/enviroment";
import { getAllVilla, updateApprove, deleteVilla } from "../../../../services/api/villa";
import ConfirmDeleteVilla from "./ConfirmDeleteVilla";
import '../../../../styles/VillaManagement.css'
const VillaManagement = () => {
    const [villas, setVillas] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedVillaId, setSelectedVillaId] = useState(null);

    const fetchVillas = async () => {
        try {
            const response = await getAllVilla(currentPage);
            if (response && Array.isArray(response.villas)) {
                setVillas(response.villas);
                setTotalPages(response.totalPages);
            } else {
                console.error("Invalid data format:", response);
            }
        } catch (error) {
            console.error("Error fetching villas:", error);
        }
    };

    useEffect(() => {
        fetchVillas();
    }, [currentPage]);

    const handleDeleteClick = (villaId) => {
        setSelectedVillaId(villaId);
        setIsConfirmModalOpen(true);
    };

    const handleModalClose = () => {
        setIsConfirmModalOpen(false);
        setSelectedVillaId(null);
    };
    const handleModalConfirm = async () => {
        try {
            await deleteVilla(selectedVillaId);
            setIsConfirmModalOpen(false);
            setSelectedVillaId(null);
            await fetchVillas(); // Gọi lại API để tải dữ liệu mới
        } catch (error) {
            console.error("Failed to delete villa:", error);
        }
    };
    const handleStatusChange = async (villaId, newStatus) => {
        const statusMap = {
            "Pending": 0,
            "Approved": 1,
            "Rejected": 2
        };

        const statusValue = statusMap[newStatus]; // Lấy giá trị số tương ứng
        try {
            const response = await updateApprove(villaId, statusValue); // Gửi giá trị số
            if (response === 200) {
                await fetchVillas();
            } else {
                console.error("Failed to update status.");
            }
        } catch (error) {
            console.error("Error updating villa status:", error);
        }
    };



    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // const openModal = () => {
    //     setIsModalOpen(true);
    // };

    // const closeModal = () => {
    //     setIsModalOpen(false);
    // };

    return (
        <div>
            <h1 className="fw-bold my-5 text-center">Quản lý Villa</h1>
            {Array.isArray(villas) && villas.length > 0 ? (
                <div>
                    <table className="table table-bordered table-hover text-center align-middle">
                        <thead className="table-primary">
                            <tr>
                                <th>Ảnh</th>
                                <th>Tên villa</th>
                                <th>Địa chỉ</th>
                                <th>Giá (VND)</th>
                                <th>Số người tối đa</th>
                                <th>Bao gồm</th>
                                <th>Tình trạng</th>
                                <th>Xử lý</th>

                            </tr>
                        </thead>
                        <tbody>
                            {villas.map((villa) => (
                                <tr key={villa.id}>
                                    <td className="p-1">
                                        <div className="d-flex justify-content-center">
                                            {villa.imageUrls.slice(0, 2).map((url, index) => (
                                                <img
                                                    key={index}
                                                    src={`${imageUrl}villa/${url}`}
                                                    alt={`Ảnh ${index + 1} của ${villa.name}`}
                                                    className="rounded p-0"
                                                    style={{
                                                        width: "130px",
                                                        height: "130px",
                                                        objectFit: "cover",
                                                        marginRight: "5px",
                                                        border: "1px solid #ddd",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td>{villa.name}</td>
                                    <td
                                        style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            maxWidth: "150px",
                                        }}
                                        title={villa.address}
                                    >
                                        {villa.address}
                                    </td>
                                    <td>
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(villa.pricePerNight)}
                                    </td>
                                    <td>{villa.capacity}</td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            {villa.villaServices.slice(0, 3).map((service, index) => (
                                                <p key={index} className="m-0">{service}{index < Math.min(3, villa.villaServices.length - 1) ? ', ' : ''}</p>
                                            ))}
                                            {villa.villaServices.length > 4 && <span>...</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <select
                                            className={`status-button ${villa.approvalStatus.toLowerCase()}`}
                                            value={villa.approvalStatus}
                                            onChange={(e) => handleStatusChange(villa.id, e.target.value)}
                                        >
                                            <option style={{ color: "green", fontWeight: 'bold' }} value="Pending">Chờ duyệt</option>
                                            <option style={{ color: "orange", fontWeight: 'bold' }} value="Approved">Đã Duyệt</option>
                                            <option style={{ color: "red", fontWeight: 'bold' }} value="Rejected">Từ chối</option>
                                        </select>
                                    </td>

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
                                            onClick={() => handleDeleteClick(villa.id)}
                                        >
                                            <i className="bi bi-trash3 text-danger fs-4"></i>
                                        </button>
                                        {isConfirmModalOpen && (
                                            <ConfirmDeleteVilla
                                                show={isConfirmModalOpen} // Kiểm soát hiển thị
                                                villaId={selectedVillaId} // Truyền ID villa để xóa
                                                onClose={handleModalClose} // Hàm đóng modal
                                                onConfirm={handleModalConfirm} // Hàm xử lý xác nhận xóa
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

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
                <p>No villas available</p>
            )}
        </div>
    );
};

export default VillaManagement;
