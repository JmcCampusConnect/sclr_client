import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

// Public Pages
import LandingPage from "./pages/others/LandingPage";
import LoginPage from "./pages/others/LoginPage";
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
import ClassAttendance from "./pages/staff/ClassAttendance";
import DmAttendance from "./pages/staff/DmAttendance";
import CoeMark from "./pages/staff/CoeMark";
import StaffSettings from "./pages/staff/StaffSettings";

// Admin Pages
import AdminLayout from "./layout/AdminLayout";
import CommonStaffDashboard from "./pages/CommonStaffDashboard";
import AcademicYear from './pages/admin/applicationSettings/AcademicYear';
import ApplicationDate from './pages/admin/applicationSettings/ApplicationDate';
import SclrAdministration from './pages/admin/SclrAdministration';
import AdminViewAppln from './pages/admin/AdminViewAppln';
import Donor from './pages/admin/manage/Donor';
import DistributionStmt from './pages/admin/DistributionStmt';
import Staff from './pages/admin/manage/Staff';
import Student from './pages/admin/manage/Student';
import Tutor from './pages/admin/manage/Tutor';
import Application from './pages/admin/manage/Application';
import CheckStatus from './pages/admin/CheckStatus';
import ProgressReport from './pages/admin/ProgressReport';
import FundsAvailable from './pages/admin/report/FundsAvailable';
import ChangePassword from './pages/admin/ChangePassword';
import GuideLines from './pages/admin/GuideLines';
import UploadCenter from './pages/admin/UploadCenter';
import DataDeletion from './pages/admin/DataDeletion';

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
						<Route path="dashboard" element={<CommonStaffDashboard />} />
						<Route path="academicYear" element={<AcademicYear />} />
						<Route path="applicationDate" element={<ApplicationDate />} />
						<Route path="donor" element={<Donor />} />
						<Route path="checkSstatus/*" element={<CheckStatus />} />
						<Route path="distributionStatement" element={<DistributionStmt />} />
						<Route path="sclrAdministration/*" element={<SclrAdministration />} >
							<Route path="view" element={<AdminViewAppln />} />
						</Route>
						<Route path="staffManage" element={<Staff />} />
						<Route path="studentManage" element={<Student />} />
						<Route path="tutorManage" element={<Tutor />} />
						<Route path="applicationManage" element={<Application />} />
						<Route path="progressReport" element={<ProgressReport />} />
						<Route path="fundsAvailable" element={<FundsAvailable />} />
						<Route path="changePassword" element={<ChangePassword />} />
						<Route path="guidelines" element={<GuideLines />} />
						<Route path="dataDeletion" element={<DataDeletion />} />
						<Route path="uploadCenter" element={<UploadCenter />} />
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
						<Route path="dashboard" element={<CommonStaffDashboard />} />
						<Route path="settings" element={<StaffSettings />} />
					</Route>

				</Routes>
			</BrowserRouter>
		</AuthProvider>
	)
}

export default App;