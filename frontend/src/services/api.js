// Axios client with auth handling: adds Bearer token from localStorage and
// attempts a refresh on 401 responses. Refresh endpoint uses httpOnly cookie
// so call includes credentials.
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || process.env.VITE_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

// Request interceptor: attach access token from localStorage
api.interceptors.request.use(
	(config) => {
		try {
			const token = localStorage.getItem('accessToken');
			if (token) {
				config.headers = config.headers || {};
				config.headers.Authorization = `Bearer ${token}`;
			}
			config.withCredentials = true;
		} catch (e) {
			// ignore localStorage errors in some environments
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor: on 401 try refresh and retry original requests.
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const originalRequest = error.config;

		if (error.response && error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						return api(originalRequest);
					})
					.catch((err) => Promise.reject(err));
			}

			isRefreshing = true;

			return new Promise((resolve, reject) => {
				// Call refresh endpoint using a raw axios call to avoid interceptor recursion
				axios
					.post(`${API_URL.replace(/\/$/, '')}/auth/refresh`, {}, { withCredentials: true })
					.then((res) => {
						const newToken = res?.data?.accessToken;
						if (!newToken) {
							throw new Error('No accessToken in refresh response');
						}

						try {
							localStorage.setItem('accessToken', newToken);
						} catch (e) {
							// ignore storage errors
						}

						api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
						processQueue(null, newToken);
						originalRequest.headers.Authorization = `Bearer ${newToken}`;
						resolve(api(originalRequest));
					})
					.catch((err) => {
						processQueue(err, null);
						reject(err);
					})
					.finally(() => {
						isRefreshing = false;
					});
			});
		}

		return Promise.reject(error);
	}
);

export default api;
