/* eslint-disable no-unused-vars */
import { Routes, Route } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Sidebar from "../components/admin/SideBar";
import Header from "../components/admin/Header";
import Dashboard from "../components/admin/Dashboard";
import VillaManagement from "../components/admin/Management/villa/VillaManagement";
import LocationManagement from "../components/admin/Management/location/LocationManagement";
import UserManagement from "../components/admin/Management/user/UserManagement";
import ServiceManagement from "../components/admin/Management/servicemanager/ServiceManagement";
import MyInfo from "../components/account/MyAccount";
import { useNavigate } from "react-router-dom";
import '../styles/AdminLayout.css';
import { UserContext } from "../contexts/UserContext";
import ScrollToTop from "../components/wrapper/ScrollToTop";
import BookingManagement from "../components/admin/Management/booking/BookingManagement";

function AdminLayout() {
    const navigate = useNavigate();
    const { userInfo, setUserInfo, logout } = useContext(UserContext);
    const [isMyInfoOpen, setIsMyInfoOpen] = useState(false);

    useEffect(() => {
        const savedUserInfo = localStorage.getItem("userInfo");
        if (savedUserInfo) {
            setUserInfo(JSON.parse(savedUserInfo));
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleMyInfoClick = () => {
        setIsMyInfoOpen(true);
    };

    const handleCloseMyInfo = () => {
        setIsMyInfoOpen(false);
    };

    return (
        <div className="d-flex">
            <div className="col-2">
                <Sidebar
                    userInfo={userInfo}
                    onLogout={handleLogout}
                    onMyInfoClick={handleMyInfoClick}
                />
            </div>
            <div className="flex-grow-1 ms-4 mb-2">
                <main className="container-fluid">
                    <ScrollToTop /> {/* ScrollToTop component should be inside here */}
                    <Header />
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/villas" element={<VillaManagement />} />
                        <Route path="/locations" element={<LocationManagement />} />
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/services" element={<ServiceManagement />} />
                        <Route path="/bookings" element={<BookingManagement />} />
                    </Routes>
                </main>
            </div>
            {/* Modal MyInfo */}
            {isMyInfoOpen && (
                <div className="info-model" onClick={handleCloseMyInfo}>
                    <div className="info-model-content" onClick={(e) => e.stopPropagation()}>
                        <MyInfo
                            user={userInfo}
                            onClose={handleCloseMyInfo}
                            onLogout={handleLogout}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminLayout;
