import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../assets/svg/Pulse.svg";
import ApplicationStatus from "../../components/StudentDashboard/ApplicationStatus";
import PersonalDetails from "../../components/StudentDashboard/PersonalDetails";
import EducationalDetails from "../../components/StudentDashboard/EducationalDetails";
import DocumentsSection from "../../components/StudentDashboard/DocumentsSection";
import { InfoCard } from "../../components/StudentDashboard/UI";

const apiUrl = import.meta.env.VITE_API_URL;

function StudentDashboard() {

	const { userId } = useParams();
	const navigate = useNavigate();
	const [student, setStudent] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [showMessage, setShowMessage] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	useEffect(() => {

		if (!userId) {
			console.warn("StudentDashboard: no userId param provided");
			setIsLoading(false);
			setStudent(null);
			return;
		}

		const controller = new AbortController();
		const fetchStudent = async () => {
			try {
				setIsLoading(true);
				setErrorMsg("");
				setShowMessage(false);
				const resp = await axios.get(`${apiUrl}/api/student/status`, {
					params: { registerNo: userId },
					signal: controller.signal,
					timeout: 10000,
				});
				const fetchedStudent = resp?.data?.student ?? null;
				setStudent(fetchedStudent);
			} catch (err) {
				if (axios.isCancel(err)) { return }
				console.error("Error fetching student data : ", err);
				setErrorMsg("Unable to load student data. Try again later.");
				setStudent(null);
			} finally { setIsLoading(false) }
		}
		fetchStudent();
		return () => { controller.abort() }
	}, [userId]);

	useEffect(() => {
		if (!isLoading && !student) {
			const t = setTimeout(() => setShowMessage(true), 1800);
			return () => clearTimeout(t);
		} else {
			setShowMessage(false);
		}
	}, [isLoading, student]);

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center">
				<img src={Loading} alt="Loading..." className="w-28 h-28" />
				<p className="mt-6 text-gray-700 text-base font-medium animate-pulse">
					Fetching your scholarship details...
				</p>
			</div>
		)
	}

	if (errorMsg) {
		return (
			<div className="flex items-center justify-center">
				<div className="bg-white p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold text-red-600">Error</h3>
					<p className="text-sm text-gray-700 mt-2">{errorMsg}</p>
				</div>
			</div>
		)
	}

	if (!student) {
		return (
			<div className="flex flex-col items-center justify-center text-center p-6">
				{showMessage ? (
					<div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg border-t-4 border-indigo-600 w-full">
						<div className="mb-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-10 w-10 text-red-500 mx-auto"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clipRule="evenodd"
								/>
							</svg>
						</div>

						<h2 className="text-2xl font-bold text-gray-900 mb-5">
							No Application Found
						</h2>

						<p className="text-gray-700 mb-6">
							Our records do not show a scholarship application for the current academic year under your account.
						</p>

						<div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-md">
							<p className="text-sm text-indigo-800">
								To apply for a scholarship, go to{" "}
								<button
									onClick={() => navigate("/student/application")}
									className="text-indigo-600 hover:text-indigo-800 font-medium underline"
								>
									Application Menu
								</button>
								.
							</p>
						</div>
					</div>
				) : (
					<img src={Loading} alt="Loading..." className="w-28 h-28" />
				)}
			</div>
		)
	}

	return (
		<div className="container mx-auto">
			<div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
				<div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
					<h2 className="text-xl font-bold text-white">Student Dashboard – {student.name}</h2>
					<p className="text-indigo-100 mt-1 text-sm">Register No: {student.registerNo}</p>
				</div>
				<div className="p-6 space-y-8">
					<ApplicationStatus status={student.applicationStatus} rejectionReasons={student.rejectionReasons} />
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