import axios from 'axios';
import { API_BASE_URL } from '../enviroment';
export const login = async (username, password) => {
    const response = await axios.post(`${API_BASE_URL}/account/token`, {
        username,
        password,
    });
    return response.data.token;
};
export const loginWithGoogle = async (googleToken) => {
    const response = await axios.post(`${API_BASE_URL}/account/google`,
        {
            token: googleToken

        });
    return response.data.token;
}
export const checkUsernameExists = async (username) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/account/check-username`, {
            params: { username },
        });
        return response.data.usernameExists;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi khi kiểm tra tên đăng nhập.');
    }
};


export const checkEmailExists = async (email) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/account/check-email`, {
            params: { email },
        });
        return response.data.emailExists; // Trả về trạng thái tồn tại email
    } catch (error) {
        console.error('Error in checkEmailExists:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Lỗi khi kiểm tra email.');
    }
};
