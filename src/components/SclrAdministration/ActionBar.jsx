import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function ActionBar({ totalStudents, searchTerm, setSearchTerm }) {

    const navigate = useNavigate();
    const { userId } = useParams();
    const primaryButtonClass = "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md";
    const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

    return (
        <>
            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                    <div className="flex justify-end gap-4 w-full">
                        <button
                            className={primaryButtonClass}
                            // onClick={() => alert('Work under progress')}
                            onClick={() => navigate(`/admin/quickRejection`)}
                        >
                            Quick Rejection
                        </button>
                    </div>
                </div>
            </div >

            {/* Search + Count */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8" >
                <input
                    placeholder="🔍 Search Applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full md:w-1/2 ${formControlClass}`}
                />
                <p className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    No. of Students : {" "}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {totalStudents}
                    </span>
                </p>
            </div>
        </>
    )
}

export default ActionBar;