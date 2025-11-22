import React, { useEffect, useState } from "react";
import axios from "axios";
import DonorTable from "../../../components/DonorManage/DonorTable";
import AddDonorModal from "../../../components/DonorManage/AddDonorModal";
import EditDonorModal from "../../../components/DonorManage/EditDonorModal";
import DonorActionBar from "../../../components/DonorManage/DonorActionBar";
import DonorFilters from "../../../components/DonorManage/DonorFilters";
import DeleteDonorModal from "../../../components/DonorManage/DeleteDonorModal";
import AmtDonarModal from "../../../components/DonorManage/AmtDonorModal";
import Loading from "../../../assets/svg/Pulse.svg";

const apiUrl = import.meta.env.VITE_API_URL;

function DonorManage() {
	const [allDonors, setAllDonors] = useState([]);
	const [donors, setDonors] = useState([]);
	const [showAddModal, setShowAddModal] = useState(false);
	const [editDonor, setEditDonor] = useState(null);
	const [deleteDonor, setDeleteDonor] = useState(null);
	const [amtDonarModal, setAmtDonarModal] = useState(null);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchDonors = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await axios.get(`${apiUrl}/api/donor/fetchDonors`);
			const donors = response.data.donors || [];
			const sortedDonors = [...donors].sort((a, b) => {
				const idA = parseInt(a.donorId, 10);
				const idB = parseInt(b.donorId, 10);
				return idA - idB;
			});

			setAllDonors(sortedDonors);
			setDonors(sortedDonors);
		} catch (error) {
			console.error("Error fetching donor data:", error);
			setError("Failed to load donor data. Please try again later.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchDonors();
	}, []);

	const handleAddDonor = (newDonor) => {
		setAllDonors((prev) => [...prev, newDonor]);
		setDonors((prev) => [...prev, newDonor]);
	};

	const handleEditDonor = (updatedDonor) => {
		setAllDonors((prev) =>
			prev.map((donor) =>
				donor.donorId === updatedDonor.donorId ? updatedDonor : donor
			)
		);
		setDonors((prev) =>
			prev.map((donor) =>
				donor.donorId === updatedDonor.donorId ? updatedDonor : donor
			)
		);
	};

	const handleDeleteDonor = (deletedId) => {
		setAllDonors((prev) => prev.filter((donor) => donor.donorId !== deletedId));
		setDonors((prev) => prev.filter((donor) => donor.donorId !== deletedId));
	};

	const handleCategoryChange = (category) => {
		setSelectedCategories((prevSelected) => {
			// If "All" is clicked
			if (category === "All") {
				// If "All" is already checked, uncheck it along with others
				if (prevSelected.includes("All")) {
					return [];
				} else {
					// If "All" is not checked, check only "All" and uncheck others
					return ["All"];
				}
			} else {
				// If "Well Wishers" or "Alumini" is clicked
				let newSelected = prevSelected.includes(category)
					? prevSelected.filter((item) => item !== category)
					: [...prevSelected, category];

				// If "All" was selected, remove it when selecting specific categories
				if (newSelected.includes("All")) {
					newSelected = newSelected.filter((item) => item !== "All");
				}

				return newSelected;
			}
		});
	};

	useEffect(() => {

		let filtered = [...allDonors];

		if (selectedCategories.length > 0 && !selectedCategories.includes("All")) {
			filtered = filtered.filter((donor) =>
				selectedCategories.includes(donor.donorType)
			);
		}

		if (searchTerm.trim() !== "") {
			filtered = filtered.filter(
				(donor) =>
					donor.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					donor.donorId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					donor.donorType?.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		setDonors(filtered);
	}, [selectedCategories, allDonors, searchTerm]);

	const handleSearch = (term) => setSearchTerm(term);

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center">
				<img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
				<p className="text-gray-600 font-medium text-lg">Loading donors...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<p className="text-red-600 font-semibold text-lg">{error}</p>
				<button
					onClick={fetchDonors}
					className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
				>
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="relative">
			<header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
				<h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
					Donor Management
				</h1>
			</header>

			<DonorFilters
				onAdd={() => setShowAddModal(true)}
				filterOptions={handleCategoryChange}
				selectedCategories={selectedCategories}
			/>

			<DonorActionBar donors={donors} handleSearch={handleSearch} />

			<DonorTable
				donors={donors}
				onEdit={(donor) => setEditDonor(donor)}
				onDelete={(donor) => setDeleteDonor(donor)}
				onAmount={(donor) => setAmtDonarModal(donor)}
			/>

			{/* MODALS */}
			{showAddModal && (
				<AddDonorModal
					onClose={() => setShowAddModal(false)}
					onAddDonor={handleAddDonor}
				/>
			)}

			{editDonor && (
				<EditDonorModal
					donor={editDonor}
					onClose={() => setEditDonor(null)}
					onEditDonor={handleEditDonor}
				/>
			)}

			{deleteDonor && (
				<DeleteDonorModal
					donor={deleteDonor}
					onClose={() => setDeleteDonor(null)}
					onDelete={handleDeleteDonor}
				/>
			)}

			{amtDonarModal && (
				<AmtDonarModal
					onClose={() => setAmtDonarModal(null)}
					donorData={amtDonarModal}
				/>
			)}
		</div>
	);
}

export default DonorManage;