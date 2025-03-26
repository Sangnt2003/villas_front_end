/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import axios from 'axios';

import { API_BASE_URL } from '../enviroment';

export const fetchPaymentDetails = async (searchParams) => {
    try {
        const query = Object.fromEntries(searchParams.entries());
        const response = await axios.get(`${API_BASE_URL}/booking/payment-callback`, { params: query });
        return response.data.paymentResponse;
    } catch (error) {
        throw new Error("Thanh toán thất bại. Vui lòng thử lại.");
    }
};
export const cancelBooking = async (bookingId, token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/booking/cancel-booking/${bookingId}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error cancelling booking:", error?.response?.data || error.message);
        throw error;
    }
};

export const bookVilla = async (bookingData, token) => {

    try {
        const response = await axios.post(
            `${API_BASE_URL}/booking/create-booking`,
            bookingData,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error booking villa:", error?.response?.data || error.message);
        throw error;
    }
};

export const handlePaymentCallback = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/booking/payment-callback`);
        return response.data;
    } catch (error) {
        console.error("Error handling payment callback:", error);
        throw error;
    }
};
export const GetAllBookings = async (pageNumber = 1) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/booking/all?pageNumber=${pageNumber}`);
        return response.data;
    } catch (error) {
        console.error("Location Fetch Error:", error.response?.data || error.message);
        throw error;
    }
};
export const refundToOwner = async (token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/booking/refund-to-owner`,  // Địa chỉ API hoàn tiền
            {},
            {
                headers: { Authorization: `Bearer ${token}` }, // Gửi token xác thực nếu cần
            }
        );
        return response.data;  // Dữ liệu trả về từ API
    } catch (error) {
        console.error("Error processing refund to owner:", error?.response?.data || error.message);
        throw error;  // Ném lỗi để xử lý bên ngoài
    }
};

// API để lấy thông tin booking theo ID
export const getBookingById = async (bookingId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/booking/${bookingId}`);
        return response.data;
    } catch (error) {
        console.error("Error getting booking by ID:", error);
        throw error;
    }
};

// API để lấy danh sách booking theo user ID
export const getBookingsByUserId = async (userId, pageNumber = 1, pageSize = 3) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/booking/bookings/${userId}`, {
            params: { pageNumber, pageSize },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting bookings by user ID:", error);
        throw error;
    }
};
export default bookVilla;