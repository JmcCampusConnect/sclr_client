import React from "react";

const categories = ["All", "Well Wishers", "Alumini"];
const primaryButtonClass = "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md";

function DonorFilters({ onAdd, filterOptions, selectedCategories }) {

    return (
        <div className="mb-6 flex justify-between">
            <div>
                <p className="text-md lg:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Donor Categories:
                </p>
                <div className="flex gap-4 flex-wrap">
                    {categories.map((cat) => (
                        <label
                            key={cat}
                            className="flex items-center p-3 px-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer shadow-sm"
                        >
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(cat)}
                                onChange={() => filterOptions(cat)}
                                className="h-4 w-4 accent-indigo-600 rounded-md focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm lg:text-base text-gray-700 dark:text-gray-200">
                                {cat}
                            </span>
                        </label>
                    ))}
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
