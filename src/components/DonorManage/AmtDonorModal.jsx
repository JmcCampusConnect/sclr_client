import React, { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const primaryButtonClass = "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md";

function AmtDonorModal({ onClose, donorData }) {

    const [amountData, setAmountData] = useState({
        donorId: donorData?.donorId || "",
        donorName: donorData?.donorName || "",
        donorType: donorData?.donorType || "",
        generalAmt: "",
        zakkathAmt: "",
    });

    const [transactions, setTransactions] = useState([]);
    const [addAmountPopup, setAddAmountPopup] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/donor/getTransactions/${donorData.donorId}`);
                setTransactions(response.data.transaction);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };
        fetchTransactions()
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setAmountData((prev) => ({
            ...prev, [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${apiUrl}/api/donor/addAmount`, amountData);
            alert('Amount added successfully');
            onClose();
        } catch (err) {
            console.error("Error saving transaction : ", err);
        }
    }

    const handleEdit = (id) => {
        setTransactions(prev =>
            prev.map(t =>
                (t._id === id || t.id === id) ? { ...t, editing: true } : t
            )
        );
    };

    const handleSave = (id) => {
        setTransactions(prev =>
            prev.map(t =>
                (t._id === id || t.id === id) ? { ...t, editing: false } : t
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
        }
        try {
            axios.post(`${apiUrl}/api/donor/editTransaction`, saved);
            alert("Transaction edited successfully");
        } catch (error) {
            console.error("Error saving edited transaction : ", error);
        }

    };

    const handleChangeTransaction = (id, field, value) => {
        setTransactions(prev =>
            prev.map(t =>
                (t._id === id || t.id === id) ? { ...t, [field]: value } : t
            )
        );
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.post(
                `${apiUrl}/api/donor/deleteTransaction`,
                { id: id }
            );
            if (response.data.success) {
                alert(response.data.message || "Donor transaction deleted successfully");
                onClose();
            } else {
                alert(response.data.message || "Failed to delete donor transaction");
            }
        } catch (error) {
            console.error("Error deleting donor transaction : ", error);
            alert("Server error while deleting donor transaction");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full border border-gray-200 dark:border-gray-700 max-w-6xl hide-scrollbar overflow-y-auto max-h-[80vh]">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        🎗️ {donorData.donorId} - {donorData.donorName}
                    </h1>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold transition"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-7 font-semibold">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">

                        {/* Header */}
                        <div className={`flex items-center justify-between ${addAmountPopup ? "border-b border-gray-300 dark:border-gray-700 pb-2 mb-4" : ""}`}>
                            {!addAmountPopup ? (
                                <>
                                    <div />
                                    <button
                                        type="button"
                                        onClick={() => setAddAmountPopup(true)}
                                        className={primaryButtonClass}
                                    >
                                        Add Payment
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                        💰 Add Payment
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => setAddAmountPopup(false)}
                                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400
                                            dark:hover:text-gray-200 text-xl font-bold transition"
                                        aria-label="Close"
                                    >
                                        ×
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Payment Inputs and Buttons */}
                        {addAmountPopup && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                                    <Input
                                        label="General Amount"
                                        name="generalAmt"
                                        value={amountData.generalAmt}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        label="Zakkath Amount"
                                        name="zakkathAmt"
                                        value={amountData.zakkathAmt}
                                        onChange={handleChange}
                                    />
                                </div>
                                {/* Footer Actions */}
                                <div className="flex justify-end gap-4 pt-5 ">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-6 py-2.5 rounded-lg font-semibold bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={amountData.generalAmt === "" && amountData.zakkathAmt === ""}
                                        className={`px-6 py-2.5 rounded-lg font-semibold text-white shadow-md transition
   									        ${amountData.generalAmt === "" && amountData.zakkathAmt === ""
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-700 cursor-pointer"} `}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Table for Showing Transaction history? */}
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg mt-6">
                            <div className="">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
                                    <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
                                        <tr>
                                            {[
                                                "S.No",
                                                "General Amount",
                                                "Zakkath Amount",
                                                "Date of Payment",
                                                "Actions"
                                            ].map((header) => (
                                                <th
                                                    key={header}
                                                    className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {transactions?.length > 0 ? (
                                            transactions.map((tr, index) => (
                                                <tr
                                                    key={tr._id || tr.id || index}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
                                                >
                                                    {/* S.No */}
                                                    <td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
                                                        {index + 1}
                                                    </td>

                                                    {/* General Amount */}
                                                    <td className="px-4 py-4">
                                                        <input
                                                            type="number"
                                                            value={tr.generalAmt}
                                                            disabled={!tr.editing}
                                                            onChange={(e) =>
                                                                handleChangeTransaction(
                                                                    tr._id,
                                                                    "generalAmt",
                                                                    e.target.value
                                                                )
                                                            }
                                                            onWheel={(e) => e.currentTarget.blur()}
                                                            className={`w-24 text-center rounded-md px-2 py-1.5 text-sm lg:text-base transition
                                                                ${tr.editing
                                                                    ? "border border-gray-300 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500"
                                                                    : "border-transparent bg-transparent cursor-default"
                                                                }`}
                                                        />
                                                    </td>

                                                    {/* Zakkath Amount */}
                                                    <td className="px-4 py-4">
                                                        <input
                                                            type="number"
                                                            value={tr.zakkathAmt}
                                                            disabled={!tr.editing}
                                                            onChange={(e) =>
                                                                handleChangeTransaction(
                                                                    tr._id,
                                                                    "zakkathAmt",
                                                                    e.target.value
                                                                )
                                                            }
                                                            onWheel={(e) => e.currentTarget.blur()}
                                                            className={`w-24 text-center rounded-md px-2 py-1.5 text-sm lg:text-base transition
                                                                ${tr.editing
                                                                    ? "border border-gray-300 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500"
                                                                    : "border-transparent bg-transparent cursor-default"
                                                                }`}
                                                        />
                                                    </td>

                                                    {/* Date */}
                                                    <td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                                        {new Date(tr.createdAt).toLocaleDateString("en-GB")}
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <div className="flex justify-center gap-2">
                                                            {!tr.editing ? (
                                                                <button
                                                                    onClick={() => handleEdit(tr._id)}
                                                                    className="w-20 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition text-xs sm:text-sm"
                                                                >
                                                                    Edit
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleSave(tr._id)}
                                                                    className="w-20 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition text-xs sm:text-sm"
                                                                >
                                                                    Save
                                                                </button>
                                                            )}

                                                            <button
                                                                onClick={() => handleDelete(tr._id)}
                                                                className="w-20 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition text-xs sm:text-sm"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            /* No Transactions Found */
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="p-4 text-sm lg:text-base text-gray-700 dark:text-gray-300"
                                                >
                                                    No transactions found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
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

export default AmtDonorModal;