import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentHome from './pages/StudentHome';
import RegisterLayout from './layout/RegisterLayout';
import RegisterApplication from './pages/RegisterApplication';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './auth/ProtectedRoute';
import AdminLayout from './layout/AdminLayout';
import { useAuth } from './hook/useAuth';
import StaffLayout from './layout/StaffLayout';
import StudentLayout from './layout/StudentLayout';
import ClassAttendance from './pages/ClassAttendance';

function App() {

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);
	const { checkAuth } = useAuth();

	useEffect(() => {
		const verifyAuth = async () => {
			const auth = await checkAuth();
			if (auth) {
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
			}
			setLoading(false);
		};
		verifyAuth();
	}, []);

	if (loading) { return <div>Loading...</div> }

	return (
		<Router>
			<Routes>

				{/* Public */}
				<Route path='/' element={<LandingPage />} />
				<Route path='/login' element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
				<Route path='/student' element={<StudentHome setIsAuthenticated={setIsAuthenticated} />} />

				{/* Protected Register Student */}
				<Route
					path='/student/register/*'
					element={
						<ProtectedRoute isAuthenticated={isAuthenticated}>
							<RegisterLayout setIsAuthenticated={setIsAuthenticated} />
						</ProtectedRoute>
					}
				>
					<Route path='application' element={<RegisterApplication />} />
				</Route>

				{/* Protected Login Student */}
				<Route
					path='/student/:userId'
					element={
						<ProtectedRoute isAuthenticated={isAuthenticated}>
							<StudentLayout setIsAuthenticated={setIsAuthenticated} />
						</ProtectedRoute>
					}
				/>

				{/* Protected Admin */}
				<Route
					path='/admin/:userId'
					element={
						<ProtectedRoute isAuthenticated={isAuthenticated}>
							<AdminLayout setIsAuthenticated={setIsAuthenticated} />
						</ProtectedRoute>
					}
				/>

				{/* Protected Staff */}
				<Route
					path='/staff/:userId/*'
					element={
						<ProtectedRoute isAuthenticated={isAuthenticated}>
							<StaffLayout setIsAuthenticated={setIsAuthenticated} />
						</ProtectedRoute>
					}
				>
					<Route path='attendance' element={<ClassAttendance />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;