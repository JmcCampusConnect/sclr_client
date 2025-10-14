import React from "react";

function FilterSection({ searchMode, setSearchMode }) {

    const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500";

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Search Mode */}
            <div className="space-y-2.5">
                <label
                    htmlFor="search-mode"
                    className="block text-md lg:text-base font-medium text-gray-700 dark:text-gray-300"
                >
                    Search Mode :
                </label>
                <select
                    id="search-mode"
                    value={searchMode}
                    onChange={(e) => setSearchMode(e.target.value)}
                    className={formControlClass}
                >
                    <option value="all">All Applications</option>
                    <option value="inProgress">In Progress</option>
                </select>
            </div>

            {/* Conditional Dropdown */}
            <div className="space-y-2.5">
                {searchMode === "all" ? (
                    <>
                        <label
                            htmlFor="application-status"
                            className="block text-md lg:text-base font-medium text-gray-700 dark:text-gray-300"
                        >
                            Application Status :
                        </label>
                        <select id="application-status" className={formControlClass}>
                            <option value="all">All Statuses</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </>
                ) : (
                    <>
                        <label
                            htmlFor="progress-type"
                            className="block text-md lg:text-base font-medium text-gray-700 dark:text-gray-300"
                        >
                            Progress Type :
                        </label>
                        <select id="progress-type" className={formControlClass}>
                            <option value="all">All Types</option>
                            <option value="fresher">Fresher</option>
                            <option value="renewal">Renewal</option>
                        </select>
                    </>
                )}
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
                    <option value="all">All Statuses</option>
                    <option value="verified">Verified Application</option>
                    <option value="pending">Pending Verification</option>
                </select>
            </div>
        </div>
    )
}

export default FilterSection;