import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true
  });
  
export const login = (formData) => api.post("/auth/login", formData);
export const refresh = () => api.post("/auth/refresh");
export const logout = () => api.post("/auth/logout");