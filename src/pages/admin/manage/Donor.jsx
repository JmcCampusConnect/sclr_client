import React, { useEffect, useState } from "react";
import axios from "axios";
import DonorTable from "../../../components/Donor/DonorTable";
import AddDonorModal from "../../../components/Donor/AddDonorModal";
import EditDonorModal from "../../../components/Donor/EditDonorModal";
import DonorActionBar from "../../../components/Donor/DonorActionBar";
import DonorFilters from "../../../components/Donor/DonorFilters";
import DeleteDonorModal from "../../../components/Donor/DeleteDonorModal";
import AmtDonarModal from "../../../components/Donor/AmtDonorModal";

const apiUrl = import.meta.env.VITE_API_URL;

function Donor() {

	const [allDonors, setAllDonors] = useState([]);
	const [donors, setDonors] = useState([]);
	const [showAddModal, setShowAddModal] = useState(false);
	const [editDonor, setEditDonor] = useState(null);
	const [deleteDonor, setDeleteDonor] = useState(null);
	const [amtDonarModal, setAmtDonarModal] = useState(null);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	const fetchDonors = async () => {
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
			console.error("Error fetching donor data : ", error);
		}
	};

	useEffect(() => {
		fetchDonors();
	}, []);

	// ADD DONOR
	const handleAddDonor = (newDonor) => {
		setAllDonors((prev) => [...prev, newDonor]);
		setDonors((prev) => [...prev, newDonor]);
	};

	// EDIT DONOR
	const handleEditDonor = (updatedDonor) => {
		setAllDonors((prev) => prev.map((donor) => donor.donorId === updatedDonor.donorId ? updatedDonor : donor))
		setDonors((prev) => prev.map((donor) => donor.donorId === updatedDonor.donorId ? updatedDonor : donor))
	};

	// DELETE DONOR
	const handleDeleteDonor = (deletedId) => {
		setAllDonors((prev) => prev.filter((donor) => donor.donorId !== deletedId));
		setDonors((prev) => prev.filter((donor) => donor.donorId !== deletedId));
	};

	// HANDLE CATEROGIES CHANGE
	const handleCategoryChange = (category) => {
		setSelectedCategories((prevSelected) => {
			if (prevSelected.includes(category)) {
				return prevSelected.filter((item) => item !== category);
			} else {
				return [...prevSelected, category];
			}
		});
	};

	useEffect(() => {
		let filtered = [...allDonors];
		if (selectedCategories.length > 0 && !selectedCategories.includes("All")) {
			filtered = filtered.filter((donor) => selectedCategories.includes(donor.donorType))
		}
		if (searchTerm.trim() !== "") {
			filtered = filtered.filter(
				(donor) =>
					donor.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					donor.donorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
					donor.donorType.toLowerCase().includes(searchTerm.toLowerCase())
			)
		}
		setDonors(filtered);
	}, [selectedCategories, allDonors, searchTerm]);

	const handleSearch = (term) => { setSearchTerm(term) }

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
	)
}

export default Donor;