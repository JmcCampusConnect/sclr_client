import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useLocation } from "react-router-dom";
import FilterSection from "../../components/SclrAdministration/FilterSection";
import ActionBar from "../../components/SclrAdministration/ActionBar";
import ApplicationTable from "../../components/SclrAdministration/ApplicationTable";
import AcceptModal from "../../components/Others/AcceptModal";
import RejectModal from "../../components/Others/RejectModal";
import Loading from "../../assets/svg/Pulse.svg";

const apiUrl = import.meta.env.VITE_API_URL;

function SclrAdministration() {

	const [searchMode, setSearchMode] = useState("all");
	const [students, setStudents] = useState([]);
	const [filteredStudents, setFilteredStudents] = useState([]);
	const [donors, setDonors] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showAcceptModal, setShowAcceptModal] = useState(false);
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [filters, setFilters] = useState({
		applicationStatus: "0", sclrType: "all", tutorVerification: "all",
		specialCategories: ["All", "General", "Mu-addin", "Hazrath", "Father Mother Separated", "Father Expired", "Single Parent", "Orphan"]
	});
	const [searchTerm, setSearchTerm] = useState("");
	const [searchedStudents, setSearchedStudents] = useState([]);
	const location = useLocation();

	const fetchData = async () => {

		setIsLoading(true);
		setError(null);

		try {
			const [studentsRes, donorsRes] = await Promise.all([
				axios.get(`${apiUrl}/api/admin/application/fetchStudents`),
				axios.get(`${apiUrl}/api/admin/application/fetchDonors`),
			]);

			const sortedStudents = studentsRes.data.data.sort(
				(a, b) => a.applicationStatus - b.applicationStatus
			);
			setStudents(sortedStudents);
			setDonors(donorsRes.data.donors);
		} catch (err) {
			console.error("Error fetching data for admin application:", err);
			setError("Failed to load data. Please try again later.");
		} finally { setIsLoading(false) }
	}

	useEffect(() => { fetchData() }, []);

	// Apply filters with AND gate logic

	useEffect(() => {

		let filtered = [...students];

		// Filter by application status (AND gate)
		if (filters.applicationStatus !== "all") {
			filtered = filtered.filter(student =>
				String(student.applicationStatus) === filters.applicationStatus
			);
		}

		// Filter by scholarship type (AND gate)
		if (filters.sclrType !== "all") {
			filtered = filtered.filter(student =>
				student.sclrType === filters.sclrType
			);
		}

		// Filter by tutor verification (AND gate)
		if (filters.tutorVerification !== "all") {
			filtered = filtered.filter(student =>
				String(student.tutorVerification) === filters.tutorVerification
			);
		}

		// Filter by special categories
		if (filters.specialCategories && filters.specialCategories.length > 0) {
			const categoriesToFilter = filters.specialCategories.filter(cat => cat !== "All");
			if (categoriesToFilter.length === 0) { }
			else {
				filtered = filtered.filter(student => {
					return categoriesToFilter.includes(student.specialCategory);
				});
			}
		} else { filtered = [] }

		setFilteredStudents(filtered);
	}, [filters, students]);

	// Apply search to filtered students only
	useEffect(() => {
		if (searchTerm.trim() === "") {
			setSearchedStudents(filteredStudents);
		} else {
			const lower = searchTerm.toLowerCase();
			const searched = filteredStudents.filter(student =>
				student.name?.toLowerCase().includes(lower) ||
				student.registerNo?.toLowerCase().includes(lower) ||
				student.department?.toLowerCase().includes(lower)
			);
			setSearchedStudents(searched);
		}
	}, [searchTerm, filteredStudents]);

	const isViewPage = location.pathname.endsWith("/view");

	const openAcceptModal = (student) => {
		setSelectedStudent(student);
		setShowAcceptModal(true);
		setShowRejectModal(false);
	};

	const openRejectModal = (student) => {
		setSelectedStudent(student);
		setShowRejectModal(true);
		setShowAcceptModal(false);
	};

	const closeModal = () => {
		setShowAcceptModal(false);
		setShowRejectModal(false);
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center">
				<img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
				<p className="text-gray-600 font-medium text-lg">Loading scholarship applications...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<p className="text-red-600 font-semibold">{error}</p>
			</div>
		);
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

					<FilterSection
						filters={filters}
						setFilters={setFilters}
					/>

					<ActionBar
						totalStudents={searchedStudents.length}
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
					/>

					<ApplicationTable
						students={searchedStudents}
						openAcceptModal={openAcceptModal}
						openRejectModal={openRejectModal}
					/>

					<AcceptModal
						donors={donors}
						selectedStudent={selectedStudent}
						showAcceptModal={showAcceptModal}
						closeModal={closeModal}
					/>

					<RejectModal
						selectedStudent={selectedStudent}
						showRejectModal={showRejectModal}
						closeModal={closeModal}
					/>
				</>
			)}
		</div>
	)
}

export default SclrAdministration;