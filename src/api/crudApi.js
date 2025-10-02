import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL

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

// Fetch Data API

export const fetDataAPI = async (apiUrl, formData) => {
	const response = await axios.post(apiUrl, formData)
	return response;
}

// -----------------------------------------------------------------------------------------------------------------