import axios from "axios";

const API_URL = "https://localhost:44325/api/review";

export const addReview = async (reviewRequest) => {
    try {
        const response = await axios.post(`${API_URL}`, reviewRequest);
        return response.data;
    } catch (error) {
        console.error("Error adding review:", error.response?.data || error.message);
        throw error;
    }
};

export const getReviewsByVillaId = async (villaId) => {
    try {
        const response = await axios.get(`${API_URL}/villa/${villaId}`);
        return response.data;
    } catch (error) {
        console.error(
            "Error fetching reviews for villa:",
            error.response?.data || error.message
        );
        throw error;
    }
};

export const getReviewById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching review by ID:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteReview = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.status === 204;
    } catch (error) {
        console.error("Error deleting review:", error.response?.data || error.message);
        throw error;
    }
};
