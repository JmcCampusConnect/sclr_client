import React from "react";
import SearchDropdown from "../../common/SearchDropDown";

function FilterSection({ filters, setFilters }) {

    const checkboxes = [
        "General",
        "Mu-addin",
        "Hazrath",
        "Father Mother Separated",
        "Father Expired",
        "Single Parent",
        "Orphan"
    ]

    const statusOptions = [
        { value: "all", label: "All" },
        { value: "0", label: "In Progress" },
        { value: "1", label: "Accepted" },
        { value: "2", label: "Rejected" },
    ]

    const typeOptions = [
        { value: "all", label: "All" },
        { value: "Fresher", label: "Fresher" },
        { value: "Renewal", label: "Renewal" },
    ]

    const verificationOptions = [
        { value: "all", label: "All" },
        { value: "1", label: "Verified" },
        { value: "0", label: "Pending" },
    ]

    const courseTypeOptions = [
        { value: "all", label: "All" },
        { value: "UG", label: "UG" },
        { value: "PG", label: "PG" },
    ]

    const yearOptions = [
        { value: "all", label: "All" },
        { value: "I", label: "I" },
        { value: "II", label: "II" },
        { value: "III", label: "III" },
    ]

    const genderOptions = [
        { value: "all", label: "All" },
        { value: "Men", label: "Men" },
        { value: "Women", label: "Women" },
    ]

    const streamOptions = [
        { value: "all", label: "All" },
        { value: "Aided", label: "Aided" },
        { value: "SFM", label: "SFM" },
        { value: "SFW", label: "SFW" },
    ]

    const handleDropdownChange = (name, option) => {
        setFilters((prev) => ({ ...prev, [name]: option?.value || "all" }));
    };

    const handleCheckboxChange = (label) => {

        setFilters((prev) => {
            const updated = prev.specialCategories || [];
            if (label === "All") {
                if (updated.includes("All")) {
                    return { ...prev, specialCategories: [] };
                } else {
                    return { ...prev, specialCategories: ["All", ...checkboxes] };
                }
            }
            // If any specific checkbox is clicked
            const isChecked = updated.includes(label);
            let newCategories;
            if (isChecked) {
                newCategories = updated.filter((i) => i !== label);
            } else {
                // Check the checkbox and remove "All" if any specific category is selected
                newCategories = updated.filter((i) => i !== "All");
                newCategories = [...newCategories, label];
            }

            // Check if all individual checkboxes are now selected
            const allIndividualChecked = checkboxes.length > 0 &&
                checkboxes.every(cb => newCategories.includes(cb));

            // If all individual checkboxes are selected, add "All"
            if (allIndividualChecked && !newCategories.includes("All")) {
                newCategories = ["All", ...newCategories];
            }
            // If any is unchecked and "All" was in the list, remove "All"
            else if (!allIndividualChecked && newCategories.includes("All")) {
                newCategories = newCategories.filter(i => i !== "All");
            }

            return { ...prev, specialCategories: newCategories };
        });
    };

    // Determine if "All" checkbox should be checked
    const allChecked = filters.specialCategories?.includes("All") || false;
    // Check if all specific categories are selected
    const allSpecificChecked = checkboxes.length > 0 &&
        checkboxes.every(cb => filters.specialCategories?.includes(cb)) &&
        !filters.specialCategories?.includes("All");

    return (
        <div className="w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                {/* Application Status */}
                <SearchDropdown
                    label="Application Status"
                    name="applicationStatus"
                    options={statusOptions}
                    value={filters.applicationStatus}
                    onChange={handleDropdownChange}
                />

                {/* Application Type */}
                <SearchDropdown
                    label="Application Type"
                    name="sclrType"
                    options={typeOptions}
                    value={filters.sclrType}
                    onChange={handleDropdownChange}
                />

                {/* Verification Status */}
                <SearchDropdown
                    label="Tutor Verification"
                    name="tutorVerification"
                    options={verificationOptions}
                    value={filters.tutorVerification}
                    onChange={handleDropdownChange}
                />

                {/* Course Type */}
                <SearchDropdown
                    label="Course Type"
                    name="courseType"
                    options={courseTypeOptions}
                    value={filters.courseType}
                    onChange={handleDropdownChange}
                />

                {/* Year */}
                <SearchDropdown
                    label="Year"
                    name="year"
                    options={yearOptions}
                    value={filters.year}
                    onChange={handleDropdownChange}
                />

                {/* Gender */}
                <SearchDropdown
                    label="Gender"
                    name="gender"
                    options={genderOptions}
                    value={filters.gender}
                    onChange={handleDropdownChange}
                />

                {/* Stream */}
                <SearchDropdown
                    label="Stream"
                    name="stream"
                    options={streamOptions}
                    value={filters.stream}
                    onChange={handleDropdownChange}
                />
            </div>

            {/* === CHECKBOX SECTION === */}
            <div className="mb-6">
                <p className="text-md lg:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Special Categories :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* All Checkbox */}
                    <label
                        className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer shadow-sm"
                    >
                        <input
                            type="checkbox"
                            checked={allChecked || allSpecificChecked}
                            onChange={() => handleCheckboxChange("All")}
                            className="h-4 w-4 accent-indigo-600 rounded-md focus:ring-indigo-500"
                        />
                        <span className="ml-3 text-sm lg:text-base text-gray-700 dark:text-gray-200">
                            All
                        </span>
                    </label>

                    {/* Individual Category Checkboxes */}
                    {checkboxes.map((label) => (
                        <label
                            key={label}
                            className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer shadow-sm"
                        >
                            <input
                                type="checkbox"
                                checked={filters.specialCategories?.includes(label) || false}
                                onChange={() => handleCheckboxChange(label)}
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