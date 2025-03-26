/* eslint-disable no-debugger */
import axios from 'axios';
import { API_BASE_URL } from '../enviroment';
export const registerUser = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/account/register`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Đăng ký không thành công.');
    }
};

export const getUserInfo = async (userId, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/account/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data && response.data.image) {
            response.data.imageUrl = `https://localhost:44325/api/account/uploads/${response.data.image}`;
        }

        return response.data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
};

export const getAllUser = async (pageNumber = 1) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user?pageNumber=${pageNumber}`);
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error("User Fetch Error:", error.response?.data || error.message);
        throw error;
    }
};


export const updateUserInfo = async (userId, userUpdateRequest, token) => {
    debugger
    try {
        const response = await axios.put(
            `${API_BASE_URL}/user/${userId}`,
            userUpdateRequest,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200 || response.status === 204) {
            return { success: true, message: 'Cập nhật thông tin thành công.' };
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating user:', error.response || error);
        const errorMessage = error.response?.data?.message || "Cập nhật thông tin người dùng thất bại. Vui lòng thử lại.";
        return { success: false, message: errorMessage };
    }
};

export const updatePassword = async (userId, request, token) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/user/update-password/${userId}`,
            request,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200 || response.status === 204) {
            return { success: true, message: 'Cập nhật password thành công.' };
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating user:', error.response || error);
        const errorMessage = error.response?.data?.message || "Cập nhật password thất bại. Vui lòng thử lại.";
        return { success: false, message: errorMessage };
    }
};