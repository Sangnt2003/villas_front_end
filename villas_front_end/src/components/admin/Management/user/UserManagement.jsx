import { useState, useEffect } from "react";
import { getAllUser } from "../../../../services/api/user";
import { imageUrl } from "../../../../services/enviroment";
import '../../../../styles/Manager.css'
const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(0); // Total number of pages
    const [currentPage, setCurrentPage] = useState(1); // Current page

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUser(currentPage); // Pass the current page to API
                if (response && Array.isArray(response.users)) {
                    setUsers(response.users);
                    setTotalPages(response.totalPages);
                } else {
                    console.error("Invalid data format:", response);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, [currentPage]); // Re-fetch data when currentPage changes

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update the current page
    };

    return (
        <div>
            <h1 className="fw-bold my-5 text-center">Quản Lý Người Dùng</h1>
            {Array.isArray(users) && users.length > 0 ? (
                <div>
                    <table className="table table-bordered">
                        <thead className="table-primary text-center">
                            <tr>
                                <th>Ảnh đại diện</th>
                                <th>Email</th>
                                <th>Họ và tên</th>
                                <th>Địa chỉ</th>
                                <th>Số điện thoại</th>
                                <th>Vai trò</th>
                                <th>Ngày tạo</th>
                                <th>Ngày cập nhật gần nhất</th>
                                <th>Xử lý</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="items">
                                    <td>
                                        {user.pictureUrl ? (
                                            <img
                                                src={`${imageUrl}user/${user.pictureUrl}`}
                                                alt={`${user.fullName}'s Avatar`}
                                                style={{ width: "50px", borderRadius: "50%" }}
                                            />
                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.fullName}</td>
                                    <td style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '200px' // Adjust max width if needed
                                    }}>
                                        {user.address}
                                    </td>
                                    <td>{user.phoneNumber}</td>
                                    <td>{user.roles}</td>
                                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                                    <td>{new Date(user.updatedAt).toLocaleString()}</td>
                                    <td className="g-1">
                                        <button className="btn  p-0 me-2" title="Chỉnh sửa">
                                            <i className="bi bi-pencil-square text-primary fs-2"></i>
                                        </button>
                                        <button className="btn p-0 me-2" title="Chi tiết giảm giá">
                                            <i className="bi bi-ticket-detailed text-success fs-2"></i>
                                        </button>
                                        <button
                                            className="btn p-0"
                                            title="Xóa"
                                        // onClick={() => handleDeleteClick(location.id)}>
                                        ><i className="bi bi-trash3 text-danger fs-2"></i>
                                        </button>
                                        {/* {isConfirmModalOpen && (
                                            <ConfirmDeleteLocation
                                                show={isConfirmModalOpen} // Kiểm soát hiển thị
                                                villaId={selectedLocationId} // Truyền ID villa để xóa
                                                onClose={handleModalClose} // Hàm đóng modal
                                                onConfirm={handleModalConfirm} // Hàm xử lý xác nhận xóa
                                            />
                                        )} */}
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
                <p>No users available</p>
            )}
        </div>
    );
};

export default UserManagement;
