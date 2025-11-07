import React, {useEffect, useState} from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

function AmtDonorModal({onClose, donorData}) {
	// console.log("add amt", donorData)

	const [amountData, setAmountData] = useState({
		donorId: donorData?.donorId || "",
		donorName: donorData?.donorName || "",
		donorType: donorData?.donorType || "",
		generalAmt: "",
		zakkathAmt: "",
	});

	// Handle input change for both amount fields
	const handleChange = (e) => {
		const {name, value} = e.target;
		setAmountData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Submit handler (you can later replace with actual axios post)
	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("Sending to backend:", amountData);

		try {
			const res = await axios.post(`${apiUrl}/api/donor/addAmount`, amountData);
			console.log("Transaction Saved:", res.data);
			onClose();
		} catch (err) {
			console.error("Error saving transaction:", err);
		}
	};


	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
			<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full border border-gray-200 dark:border-gray-700 max-w-6xl hide-scrollbar overflow-y-auto max-h-[80vh]">
				{/* Header */}
				<div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
						🎗️ Add Amount
					</h1>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold transition"
					>
						×
					</button>
				</div>

				{/* Form */}
				<form className="p-6 space-y-7 font-semibold" onSubmit={handleSubmit}>

					{/* Section 1: Payment Details */}
					<div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50 shadow-sm">
						<h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
							💰 Payment Details
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Input
								label="General Amount"
								name={"generalAmt"}
								value={amountData.generalAmt}
								onChange={handleChange}
							/>
							<Input
								label="Zakkath Amount"
								name={"zakkathAmt"}
								value={amountData.zakkathAmt}
								onChange={handleChange}

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

const Input = ({label, name, type = "text", value, onChange, ...props}) => (
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

const Select = ({label, name, value, onChange, options, required}) => (
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

const Radio = ({label, name, checked, onChange}) => (
	<label className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
		<div className='flex flex-col justify-center'>
			<div className="flex gap-4 items-center mt-2">
				<label className="flex items-center gap-2 text-md">
					<input
						type="radio"
						name={name}
						checked={checked}
						onChange={onChange}
						className="w-4 h-4 accent-blue-500"
					/>
					{label}
				</label>
			</div>
		</div>
	</label>
)

export default AmtDonorModal;