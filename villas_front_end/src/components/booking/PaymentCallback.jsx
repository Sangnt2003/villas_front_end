import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createNotification } from '../../services/api/Notification';
import '../../styles/PaymentCallbackPage.css'; // Import CSS file

const PaymentCallbackPage = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const success = query.get('success') === 'true';
    const message = query.get('message');
    const paymentMethod = query.get('paymentMethod');
    const orderDescription = query.get('orderDescription');
    const orderId = query.get('orderId');
    const transactionId = query.get('transactionId');
    const totalAmount = query.get('totalAmount');
    const villaOwnerAmount = query.get('villaOwnerAmount');
    const platformFee = query.get('platformFee');
    const villaOwnerId = query.get('villaOwnerId');

    const [notificationSent, setNotificationSent] = useState(false);

    const handleNotification = async () => {
        const notificationRequest = {
            villaOwnerId: villaOwnerId,
            title: 'Villa của bạn đã được đặt',
            message: `Mã giao dịch: ${transactionId}`,
        };

        try {
            // Send the notification
            await createNotification(notificationRequest);
            console.log('Notification sent to villa owner');
            setNotificationSent(true);  // Ensure notificationSent is set to true after sending
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    // Trigger notification on successful payment only once
    useEffect(() => {
        if (success && !notificationSent) {
            handleNotification();
            setNotificationSent(true);
        }
    }, [success, notificationSent]);

    return (
        <div className={`payment-container ${success ? 'success' : 'failure'}`}>
            {success ? (
                <div className="success-message">
                    <h1>Thanh toán thành công</h1>
                    <p>Phương thức thanh toán: {paymentMethod}</p>
                    <p>Đơn hàng: {orderDescription}</p>
                    <p>Mã đơn hàng: {orderId}</p>
                    <p>Mã giao dịch: {transactionId}</p>
                    <p>Tổng tiền: {totalAmount}</p>
                    <p>Số tiền chủ villa nhận: {villaOwnerAmount}</p>
                    <p>Phí nền tảng: {platformFee}</p>
                </div>
            ) : (
                <div className="failure-message">
                    <h1>Thanh toán thất bại</h1>
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
};

export default PaymentCallbackPage;
