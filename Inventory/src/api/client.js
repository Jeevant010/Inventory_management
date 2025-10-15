import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const client = axios.create({ baseURL, timeout: 15000 });

client.interceptors.response.use(
  res => res,
  err => {
    const data = err.response?.data;
    const message = data?.error || err.message || 'Request error';
    // Include details if present
    if (data?.details) {
      const d = Array.isArray(data.details) ? data.details.map(x => `${x.field}: ${x.message}`).join('; ') : JSON.stringify(data.details);
      return Promise.reject(new Error(`${message} — ${d}`));
    }
    return Promise.reject(new Error(message));
  }
);

export default client;