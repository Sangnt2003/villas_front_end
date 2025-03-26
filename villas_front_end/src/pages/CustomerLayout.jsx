import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomePage from '../pages/Home';
import Search from '../components/search/search.jsx';
import VillaList from '../pages/VillaList';
import VillaDetail from '../components/villa/VillaDetail';
import Booking from '../components/booking/Booking.jsx';
import MainPage from '../components/account/MainPage.jsx';
import { UserContext } from '../contexts/UserContext.jsx';
import MyVilla from '../components/account/MyVilla.jsx';
import MyBooking from '../components/account/MyBooking.jsx';
import WishList from '../components/account/LikeVilla.jsx';
import PaymentCallback from '../components/booking/PaymentCallback.jsx';
import '../styles/CustomerLayout.css';
import AddVillaForm from '../components/admin/Management/villa/Add.jsx';
import NotificationDropdown from '../components/notifi/NotificationDropdown\'.jsx';
import Introduction from './Introduction.jsx';
import ChatBox from '../components/chat/ChatBox.jsx';
function CustomerLayout() {
    const navigate = useNavigate();
    const { userInfo, setUserInfo, logout } = useContext(UserContext);
    const [isMyInfoOpen, setIsMyInfoOpen] = useState(false);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const savedUserInfo = localStorage.getItem("userInfo");
        if (savedUserInfo) {
            const parsedUserInfo = JSON.parse(savedUserInfo);
            setUserInfo(parsedUserInfo);

            if (Array.isArray(parsedUserInfo.roles)) {
                if (parsedUserInfo.roles.includes('Admin')) {
                    navigate('/admin', { replace: true });
                }
            } else if (typeof parsedUserInfo.roles === 'string' && parsedUserInfo.roles.toLowerCase() === 'admin') {
                navigate('/admin', { replace: true });
            }
        }
        setLoading(false);
    }, [setUserInfo, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleMyInfoClick = () => {
        setIsMyInfoOpen(true);
    };

    return (
        <div className="app">
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <Header onMyInfoClick={handleMyInfoClick} />
            <main>
                {!isLoading && (
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/villa-detail/:id" element={<VillaDetail />} />
                        {/* <Route path="/vnpay/create-payment" element={<CreatePayment />} />
                        <Route path="/vnpay/callback" element={<CallbackHandler />} /> */}
                        <Route path="/villa-list" element={<VillaList />} />
                        <Route path="/bookings" element={<Booking />} />
                        <Route path="/payment-callback" element={<PaymentCallback />} />
                        <Route path="/my-villa" element={<MyVilla />} />
                        <Route path="/notification" element={<NotificationDropdown />} />
                        <Route path="/introduction" element={<Introduction />} />
                        <Route
                            path="/wishlist"
                            element={
                                userInfo ? (
                                    <WishList user={userInfo} />
                                ) : (
                                    <div>Please log in to view your wishlist.</div>
                                )
                            }
                        />
                        <Route
                            path="/add-villa"
                            element={
                                userInfo ? (
                                    <AddVillaForm user={userInfo} />
                                ) : (
                                    <div>Please log in to view your wishlist.</div>
                                )
                            }
                        />
                        <Route
                            path="/my-booking"
                            element={
                                userInfo ? (
                                    <MyBooking user={userInfo} />
                                ) : (
                                    <div>Please log in to view your bookings.</div>
                                )
                            }
                        />

                        <Route
                            path="/account"
                            element={
                                userInfo ? (
                                    <MainPage user={userInfo} onLogout={handleLogout} />
                                ) : (
                                    <div>Loading user information...</div>
                                )
                            }
                        />
                    </Routes>
                )}

            </main>
            <ChatBox user={userInfo} />
            <Footer />
            {isMyInfoOpen && (
                <div className="overlay">
                    <MainPage
                        user={userInfo}
                        onLogout={handleLogout}
                        onClose={() => setIsMyInfoOpen(false)}
                    />
                </div>
            )}
        </div>
    );
}

export default CustomerLayout;
