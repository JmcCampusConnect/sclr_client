import React, { useEffect, useState } from "react";
import axios from "axios";
import DonorTable from "../../../components/Donar/DonarTable.jsx";
import AddDonorModal from "../../../components/Donar/AddDonorModal.jsx";
import EditDonorModal from "../../../components/Donar/EditDonorModal.jsx";
import ActionBar from "../../../components/Donar/ActionBar.jsx";
import FilterSection from "../../../components/Donar/FilterSection.jsx";
import DeleteDonorModal from "../../../components/Donar/DeleteDonarModal.jsx";
import AmtDonarModal from "../../../components/Donar/AmtDonarModal.jsx";

const apiUrl = import.meta.env.VITE_API_URL;

function Donor() {

	const [donors, setDonors] = useState([]);
	const [showAddModal, setShowAddModal] = useState(false);
	const [editDonor, setEditDonor] = useState(null);
	const [deleteDonor, setDeleteDonor] = useState(null);
	const [amtDonarModal, setAmtDonarModal] = useState(null);

	const fetchDonors = async () => {
		try {
			const response = await axios.get(`${apiUrl}/api/donor/fetchDonors`);
			setDonors(response.data.donors);
		} catch (error) {
			console.error("Error fetching donor data : ", error);
		}
	}

	useEffect(() => { fetchDonors() }, []);

	const handleAddDonor = (newDonor) => {
		setDonors((prev) => [...prev, newDonor]);
	}

	const handleEditDonor = (updatedDonor) => {
		setDonors((prev) =>
			prev.map((donor) => (donor.donorId === updatedDonor.donorId ? updatedDonor : donor))
		)
	}

	const handleDeleteDonor = (deletedId) => {
		setDonors((prev) => prev.filter((donor) => donor.donorId !== deletedId));
	}

	return (
		<div className="relative">
			<header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
				<h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
					Donor Management
				</h1>
			</header>
			<FilterSection onAdd={() => setShowAddModal(true)} />
			<ActionBar donors={donors} />
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
				/>
			)}
		</div>
	)
}

export default Donor;