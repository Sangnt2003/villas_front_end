
import axios from 'axios';
import { API_BASE_URL } from '../enviroment';
export const fetchDicounts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/discount/discounts`, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        console.error("Location Fetch Error:", error);
        throw error;
    }
};