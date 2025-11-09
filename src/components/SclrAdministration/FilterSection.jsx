import React from "react";
import SearchDropdown from "../../common/SearchDropDown";

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

    const statusOptions = [
        { value: "all", label: "All" },
        { value: "accepted", label: "Accepted" },
        { value: "inProgress", label: "In Progress" },
        { value: "rejected", label: "Rejected" },
    ]

    const typeOptions = [
        { value: "all", label: "All" },
        { value: "fresher", label: "Fresher" },
        { value: "renewal", label: "Renewal" },
    ]

    const verificationOptions = [
        { value: "all", label: "All" },
        { value: "verified", label: "Verified" },
        { value: "pending", label: "Pending" },
    ]

    const handleDropdownChange = (name, option) => {
        setFilters((prev) => ({ ...prev, [name]: option?.value || "" }));
    };

    const handleCheckboxChange = (label) => {
        setFilters((prev) => {
            const updated = prev.specialCategories || [];
            return updated.includes(label)
                ? { ...prev, specialCategories: updated.filter((i) => i !== label) }
                : { ...prev, specialCategories: [...updated, label] };
        });
    };

    return (
        <div className="w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* === DROPDOWN SECTION === */}

                {/* Application Status */}
                <SearchDropdown
                    label="Application Status"
                    name="applicationStatus"
                    options={statusOptions}
                    onChange={handleDropdownChange}
                />

                {/* Application Type */}
                <SearchDropdown
                    label="Application Type"
                    name="applicationType"
                    options={typeOptions}
                    onChange={handleDropdownChange}
                />

                {/* Verification Status */}
                <SearchDropdown
                    label="Verification Status"
                    name="verificationStatus"
                    options={verificationOptions}
                    onChange={handleDropdownChange}
                />
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