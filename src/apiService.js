// src/apiService.js
import axios from 'axios';

const API_BASE_URL = 'https://application.glimpass.com/interlogue';
const API_BASE_URL_VAPI = 'https://api.vapi.ai';

const getUserData = () => {
  const user = sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const getAuthToken = () => {
  const user = getUserData();
  return user ? user.vapiApi : '';
};

const createApiClient = (baseURL) => {
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
    }
  });
};

const apiClient = createApiClient(API_BASE_URL);
const vapiClient = createApiClient(API_BASE_URL_VAPI);

export const makeCall = async (customer) => {
  const user = getUserData();
  if (!user) {
    throw new Error('User data not found in sessionStorage');
  }

  const payload = {
    assistantId: user.assistantId,
    customer: {
      number: customer.number,
      name: customer.name,
    },
    assistantOverrides: {
      firstMessage: `Hello ${customer.name}`,
    },
    phoneNumber: {
      twilioPhoneNumber: user.twilioNumber,
      twilioAccountSid: user.twilioAccountSid,
      twilioAuthToken: user.twilioAuthToken,
    },
  };

  const headers = {
    'Authorization': `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json',
  };

  const response = await axios.post(`${API_BASE_URL_VAPI}/call/phone`, payload, { headers });
  return response.data;
};

// Function to handle user login
export const loginUser = async (email, password, userType) => {
  try {
    const response = await apiClient.post('/get-client', { email, password, userType });
    return response.data;
  } catch (error) {
    throw error.response.data || error;
  }
};

// Function to update user data
export const updateClient = async (changes) => {
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
    const response = await axios.post(`${API_BASE_URL}/get-staff-by-client`, { clientId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (userList) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-user`, {
      userData: userList,
      isUpdate: false
    });
    return response.data;
  } catch (error) {
    console.error('Error creating users:', error);
    throw error;
  }
};

export const updateUser = async (userList) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-user`, {
      userData: userList,
      isUpdate: true
    });
    return response.data;
  } catch (error) {
    console.error('Error updating users:', error);
    throw error;
  }
};

export const getCallReports = async (clientId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/get-user-by-client`, { clientId });
    return response.data;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

export const getCallAgainData = async (clientId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/get-user-by-client`, {
      clientId: clientId,
      callingNumber: true
    });
    return response.data;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

export const fetchCallDetailsById = async (callId) => {
  try {
    const response = await vapiClient.get(`/call/${callId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching call details for ID: ${callId}`, error);
    throw error;
  }
};
