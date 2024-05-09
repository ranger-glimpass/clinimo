// src/apiService.js
import axios from 'axios';

const API_BASE_URL = 'https://application.glimpass.com/interlogue'; // Adjust to your API's base URL

const API_BASE_URL_VAPI = 'https://api.vapi.ai';
const AUTH_TOKEN = 'e518c4e5-8e86-42ab-b1a5-5315f83af694';  // Your token should be securely stored/managed

axios.defaults.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`;
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Function to handle user login
export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post('/get-client', {
            email,
            password
        });
        return response.data;
    } catch (error) {
        // Error handling here
        throw error.response.data;
    }
};

export const updateUser = async (changes) => {
    try {
        const response = await apiClient.post('/create-client', changes);
        if (typeof changes === 'object') {
            sessionStorage.setItem("user", JSON.stringify(changes)); // Convert object to string
        } else {
            console.error('Expected an object to store in sessionStorage');
        }
        return response.data;
    } catch (error) {
        // Error handling here
        throw error.response.data;
    }
};

export const fetchCallLogs = async (assistantId) => {
    try {
        const response = await axios.get(`${API_BASE_URL_VAPI}/call?assistantId=${assistantId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching call logs:', error);
        throw error;
    }
};

export const fetchAssistants = async (_id) => {
    try {
        const response = await apiClient.post('/get-assistant-by-client', {
            _id
        });
        return response;
    } catch (error) {
        // Error handling here
        throw error.response;
    }
};

// You can add more API functions here as needed
