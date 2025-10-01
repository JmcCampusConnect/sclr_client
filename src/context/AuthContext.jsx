import React, { createContext, useState, useEffect } from "react";
import { login, refresh, logout } from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

	const [user, setUser] = useState(null);
	const [accessToken, setAccessToken] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const tryRefresh = async () => {
			try {
				const response = await refresh();
				setAccessToken(response.data.accessToken);
				setUser(response.data.user);
			} catch (err) {
				setUser(null);
				setAccessToken(null);
			} finally { setLoading(false) }
		}
		tryRefresh();
	}, []);

	const handleLogin = async (formData) => {
		const response = await login(formData);
		setAccessToken(response.data.accessToken);
		setUser(response.data.user);
		return response;
	}

	const handleLogout = async () => {
		await logout();
		setUser(null);
		setAccessToken(null);
	}

	return (
		<AuthContext.Provider value={{ user, accessToken, handleLogin, handleLogout, loading }}>
			{children}
		</AuthContext.Provider>
	)
}