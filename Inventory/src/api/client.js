import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const client = axios.create({
  baseURL,
  timeout: 15000
});

client.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.error || err.message || 'Request error';
    return Promise.reject(new Error(message));
  }
);

export default client;