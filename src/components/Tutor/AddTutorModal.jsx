import React, { useState } from "react";
import axios from "axios";
import '../../App.css';

const apiUrl = import.meta.env.VITE_API_URL;

function AddTutorModal({ onClose, onAddTutor }) {

	const [formData, setFormData] = useState({
		staffId: "T" + Math.floor(Math.random() * 10000), staffName: "", departmentId: "", category: "", section: "", batch: ""
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${apiUrl}/api/donor/addDonor`, formData);
			onAddDonor(response.data.donor);
			onClose();
		} catch (error) {
			console.error("Error adding donor:", error);
		}
	}

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
			<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full border border-gray-200 dark:border-gray-700 max-w-6xl hide-scrollbar overflow-y-auto max-h-[80vh]">
				{/* Header */}
				<div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
						🎗️ Add Tutor
					</h1>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold transition"
					>
						×
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-7 font-semibold">

					{/* Section 1: Basic Info */}
					<div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50 shadow-sm">
						<h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
							🧾 Basic Information
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

							<Input label="Staff ID" name="staffId" value={formData.staffId} />
							<Input label="Staff Name" name="staffName" value={formData.staffName} />

							<Select
								label="Department ID"
								name="departmentId"
								value={formData.departmentId}
								onChange={handleChange}
								required
								options={["CSE", "ECE", "ME", "CE", "EE"]}
							/>

							<Select
								label="Catergory"
								name="category"
								value={formData.category}
								onChange={handleChange}
								required
								options={["AIDED", 'SFM', 'SFW']}
							/>

							<Select
								label="Batch"
								name="batch"
								value={formData.batch}
								onChange={handleChange}
								required
								options={["2020", "2021", "2022", "2023", "2024"]}
							/>

							<Select
								label="Section"
								name="section"
								value={formData.section}
								onChange={handleChange}
								required
								options={["AIDED", 'SFM', 'SFW']}
							/>
						</div>
					</div>

					{/* Footer Actions */}
					<div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
						<button
							type="button"
							onClick={onClose}
							className="px-6 py-2.5 rounded-lg font-semibold bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-6 py-2.5 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md transition"
						>
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

const Input = ({ label, name, type = "text", value, onChange, ...props }) => (
	<div>
		<label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
			{label} : {props.required && <span className="text-red-500">*</span>}
		</label>
		<input
			type={type}
			name={name}
			value={value}
			onChange={onChange}
			{...props}
			className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
		/>
	</div>
)

const Select = ({ label, name, value, onChange, options, required }) => (
	<div>
		<label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
			{label} : {required && <span className="text-red-500">*</span>}
		</label>
		<select
			name={name}
			value={value}
			onChange={onChange}
			required={required}
			className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
		>
			<option value="">Select</option>
			{options?.map((opt) => (
				<option key={opt} value={opt}>
					{opt}
				</option>
			))}
		</select>
	</div>
)

export default AddTutorModal;