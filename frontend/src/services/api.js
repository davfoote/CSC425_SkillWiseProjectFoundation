// TODO: API client placeholder
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || process.env.VITE_API_URL || 'http://localhost:4000/api';

export const api = axios.create({ baseURL: API_URL });

export default api;
