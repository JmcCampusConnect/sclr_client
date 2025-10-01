import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ROLES = { student: 0, admin: 1, staff: 2 }

const PrivateRoute = ({ children, role }) => {

	const { user, loading } = useContext(AuthContext);

	if (loading) return <div>Loading...</div>;
	if (!user) return <Navigate to="/login" />;

	const requiredRole = typeof role === "string" ? ROLES[role] : role;
	if (role && user.role !== requiredRole) return <Navigate to="/login" />;

	return children;
}

export default PrivateRoute;