/* eslint-disable no-debugger */
import axios from 'axios';
import { API_BASE_URL } from '../enviroment';

export const addVilla = async (formDatas, images) => {
    try {
        const formData = new FormData();

        // Thêm các trường dạng key-value vào formData
        for (const [key, value] of Object.entries(formDatas)) {
            if (Array.isArray(value)) {
                if (key === 'villaServices') {
                    value.forEach((serviceId) => formData.append('VillaServiceIds', serviceId)); // Từng ID dịch vụ
                } else if (key === 'imageUrls') {
                    value.forEach((url) => formData.append('ImageUrls', url)); // Từng URL ảnh
                }
            } else {
                formData.append(key, value ?? ''); // Các trường khác
            }
        }

        // Thêm tệp ảnh vào formData
        if (images && images.length > 0) {
            images.forEach((image) => {
                formData.append('image', image); // Key phải là 'image'
            });
        }

        // Gửi request tới API
        const response = await axios.post(`${API_BASE_URL}/villa`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error adding villa:', error);
        throw error;
    }
};


export const deleteVilla = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/villa/${id}`);
        return response.status;
    } catch (error) {
        console.error("Error deleting villa:", error);
        throw error;
    }
};
export const updateApprove = async (id, status) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/villa/${id}/approve`, { status });
        return response.status;
    } catch (error) {
        console.error("Error updating villa status:", error);
        throw error;
    }
};

export const getVilla = async (villaId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/villa/${villaId}`);
        return response.data;
    } catch (error) {
        console.error("Villa Fetch Error:", error.response?.data || error.message);
        throw error;
    }
}

export const getAllVillaByUserId = async (userId, pageNumber = 1) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/villa/villas/${userId}?pageNumber=${pageNumber}`);
        return response.data;
    } catch (error) {
        console.error("Villa Fetch Error:", error.response?.data || error.message);
        throw error;
    }
};

export const searchVilla = async (locationId, startDate, endDate, capacity) => {
    const parseDate = (dateString) => {
        if (!dateString || typeof dateString !== "string") {
            console.error("Invalid date string:", dateString);
            return null;
        }
        const [day, month, year] = dateString.split("-");
        if (!day || !month || !year) {
            console.error("Invalid date format:", dateString);
            return null;
        }
        return `${year}-${month}-${day}`;
    };

    try {
        const formattedStartDate = parseDate(startDate);
        const formattedEndDate = parseDate(endDate);
        if (!formattedStartDate || !formattedEndDate) {
            throw new Error("Invalid start or end date.");
        }

        const response = await axios.get(`${API_BASE_URL}/villa/search`, {
            params: {
                locationId,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                capacity: parseInt(capacity, 10),
            },
        });
        return response.data;
    } catch (error) {
        console.error("Villa Search Error:", error.response?.data || error.message);
        throw error;
    }
};

export const searchVillasByAddress = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/villa/nearby/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching nearby villas:', error);
        throw error;
    }
};

export const getAllVilla = async (pageNumber = 1) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/villa/villas?pageNumber=${pageNumber}`);
        return response.data;
    } catch (error) {
        console.error("Villa Fetch Error:", error.response?.data || error.message);
        throw error;
    }
}

export const fetchFilteredVillas = async (filters) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/villa/filter`, {
            params: filters, // Truyền filters dưới dạng query params
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API filter villas:", error);
        return [];
    }
};

export const fetchVillas = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/villa/all`, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        console.error("Villa Fetch Error:", error);
        throw error;
    }
};