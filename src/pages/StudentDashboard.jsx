import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../assets/svg/Pulse.svg";
import ApplicationStatus from "../components/StudentDashboard/ApplicationStatus";
import PersonalDetails from "../components/StudentDashboard/PersonalDetails";
import EducationalDetails from "../components/StudentDashboard/EducationalDetails";
import DocumentsSection from "../components/StudentDashboard/DocumentsSection";
import { InfoCard } from "../components/StudentDashboard/UI";

const apiUrl = import.meta.env.VITE_API_URL;

function StudentDashboard() {
	
	const [student, setStudent] = useState(null);
	const navigate = useNavigate();
	const { userId } = useParams();
	const [showMessage, setShowMessage] = useState(false);

	useEffect(() => {
		const fetchStudentData = async () => {
			try {
				const response = await axios.get(`${apiUrl}/api/student/status`, {
					params: { registerNo: userId },
				});
				setStudent(response.data.student);
				if (response.data.message === "Applicantion does not exist") {
					navigate(`/student/${userId}/application/renewal`);
				}
			} catch (error) {
				alert("An error occurred. Please try again.");
			}
		};
		if (userId) fetchStudentData();
	}, [userId, navigate]);

	useEffect(() => {
		if (!student) {
			const timer = setTimeout(() => setShowMessage(true), 3000);
			return () => clearTimeout(timer);
		}
	}, [student]);

	if (!student) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-50">
				{!showMessage ? (
					<img src={Loading} alt="Loading" className="w-28 h-28" />
				) : (
					<p className="text-gray-700 text-lg font-semibold">
						Go to <span className="text-indigo-600">Application Tab</span> to apply for Scholarship Renewal
					</p>
				)}
			</div>
		)
	}

	return (
		<div className="container mx-auto">
			<div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
				<div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
					<h2 className="text-xl font-bold text-white">Student Dashboard - {student.name}</h2>
					<p className="text-indigo-100 text-md mt-2">Register No : {student.registerNo}</p>
				</div>
				<div className="p-6 space-y-8">
					<ApplicationStatus status={student.applicationStatus} />
					<div className="grid md:grid-cols-2 gap-6">
						<InfoCard label="Scholarship Type" value={student.sclrType} />
						<InfoCard label="Special Category" value={student.specialCategory} />
					</div>
					<PersonalDetails student={student} />
					<EducationalDetails student={student} />
					<DocumentsSection student={student} apiUrl={apiUrl} />
				</div>
			</div>
		</div>
	)
}

export default StudentDashboard;