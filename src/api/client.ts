import axios from 'axios';

// Axios instance
const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});

export default client;