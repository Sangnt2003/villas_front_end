/* eslint-disable no-debugger */
import axios from 'axios';

import { API_BASE_URL } from '../enviroment';

export const fetchLocations = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/location/locations`, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        console.error("Location Fetch Error:", error);
        throw error;
    }
};
export const fetchLocationWithVilla = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/location/location-villa`, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        console.error("Location Fetch Error:", error);
        throw error;
    }
};
export const getAllLocation = async (pageNumber = 1) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/location/all?pageNumber=${pageNumber}`);
        return response.data;
    } catch (error) {
        console.error("Location Fetch Error:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteLocation = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/location/${id}`);
        return response.status;
    } catch (error) {
        console.error("Error deleting location:", error);
        throw error;
    }
};

export const addLocation = async (request) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/location`, request);
        return response.data;
    } catch (error) {
        console.error("Error adding location:", error);
        throw error;
    }
}