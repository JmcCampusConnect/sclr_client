import React from "react";

const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

function DonorActionBar({ donors, handleSearch }) {

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <input
                type="text"
                placeholder="🔍 Search donors..."
                className={`w-full md:w-1/2 ${formControlClass}`}
                onChange={(e) => handleSearch(e.target.value)}
            />
            <p className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                No. of Records : {" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {donors.length}
                </span>
            </p>
        </div>
    )
}

export default DonorActionBar;