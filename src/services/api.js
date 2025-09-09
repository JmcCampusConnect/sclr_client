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
    // console.log(apiUrl)
    if (formData instanceof FormData) { headers['Content-Type'] = 'multipart/form-data' }
    else { headers['Content-Type'] = 'application/json' }
    const response = await axios.post(apiUrl, formData, { headers })
    // console.log('Response in AddDataApi : ', response)
    return response;
}