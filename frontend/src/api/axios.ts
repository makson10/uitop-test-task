import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const message =
			error.response?.data?.message ||
			error.message ||
			'An unexpected error occurred';

		return Promise.reject({
			message: Array.isArray(message) ? message.join(', ') : message,
			status: error.response?.status,
			data: error.response?.data,
		});
	}
);
