import React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from 'lucide-react';

function ActionBar({ totalStudents, searchTerm, setSearchTerm }) {

    const navigate = useNavigate();
    const primaryButtonClass = "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 shadow-md";
    const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-gray-400 focus:border-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 outline-none transition";

    return (
        <>
            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                    <div className="flex justify-end gap-4 w-full">
                        <button
                            className={primaryButtonClass}
                            onClick={() => navigate(`/admin/rejectApplications`)}
                        >
                            Reject Ineligible Applications
                        </button>
                    </div>
                </div>
            </div>

            {/* Search + Count */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="relative w-full md:w-1/2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                        placeholder="Search Applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 ${formControlClass}`}
                    />
                </div>
                <p className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    No. of Students :{" "}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {totalStudents}
                    </span>
                </p>
            </div>
        </>
    )
}

export default ActionBar;