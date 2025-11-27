import React from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const apiUrl = import.meta.env.VITE_API_URL;

function DeleteAcademicYearModal({ academic, onClose, onDelete }) {

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${apiUrl}/api/application/settings/deleteAcademicYear/${academic.academicId}`);
            if (response.status === 200) {
                alert("Academic year deleted successfully!");
                onDelete(academic.academicId);
                onClose();
            }
        } catch (error) {
            if (error.status == 403) { alert(`${error.response.data.message}`) }
            console.error("Error deleting academic year : ", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[90%] max-w-2xl border border-gray-200 dark:border-gray-700 transition-all duration-200">

                {/* Header */}
                <div className="flex flex-col items-center text-center px-8 pt-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="bg-gradient-to-tr from-red-500 to-red-600 text-white rounded-full p-5 shadow-md mb-5">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="text-3xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Confirm Deletion
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-md leading-relaxed max-w-sm">
                        This action <span className="text-red-500 font-semibold">cannot be undone.</span>
                        <span> Are you sure you want to permanently remove this academic year?</span>
                    </p>
                </div>

                {/* Academic Summary */}
                <div className="px-8 py-5">
                    <div className="rounded-xl bg-gray-50 dark:bg-gray-800/70 p-4 border border-gray-200 dark:border-gray-700 shadow-sm text-center">
                        <p className="text-md text-gray-500 dark:text-gray-400 font-mono">
                            Academic ID : {academic.academicId}
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {academic.academicYear}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Start Date : <span className="font-medium">{academic.applnStartDate ? academic.applnStartDate.split("T")[0] : ""}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            End Date : <span className="font-medium">{academic.applnEndDate ? academic.applnEndDate.split("T")[0] : ""}</span>
                        </p>
                        {academic.isActive && (
                            <p className="text-sm mt-2 text-green-600 font-semibold">
                                This is the ACTIVE academic year!
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer Buttons */}
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
    );
}

export default DeleteAcademicYearModal;
