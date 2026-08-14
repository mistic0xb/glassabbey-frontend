import axios from 'axios';

// Axios instance
const client = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    withCredentials: true
});

export default client;