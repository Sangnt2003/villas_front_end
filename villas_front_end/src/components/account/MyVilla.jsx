/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { getAllVillaByUserId, getVilla } from '../../services/api/villa';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { imageUrl } from '../../services/enviroment';
import AddVillaForm from '../admin/Management/villa/Add';
import '../../styles/MyVilla.css';
function MyVilla() {
    const navigate = useNavigate();
    const { userInfo } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [villas, setVillas] = useState([]); // Danh sách biệt thự
    const [pageNumber, setPageNumber] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAddVillaForm, setShowAddVillaForm] = useState(false);
    const fetchVillas = async () => {
        try {
            const response = await getAllVillaByUserId(userInfo.id, currentPage);
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

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const openModal = () => {
        setIsModalOpen(true);
    };

    const handleAddVillaClick = () => {
        if (userInfo) {
            setShowAddVillaForm(true);  // Mở form thêm Villa
        } else {
            alert("Vui lòng đăng nhập để đăng Villa!");
            navigate("/login");
        }
    };

    const handleCloseAddVillaForm = () => {
        setShowAddVillaForm(false);  // Đóng form khi thêm thành công
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    // Function to show villa details
    const handleShowDetail = async (villaId) => {
        try {
            const villaData = await getVilla(villaId);
            navigate(`/villa-detail/${villaData.name}`, { state: { villa: villaData } });
        } catch (error) {
            console.error("Error fetching villa data:", error);
            // You can set an error state here if needed
        }
    };

    if (!Array.isArray(villas) || villas.length === 0) {
        return <p>Bạn không sở hữu biệt thự nào.</p>;
    }
    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'status-pending';
            case 'Approved':
                return 'status-approved';
            case 'Rejected':
                return 'status-rejected';
            default:
                return '';
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case 'Pending':
                return 'Đang chờ';
            case 'Approved':
                return 'Đã duyệt';
            case 'Rejected':
                return 'Bị từ chối';
            default:
                return status;
        }
    };
    return (
        <div>
            <p className='h3'>Danh sách Villa thuộc quyền sở hữu của <strong>{userInfo.fullName}</strong></p>
            <div className='text-end'>
                <button className="btn btn-warning mb-3 px-5 text-end" onClick={handleAddVillaClick}>
                    Thêm Villa
                </button>
            </div>
            {showAddVillaForm && <AddVillaForm onClose={handleCloseAddVillaForm} />}
            <div>
                <ul className="p-0">
                    {villas.map((villa) => (
                        <div onClick={() => handleShowDetail(villa.id)} className="p-2 m-1 items-villa row" key={villa.id}>
                            <div className="col-2 p-0">
                                {villa.imageUrls.slice(0, 1).map((url, index) => (
                                    <img
                                        key={index}
                                        src={`${imageUrl}villa/${url}`}
                                        alt={`Ảnh ${index + 1} của ${villa.name}`}
                                        style={{
                                            width: "100%",
                                            height: "200px",
                                            objectFit: "cover",
                                            border: "1px solid #ddd",
                                            marginRight: "2px",
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="col-7">
                                <div className="w-100">
                                    <h3 className="fw-bold villa-name">{villa.name}</h3>
                                    <p>Địa chỉ: {villa.address}</p>
                                    <p>Số điện thoại: {villa.phoneNumber}</p>
                                    <p className=''>Số người: {villa.capacity}</p>
                                    <p className='fw-bold text-danger fs-5'>Giá: {villa.pricePerNight.toLocaleString('vi-VN')} VNĐ</p>
                                </div>
                            </div>
                            <div className='col-3'>
                                <p className={getStatusClass(villa.approvalStatus)}>{getStatusText(villa.approvalStatus)}</p>
                            </div>
                        </div>
                    ))}
                </ul>
            </div>
            <div style={{ marginTop: "20px" }}>
                <span style={{ margin: "0 10px" }}>
                    Trang {pageNumber} / {totalPages}
                </span>
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
        </div>
    );
}

export default MyVilla;
