// src/apiService.js
import axios from 'axios';

const API_BASE_URL = 'https://application.glimpass.com/interlogue';
const API_BASE_URL_VAPI = 'https://api.vapi.ai';
const AUTH_TOKEN = 'e518c4e5-8e86-42ab-b1a5-5315f83af694';  // This token should ideally be managed securely.

axios.defaults.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

const vapiClient = axios.create({
    baseURL: API_BASE_URL_VAPI,
    headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
    }
});

// Function to handle user login
export const loginUser = async (email, password, userType) => {
    try {
        const response = await apiClient.post('/get-client', {
            email,
            password,
            userType
        });
        return response.data;
    } catch (error) {
        throw error.response.data || error;
    }
};

// Function to update user data
export const updateUser = async (changes) => {
    try {
        const response = await apiClient.post('/create-client', changes);
        if (typeof changes === 'object') {
            sessionStorage.setItem("user", JSON.stringify(changes));
        } else {
            console.error('Expected an object to store in sessionStorage');
        }
        return response.data;
    } catch (error) {
        throw error.response.data || error;
    }
};

// Function to fetch call logs
export const fetchCallLogs = async (assistantId) => {
    try {
        const response = await vapiClient.get(`/call?assistantId=${assistantId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching call logs:', error);
        throw error;
    }
};

// Function to fetch assistants
export const fetchAssistants = async (clientId) => {
    try {
        const response = await apiClient.post('/get-assistant-by-client', { _id: clientId });
        return response;
    } catch (error) {
        throw error.response || error;
    }
};

// Function to fetch a specific assistant's details by its ID
export const fetchAssistantById = async (assistantId) => {
    try {
        const response = await vapiClient.get(`/assistant/${assistantId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching assistant details for ID: ${assistantId}`, error);
        throw error;
    }
};

export const createStaff = async (staffData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/create-staff`, staffData);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getStaffByClientId = async (clientId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/get-staff-by-client`, {clientId});
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const makeCall = async (customer, assistantId) => {
    const payload = {
        "assistantId": "21b5957e-ef99-4a0a-bc87-d63e8552d866",
        "assistantOverrides": {
            "firstMessage": `Hello, ${customer.name}! I got your interest for applying at Infoedge.`,
            "variableValues": {
                "name": customer.name
            }
        },
        "customer": {
            "number": customer.number,
            "name": customer.name
        },
        "phoneNumber": {
            "twilioPhoneNumber": "+13516665873",
            "twilioAccountSid": "AC0dc62186b3830f94bd7db593ee82af74",
            "twilioAuthToken": "fdc6c8d23ec03da0e1cf68a217465bce"
        }
    };

    const headers = {
        'Authorization': `Bearer f806f3d8-d4b3-4e58-8370-65c8d1c0f9df`,
        'Content-Type': 'application/json',
    };

    const response = await axios.post(`${API_BASE_URL_VAPI}/call/phone`, payload, { headers });
    return response.data;
};