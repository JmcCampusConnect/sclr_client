import React from "react";

function FilterSection({ searchMode, setSearchMode }) {

    const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

    const checkboxes = [
        "Orphan",
        "Mu-addin",
        "Hazrath",
        "Parent Separated",
        "Father Expired",
        "Single Parent",
        "General",
    ]

    return (
        <div className="w-full space-y-6">
            {/* === DROPDOWN SECTION === */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search Mode */}
                <div className="space-y-2.5">
                    <label
                        htmlFor="search-mode"
                        className="block text-md lg:text-base font-medium text-gray-700 dark:text-gray-300"
                    >
                        Application Status :
                    </label>
                    <select
                        className={formControlClass}
                    >
                        <option value="all">All</option>
                        <option value="accepted">Accepted</option>
                        <option value="inProgress">In Progress</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* Conditional Dropdown */}
                <div className="space-y-2.5">
                    <label
                        htmlFor="progress-type"
                        className="block text-md lg:text-base font-medium text-gray-700 dark:text-gray-300"
                    >
                        Application Type :
                    </label>
                    <select id="progress-type" className={formControlClass}>
                        <option value="all">All</option>
                        <option value="fresher">Fresher</option>
                        <option value="renewal">Renewal</option>
                    </select>
                </div>

                {/* Verification Status */}
                <div className="space-y-2.5">
                    <label
                        htmlFor="verification-status"
                        className="block text-md lg:text-base font-medium text-gray-700 dark:text-gray-300"
                    >
                        Verification Status :
                    </label>
                    <select id="verification-status" className={formControlClass}>
                        <option value="all">All</option>
                        <option value="verified">Verified</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* === CHECKBOX SECTION === */}
            <div className="mb-6">
                <p className="text-md lg:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Special Categories :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {checkboxes.map((label) => (
                        <label
                            key={label}
                            className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer shadow-sm"
                        >
                            <input
                                type="checkbox"
                                className="h-4 w-4 accent-indigo-600 rounded-md focus:ring-indigo-500"
                            />
                            <span className="ml-3 text-sm lg:text-base text-gray-700 dark:text-gray-200">
                                {label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FilterSection;