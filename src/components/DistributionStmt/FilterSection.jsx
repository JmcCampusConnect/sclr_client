import React from "react";
import SearchDropdown from "../../common/SearchDropDown";

function FilterSection({filters, setFilters, departments = []}) {

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
                    <input
                        type="text"
                        placeholder="Donor name or id"
                        value={filters.donor}
                        onChange={(e) => setFilters(prev => ({...prev, donor: e.target.value}))}
                        className={formControlClass}
                    />
                </div>

                {/* Conditional Dropdown */}
                <div className="space-y-2.5">
                    <SearchDropdown
                        label="Department ID"
                        name="department"
                        value={filters.department}
                        options={[
                            {value: "all", label: "All"},
                            ...departments.map((d) => ({value: d.department, label: `${d.department} - ${d.departmentName}`})),
                        ]}
                        onChange={(name, option) => setFilters(prev => ({...prev, [name]: option ? option.value : "all"}))}
                    />
                </div>

                {/* Verification Status */}
                <div className="space-y-2.5">
                    <label
                        htmlFor="verification-status"
                        className="block text-md lg:text-base font-medium text-gray-700 dark:text-gray-300"
                    >
                        Catergory :
                    </label>
                    <select id="verification-status" className={formControlClass} value={filters.category} onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}>
                        <option value="all">All</option>
                        <option value="Aided">AIDED</option>
                        <option value="SFM">SFM</option>
                        <option value="SFW">SFW</option>
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
                    <select id="semester" className={formControlClass} value={filters.semester} onChange={(e) => setFilters(prev => ({...prev, semester: e.target.value}))}>
                        <option value="all">All</option>
                        <option value="even">Even Semester</option>
                        <option value="odd">Odd Semester</option>
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
                        value={filters.fromDate}
                        onChange={(e) => setFilters(prev => ({...prev, fromDate: e.target.value}))}
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
                        value={filters.toDate}
                        onChange={(e) => setFilters(prev => ({...prev, toDate: e.target.value}))}
                        className={formControlClass}
                    />
                </div>
            </div>
        </div>
    )
}

export default FilterSection;