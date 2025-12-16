import React from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const apiUrl = import.meta.env.VITE_API_URL;

function DeleteModal({ donor, onClose, onDelete }) {

    const handleDelete = async () => {
        try {
            const respose = await axios.delete(`${apiUrl}/api/distribution/stmtDelete/${donor._id}`);
            onDelete(donor.donorId);
            if (respose.status == 200) {
                alert("Distribution statement deleted successfully")
            }
            onClose();
        } catch (error) {
            console.error("Error deleting distribution statement : ", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[90%] max-w-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-200 scale-100">

                {/* Header with Icon */}
                <div className="flex flex-col items-center text-center px-8 pt-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="bg-gradient-to-tr from-red-500 to-red-600 text-white rounded-full p-5 shadow-md mb-5">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="text-3xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Confirm Deletion
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-md leading-relaxed max-w-sm">
                        This action <span className="font-semibold text-red-500">cannot be undone.</span>
                        <span> Are you sure you want to permanently remove this donor from the system?</span>
                    </p>
                </div>

                {/* Donor Summary Card */}
                <div className="px-8 py-5">
                    <div className="rounded-xl dark:bg-gray-800/70 p-4 border border-gray-200 dark:border-gray-700 shadow-sm text-center">
                        <p className="text-md text-gray-500 dark:text-gray-400 font-mono">
                            Register No : {donor.registerNo}
                        </p>
                        <p className="text-md text-gray-500 dark:text-gray-400 font-mono">
                            Name : {donor.name}
                        </p>
                        <div className="mt-1 flex justify-center gap-6 text-base font-semibold">
                            <span className="text-green-600 dark:text-green-400">
                                Amt Given - ₹ {donor.givenAmt}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {donor.donorName}
                        </h3>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-5 py-2.5 rounded-lg font-semibold bg-gradient-to-tr from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal;