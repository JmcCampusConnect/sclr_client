import React from "react";

function FilterSection({ }) {

    const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

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
                        Donar Name or ID :
                    </label>
                    <select
                        className={formControlClass}
                    >
                        <option value="all">All</option>
                        <option value="donor1">Donor 1</option>
                        <option value="donor2">Donor 2</option>
                        <option value="donor3">Donor 3</option>
                    </select>
                </div>

                {/* Conditional Dropdown */}
                <div className="space-y-2.5">
                    <label
                        htmlFor="progress-type"
                        className="block text-md lg:text-base font-medium text-gray-700 dark:text-gray-300"
                    >
                        Department ID :
                    </label>
                    <select id="progress-type" className={formControlClass}>
                        <option value="all">All</option>
                        <option value="cs">Computer Science</option>
                        <option value="it">Information Technology</option>
                    </select>
                </div>

                {/* Verification Status */}
                <div className="space-y-2.5">
                    <label
                        htmlFor="verification-status"
                        className="block text-md lg:text-base font-medium text-gray-700 dark:text-gray-300"
                    >
                        Catergory :
                    </label>
                    <select id="verification-status" className={formControlClass}>
                        <option value="all">All</option>
                        <option value="aided">AIDED</option>
                        <option value="sfm">SFM</option>
                        <option value="sfw">SFW</option>
                    </select>
                </div>

                {/* Semester */}
                <div className="space-y-2.5">
                    <label
                        htmlFor="verification-status"
                        className="block text-md lg:text-base font-medium text-gray-700 dark:text-gray-300"
                    >
                        Semester :
                    </label>
                    <select id="semester" className={formControlClass}>
                        <option value="all">All</option>
                        <option value="evemSem">Even Semster</option>
                        <option value="oddSem">Odd Semester</option>
                    </select>
                </div>

                {/* From Date */}
                <div className="space-y-2.5">
                    <label
                        htmlFor="from-date"
                        className="block text-md lg:text-base font-medium text-gray-700 dark:text-gray-300"
                    >
                        From Date :
                    </label>
                    <input
                        type="date"
                        id="from-date"
                        className={formControlClass}
                    />
                </div>

                {/* To Date */}
                <div className="space-y-2.5">
                    <label
                        htmlFor="to-date"
                        className="block text-md lg:text-base font-medium text-gray-700 dark:text-gray-300"
                    >
                        To Date :
                    </label>
                    <input
                        type="date"
                        id="to-date"
                        className={formControlClass}
                    />
                </div>
            </div>
        </div>
    )
}

export default FilterSection;