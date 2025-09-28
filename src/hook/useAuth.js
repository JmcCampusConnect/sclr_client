import { useState } from "react";
import api from "../services/api";

export const useAuth = () => {

    const [errorData, setErrorData] = useState(null);

    const login = async (formData) => {
        try {
            const response = await api.post("/user/login", formData);
            return response.data;
        } catch (error) {
            setErrorData(error.response?.data?.message || "Something went wrong");
            throw error;
        }
    }

    const logout = async () => {
        try {
            await api.post("/user/logout");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const checkAuth = async () => {
        try {
            const response = await api.get("/user/profile");
            return response.status === 200;
        } catch {
            return false;
        }
    }

    return { errorData, login, logout, checkAuth }

}