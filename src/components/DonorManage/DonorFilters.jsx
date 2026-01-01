import React from "react";

const primaryButtonClass = "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md";

function DonorFilters({ onAdd, filterOptions, selectedCategories }) {

    const isAllChecked = selectedCategories.includes("All");
    const isWellWishersChecked = selectedCategories.includes("Well Wishers");
    const isAlumniChecked = selectedCategories.includes("Alumini");
    const isOthersChecked = selectedCategories.includes("Others");

    return (
        <div className="mb-6 flex justify-between">
            <div>
                <div className="flex gap-4 flex-wrap">

                    {/* ALL */}
                    <label
                        className="flex items-center p-3 px-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer shadow-sm"
                    >
                        <input
                            type="checkbox"
                            checked={isAllChecked}
                            onChange={() => filterOptions("All")}
                            className="h-4 w-4 accent-indigo-600 rounded-md focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm lg:text-base text-gray-700 dark:text-gray-200">
                            All
                        </span>
                    </label>

                    {/* WELL WISHERS */}
                    <label
                        className="flex items-center p-3 px-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer shadow-sm"
                    >
                        <input
                            type="checkbox"
                            checked={isAllChecked || isWellWishersChecked}
                            onChange={() => filterOptions("Well Wishers")}
                            className="h-4 w-4 accent-indigo-600 rounded-md focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm lg:text-base text-gray-700 dark:text-gray-200">
                            Well Wishers
                        </span>
                    </label>

                    {/* ALUMNI */}
                    <label
                        className="flex items-center p-3 px-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer shadow-sm"
                    >
                        <input
                            type="checkbox"
                            checked={isAllChecked || isAlumniChecked}
                            onChange={() => filterOptions("Alumini")}
                            className="h-4 w-4 accent-indigo-600 rounded-md focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm lg:text-base text-gray-700 dark:text-gray-200">
                            Alumini
                        </span>
                    </label>

                    {/* OTHERS */}
                    <label className="flex items-center p-3 px-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer shadow-sm">
                        <input
                            type="checkbox"
                            checked={isAllChecked || isOthersChecked}
                            onChange={() => filterOptions("Others")}
                            className="h-4 w-4 accent-indigo-600 rounded-md focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm lg:text-base text-gray-700 dark:text-gray-200">
                            Others
                        </span>
                    </label>
                </div>
            </div>

            <div className="flex items-center">
                <button onClick={onAdd} className={primaryButtonClass}>
                    Add Donor
                </button>
            </div>
        </div>
    )
}

export default DonorFilters;
