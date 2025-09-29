import { useState } from "react";
import api from "..//services/api";

export const useAuth = () => {

    const [errorData, setErrorData] = useState(null);

    const login = async (formData) => {
        try {
            const res = await api.post("/user/login", formData);
            return res.data;
        } catch (error) {
            setErrorData(error.response?.data?.message || "Login failed");
            throw error;
        }
    }

    const checkAuth = async () => {
        try {
            const res = await api.get("/user/profile"); 
            return res.data?.status === 200 ? res.data : null;
        } catch {
            return null;
        }
    }

    const logout = async () => {
        await api.post("/api/user/logout");
    }

    return { login, checkAuth, logout, errorData };
}