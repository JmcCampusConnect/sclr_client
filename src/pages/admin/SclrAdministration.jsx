import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useLocation } from "react-router-dom";
import FilterSection from "../../components/SclrAdministration/FilterSection";
import ActionBar from "../../components/SclrAdministration/ActionBar";
import ApplicationTable from "../../components/SclrAdministration/ApplicationTable";
import AcceptModal from "../../components/Others/AcceptModal";
import RejectModal from "../../components/Others/RejectModal";

const apiUrl = import.meta.env.VITE_API_URL;

function SclrAdministration() {

	const [searchMode, setSearchMode] = useState("all");
	const [students, setStudents] = useState([]);
	const [donors, setDonors] = useState([]);
	const [showAcceptModal, setShowAcceptModal] = useState(false);
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const location = useLocation();

	const fetchStudents = async () => {
		try {
			const response = await axios.get(`${apiUrl}/api/admin/application/fetchStudents`);
			setStudents(response.data.data);
		} catch (error) {
			console.error("Error fetching students for admin application : ", error);
		}
	}

	const fetchDonors = async () => {
		try {
			const response = await axios.get(`${apiUrl}/api/admin/application/fetchDonars`);
			setDonors(response.data.donors);
		} catch (error) {
			console.error("Error fetching students for admin application : ", error);
		}
	};

	useEffect(() => {
		fetchStudents();
		fetchDonors();
	}, []);

	const isViewPage = location.pathname.endsWith("/view");

	const openAcceptModal = (student) => {
		setSelectedStudent(student);
		setShowAcceptModal(true);
		setShowRejectModal(false);
	}

	const openRejectModal = () => {
		setShowRejectModal(true);
		setShowAcceptModal(false);
		setSelectedStudent(student);

	}

	const closeModal = () => {
		setShowAcceptModal(false);
		setShowRejectModal(false);
	}

	return (
		<div className="relative">
			{isViewPage ? (
				<Outlet />
			) : (
				<>
					{/* Header */}
					<header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
							Scholarship Administration
						</h1>
					</header>
					<FilterSection searchMode={searchMode} setSearchMode={setSearchMode} />
					<ActionBar totalStudents={students.length} />
					<ApplicationTable students={students} openAcceptModal={openAcceptModal} openRejectModal={openRejectModal} />
					<AcceptModal
						donors={donors}
						selectedStudent={selectedStudent}
						showAcceptModal={showAcceptModal}
						closeModal={closeModal}
					/>
					<RejectModal showRejectModal={showRejectModal} closeModal={closeModal} />
				</>
			)}
		</div>
	)
}

export default SclrAdministration;