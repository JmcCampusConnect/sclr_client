import React, {useEffect, useState} from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

function AmtDonorModal({onClose, donorData}) {

	const [amountData, setAmountData] = useState({
		donorId: donorData?.donorId || "",
		donorName: donorData?.donorName || "",
		donorType: donorData?.donorType || "",
		generalAmt: "",
		zakkathAmt: "",
	});

	const [transactions, setTransactions] = useState([]);

	// console.log(donorData)

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				const response = await axios.get(`${apiUrl}/api/donor/getTransactions/${donorData.donorId}`);
				// Assuming response.data contains the transactions array
				// console.log(response)
				setTransactions(response.data.transaction);
			} catch (error) {
				console.error("Error fetching transactions:", error);
			}
		};

		fetchTransactions()
	}, []);

	const [addAmountPopup, setAddAmountPopup] = useState(false);



	const handleChange = (e) => {
		const {name, value} = e.target;
		setAmountData((prev) => ({
			...prev, [name]: value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(`${apiUrl}/api/donor/addAmount`, amountData);
			alert('Amount added successfully');
			onClose();
		} catch (err) {
			console.error("Error saving transaction:", err);
		}
	}

	/// For Amount Popup


	const handleEdit = (id) => {
		setTransactions(prev =>
			prev.map(t =>
				(t._id === id || t.id === id) ? {...t, editing: true} : t
			)
		);
	};

	const handleSave = (id) => {
		setTransactions(prev =>
			prev.map(t =>
				(t._id === id || t.id === id) ? {...t, editing: false} : t
			)
		);
		const tr = transactions.find(t => t._id === id || t.id === id);
		let saved = null;
		if (tr) {
			saved = {
				_id: tr._id || tr.id,
				generalAmt: tr.generalAmt,
				zakkathAmt: tr.zakkathAmt,
			};
			console.log('Saved row:', saved);
		}

		try {

			const response = axios.post(`${apiUrl}/api/report/editTransaction`, saved);
			alert("Transaction edited successfully");

		} catch (error) {
			console.error("Error saving edited transaction:", error);
		}

	};

	const handleChangeTransaction = (id, field, value) => {
		setTransactions(prev =>
			prev.map(t =>
				(t._id === id || t.id === id) ? {...t, [field]: value} : t
			)
		);
	};

	// const handleDelete = (id) => {
	// 	if (!confirm("Delete this transaction?")) return;
	// 	setTransactions(prev => prev.filter(t => t.id !== id));
	// };


	const handleDelete = async (id) => {
		console.log(id)
		try {
			const response = await axios.post(
				`${apiUrl}/api/report/deleteTransaction`,
				{id: id}
			);
			if (response.data.success) {
				alert(response.data.message || "Donor transaction deleted successfully");
				// onDeleted?.(donor.donorId);
				onClose();
			} else {
				alert(response.data.message || "Failed to delete donor transaction");
			}
		} catch (error) {
			console.error("Error deleting donor transaction :", error);
			alert("Server error while deleting donor transaction");
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
					<div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
						<h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
							💰 Payment Details
						</h2>

						<button
							type="button"
							onClick={() => setAddAmountPopup(!addAmountPopup)}
							className={`w-40 px-3 py-1.5  ${addAmountPopup ? 'bg-red-500 hover:bg-red-900 cursor-pointer' : ' bg-green-500 hover:bg-green-600 cursor-pointer'} text-white rounded-lg font-medium transition text-xs sm:text-sm`}
						>
							{addAmountPopup ? "close Add" : "Add Amount"}

						</button>
						{addAmountPopup && (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
						</div>)}



					</div>


					{/* Table for Showing Transaction history? */}
					<div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
						<table className="min-w-full divide-y divide-gray-200 bg-white text-sm dark:divide-gray-700 dark:bg-gray-900">
							<thead className="bg-gray-50 dark:bg-gray-800">
								<tr>
									<th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">S.No</th>
									<th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">General Amount</th>
									<th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Zakkath Amount</th>
									<th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Date of Payment</th>
									<th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Actions</th>
								</tr>
							</thead>

							<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
								{transactions?.map((tr, index) => (
									<tr key={tr._id || tr.id || index} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
										<td className="whitespace-nowrap px-4 py-3 text-gray-700 dark:text-gray-300">
											{index + 1}
										</td>

										{/* General Amount */}
										<td className="px-4 py-3">
											<input
												type="number"
												value={tr.generalAmt}
												disabled={!tr.editing}
												onChange={(e) => handleChangeTransaction(tr._id, "generalAmt", e.target.value)}
												onWheel={(e) => e.currentTarget.blur()}
												className={`w-full rounded-md border-gray-200 bg-transparent px-2 py-1.5 transition focus:border-blue-500 focus:ring-blue-500 sm:text-sm 
                ${tr.editing ? 'border bg-white dark:bg-gray-900 shadow-sm' : 'border-transparent cursor-default'}`}
											/>
										</td>

										{/* Zakkath Amount */}
										<td className="px-4 py-3">
											<input
												type="number"
												value={tr.zakkathAmt}
												disabled={!tr.editing}
												onChange={(e) => handleChangeTransaction(tr._id, "zakkathAmt", e.target.value)}
												onWheel={(e) => e.currentTarget.blur()}
												className={`w-full rounded-md border-gray-200 bg-transparent px-2 py-1.5 transition focus:border-blue-500 focus:ring-blue-500 sm:text-sm 
                ${tr.editing ? 'border bg-white dark:bg-gray-900 shadow-sm' : 'border-transparent cursor-default'}`}
											/>
										</td>

										{/* Date */}
										<td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-400">
											{new Date(tr.createdAt).toLocaleDateString("en-GB")}
										</td>

										{/* Actions Column (Combined Edit & Delete) */}
										<td className="whitespace-nowrap px-4 py-3 text-center">
											<div className="flex justify-center gap-2">
												{!tr.editing ? (
													<button
														type="button"
														onClick={() => handleEdit(tr._id || tr.id)}
														className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
													>
														Edit
													</button>
												) : (
													<button
														type="button"
														onClick={() => handleSave(tr._id || tr.id)}
														className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-700"
													>
														Save
													</button>
												)}

												<button
													type="button"
													onClick={() => handleDelete(tr._id)}
													className="inline-flex items-center rounded-md border border-transparent bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
												>
													Delete
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
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
							disabled={amountData.generalAmt === "" && amountData.zakkathAmt === ""}
							className={`px-6 py-2.5 rounded-lg font-semibold text-white shadow-md transition
   									 ${amountData.generalAmt === "" && amountData.zakkathAmt === ""
									? "bg-gray-400 cursor-not-allowed"
									: "bg-green-600 hover:bg-green-700 cursor-pointer"} // Enabled state `}
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

export default AmtDonorModal;