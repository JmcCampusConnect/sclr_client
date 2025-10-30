import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

// Public Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import StudentHome from "./pages/StudentHome";

// Student Pages
import RegisterLayout from "./layout/RegisterLayout";
import RegisterApplication from "./pages/RegisterApplication";
import StudentLayout from "./layout/StudentLayout";
import StudentDashboard from "./pages/StudentDashboard";
import LoginApplication from "./pages/LoginApplication";
import StudentGuidelines from "./pages/StudentGuidelines";

// Staff Pages
import StaffLayout from "./layout/StaffLayout";
import ClassAttendance from "./pages/ClassAttendance";
import DmAttendance from "./pages/DmAttendance";
import CoeMark from "./pages/CoeMark";
import StaffSettings from "./pages/StaffSettings";

// Admin Pages
import AdminLayout from "./layout/AdminLayout";
import AdminStaffDashboard from "./pages/AdminStaffDashboard";
import AcademicYear from './pages/AcademicYear';
import ApplicationDate from './pages/ApplicationDate';
import AdminApplication from './pages/AdminApplication';
import AdminViewAppln from './pages/AdminViewAppln';
import Donor from './pages/Donor';
import DistributionStmt from './pages/admin/DistributionStmt';

function App() {

	const ROLES = { student: 0, admin: 1, staff: 2 };

	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					{/* Public Routes */}
					<Route path="/" element={<LandingPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/student" element={<StudentHome />} />

					{/* Student Register */}
					<Route
						path="/student/register/*"
						element={
							<PrivateRoute role={ROLES.student}>
								<RegisterLayout />
							</PrivateRoute>
						}
					>
						<Route path="application" element={<RegisterApplication />} />
					</Route>

					{/* Student */}
					<Route
						path="/student/:userId/*"
						element={
							<PrivateRoute role="student">
								<StudentLayout />
							</PrivateRoute>
						}
					>
						<Route path="dashboard" element={<StudentDashboard />} />
						<Route path="application" element={<LoginApplication />} />
						<Route path="guidelines" element={<StudentGuidelines />} />
					</Route>

					{/* Admin */}
					<Route
						path="/admin/*"
						element={
							<PrivateRoute role={ROLES.admin}>
								<AdminLayout />
							</PrivateRoute>
						}
					>
						<Route path="dashboard" element={<AdminStaffDashboard />} />
						<Route path="academicYear" element={<AcademicYear />} />
						<Route path="applicationDate" element={<ApplicationDate />} />
						<Route path="donor" element={<Donor />} />
						<Route path="distributionStatement" element={<DistributionStmt />} />
						<Route path="application/*" element={<AdminApplication />} >
							<Route path="view" element={<AdminViewAppln />} />
						</Route>
					</Route>

					{/* Staff */}
					<Route
						path="/staff/:userId/*"
						element={
							<PrivateRoute role="staff">
								<StaffLayout />
							</PrivateRoute>
						}
					>
						<Route path="classAttendance" element={<ClassAttendance />} />
						<Route path="dmAttendance" element={<DmAttendance />} />
						<Route path="markEntry" element={<CoeMark />} />
						<Route path="dashboard" element={<AdminStaffDashboard />} />
						<Route path="settings" element={<StaffSettings />} />
					</Route>

				</Routes>
			</BrowserRouter>
		</AuthProvider>
	)
}

export default App;