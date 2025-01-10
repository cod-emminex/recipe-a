// frontend/js/api/config.js
export const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1';
export const WS_URL = process.env.WS_URL || 'ws://localhost:3000';

export const initializeApp = async () => {
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        
        if (data.status !== 'success') {
            throw new Error('API health check failed');
        }
        
        console.log('API connection established');
        return true;
    } catch (error) {
        console.error('Failed to initialize app:', error);
        throw error;
    }
};

export const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...defaultOptions,
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};
