import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import '../../styles/SideBar.css';
import { imageUrl } from "../../services/enviroment";

const Sidebar = ({ onLogout, onMyInfoClick }) => {
    const navigate = useNavigate();
    const { userInfo } = useContext(UserContext); // Get userInfo from context
    const handleLogout = () => {
        onLogout(); // Handle logout
        navigate("/"); // Navigate to the home page after logout
    };

    const handleVillaClick = () => navigate("/admin/villas"); // Navigate to villas management
    const handleUserClick = () => navigate("/admin/users"); // Navigate to users management
    const handleLocationClick = () => navigate("/admin/locations"); // Navigate to locations management
    const handleServiceClick = () => navigate("/admin/services"); // Navigate to services management
    const handleBookingClick = () => navigate("/admin/bookings"); // Navigate to booking management

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap position-fixed">
                <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark w-100">
                    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">

                        {/* Centering the avatar */}
                        <div className="d-flex justify-content-center align-items-center w-100 my-5 " style={{ height: '200px' }}>
                            <button onClick={onMyInfoClick} className="btn border-0 d-flex align-items-center text-white text-decoration-none mb-2">
                                {userInfo && userInfo.pictureUrl ? (
                                    <img
                                        src={`${imageUrl}user/${userInfo.pictureUrl}`}
                                        alt={`${userInfo.fullName}'s Avatar`}
                                        style={{ width: "200px", height: "200px" }}
                                        className="rounded-circle"
                                    />
                                ) : (
                                    <span>No Image</span>
                                )}
                            </button>
                        </div>

                        {/* Sidebar menu items */}
                        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                            <li className="nav-item">
                                <a href="/admin/" className="nav-link nav-link-sidebar align-middle px-0 fs-4">
                                    <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Trang chủ</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link nav-link-sidebar align-middle px-0 fs-4" onClick={handleUserClick}>
                                    <i className="fs-4 bi-person"></i> <span className="ms-1 d-none d-sm-inline">Quản Lý Người Dùng</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link nav-link-sidebar align-middle px-0 fs-4" onClick={handleVillaClick}>
                                    <i className="fs-4 bi-house-door"></i> <span className="ms-1 d-none d-sm-inline">Quản Lý Villa</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link nav-link-sidebar align-middle px-0 fs-4" onClick={handleLocationClick}>
                                    <i className="fs-4 bi-geo-alt"></i> <span className="ms-1 d-none d-sm-inline">Quản Lý Khu Vực</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link nav-link-sidebar align-middle px-0 fs-4" onClick={handleServiceClick}>
                                    <i className="fs-4 bi-tools"></i> <span className="ms-1 d-none d-sm-inline">Quản Lý Dịch Vụ</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link nav-link-sidebar align-middle px-0 fs-4" onClick={handleBookingClick}>
                                    <i className="fs-4 bi-bookmark-check"></i> <span className="ms-1 d-none d-sm-inline">Quản Lý Đặt Villa</span>
                                </a>
                            </li>
                        </ul>

                        {/* User info and logout */}
                        <div className="mt-auto mb-2 w-100 ">
                            {userInfo && (
                                <div className="nav-item">
                                    <a
                                        className="nav-link nav-link-sidebar align-middle px-0 fs-4"
                                        onClick={handleLogout}
                                    >
                                        <i className="fs-4 bi-box-arrow-right me-2"></i> {/* Logout icon */}
                                        Đăng xuất
                                    </a>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                <div className="col py-3">
                    {/* Main content goes here */}
                </div>
            </div>
        </div >


    );
};

Sidebar.propTypes = {
    onLogout: PropTypes.func.isRequired,
    onMyInfoClick: PropTypes.func.isRequired,
};

export default Sidebar;
