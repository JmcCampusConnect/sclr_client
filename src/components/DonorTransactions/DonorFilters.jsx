import React from "react";

function DonorFilters() {

    return (
        <div className="mb-6 flex justify-between">
            {/* Filter Buttons */}
            <div className="flex gap-4 flex-wrap">

                {/* ALL */}
                <label className="flex items-center p-3 px-6 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 
                    transition-colors duration-200 cursor-pointer shadow-sm"
                >
                    <input
                        type="checkbox"
                        className="h-4 w-4 accent-indigo-600 rounded-md focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm lg:text-base text-gray-700 dark:text-gray-200">
                        All
                    </span>
                </label>

                {/* WELL WISHERS */}
                <label className="flex items-center p-3 px-6 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 
                    transition-colors duration-200 cursor-pointer shadow-sm"
                >
                    <input
                        type="checkbox"
                        className="h-4 w-4 accent-indigo-600 rounded-md focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm lg:text-base text-gray-700 dark:text-gray-200">
                        Well Wishers
                    </span>
                </label>

                {/* ALUMNI */}
                <label className="flex items-center p-3 px-6 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 
                    transition-colors duration-200 cursor-pointer shadow-sm"
                >
                    <input
                        type="checkbox"
                        className="h-4 w-4 accent-indigo-600 rounded-md focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm lg:text-base text-gray-700 dark:text-gray-200">
                        Alumni
                    </span>
                </label>

            </div>

            {/* Add Donor Button */}
            <div className="flex items-center">
                <button
                    className="flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white 
                    bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-indigo-500 transition duration-150 shadow-md"
                    onClick={() => alert('Work under progress')}

                >
                    Add Transactions
                </button>
            </div>
        </div>
    )
}

export default DonorFilters;
