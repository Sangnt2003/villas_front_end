/* eslint-disable no-debugger */
import axios from 'axios';
import { API_BASE_URL } from '../enviroment';

export const addVilla = async (serviceData) => {
    try {

        const response = await axios.post(`${API_BASE_URL}/service`, serviceData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error adding service:", error);
        throw error;
    }
};

export const deleteService = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/service/${id}`);
        return response.status;
    } catch (error) {
        console.error("Error deleting service:", error);
        throw error;
    }
};
export const updateService = async (id) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/villa/${id}/approve`, { status });
        return response.status;
    } catch (error) {
        console.error("Error updating service :", error);
        throw error;
    }
};

export const getServiceById = async (serviceId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/service/${serviceId}`);
        return response.data;
    } catch (error) {
        console.error("Service Fetch Error:", error.response?.data || error.message);
        throw error;
    }
}

export const getAllService = async (pageNumber = 1) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/service/all/?pageNumber=${pageNumber}`);
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error("Service Fetch Error:", error.response?.data || error.message);
        throw error;
    }
}

export const fetchServices = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/service/services`, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        console.error("Location Fetch Error:", error);
        throw error;
    }
};
