import axios from 'axios';

import { API_BASE_URL } from '../enviroment';
export const getNotificationsByVillaOwnerId = async (villaOwnerId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/notification/owner/${villaOwnerId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications by villa owner ID:', error);
        throw error;
    }
};

export const getNotificationById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/notification/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching notification by ID:', error);
        throw error;
    }
};

export const createNotification = async (notificationRequest) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/notification`, notificationRequest);
        return response.data;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

export const updateNotification = async (id, notificationRequest) => {
    try {
        await axios.put(`${API_BASE_URL}notification/${id}`, notificationRequest);
    } catch (error) {
        console.error('Error updating notification:', error);
        throw error;
    }
};

export const deleteNotification = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}notification/${id}`);
    } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
    }
};
