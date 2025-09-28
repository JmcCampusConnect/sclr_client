import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL

// -----------------------------------------------------------------------------------------------------------------

// Login API

export const authAPI = async (apiUrl, formData) => {
	const response = await axios.post(apiUrl, formData)
	return response;
}

// -----------------------------------------------------------------------------------------------------------------

// Add Data API

export const addDataAPI = async (apiUrl, formData) => {
	let headers = {};
	// console.log('Triggered')
	if (!(formData instanceof FormData)) { headers['Content-Type'] = 'application/json'; }
	const response = await axios.post(apiUrl, formData, { headers });
	return response;
}

// -----------------------------------------------------------------------------------------------------------------

// For cookie creation

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
})

export default api

// -----------------------------------------------------------------------------------------------------------------