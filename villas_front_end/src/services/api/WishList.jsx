// apiWishList.jsx
import axios from 'axios';
import { API_BASE_URL } from '../enviroment';

export const getWishlistsByUserId = async (userId, pageNumber = 1) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/wishlist/user/${userId}?pageNumber=${pageNumber}`);
        return { wishlists: response.data.wishlists, totalPages: response.data.totalPages };
    } catch (error) {
        console.error('Error fetching wishlists:', error);
        throw error;
    }
};
export const checkWishList = async (userId, villaId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/wishlist/check`, {
            params: { userId, villaId }
        });
        return response.data;
    } catch (error) {
        console.error("Error checking wishlist:", error);
        throw error;
    }
};

export const addToWishlist = async (userId, villaId) => {

    try {
        const response = await axios.post(`${API_BASE_URL}/wishlist`, {
            userId,
            villaId
        });
        return response.data;
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
    }
};

export const removeFromWishlist = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/wishlist/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        throw error;
    }
};
