import React, { useMemo } from "react";
import SearchDropdown from "../../common/SearchDropDown";

function StudentFilterSection({ departments, filters, onFilterChange }) {

    const categoryOptions = [
        { value: "All", label: "All" },
        { value: "Aided", label: "AIDED" },
        { value: "SFM", label: "SFM" },
        { value: "SFW", label: "SFW" },
    ];

    const departmentOptions = useMemo(() => {
        const options = [{ value: "All", label: "All" }];
        if (departments && Array.isArray(departments)) {
            departments.forEach(item => {
                options.push({
                    value: item.department,
                    label: `${item.department} - ${item.departmentName}`,
                });
            });
        }
        return options;
    }, [departments]);

    const semBasedOptions = [
        { value: "All", label: "All" },
        { value: "1", label: "Yes" },
        { value: "0", label: "No" },
    ];

    const handleSelectChange = (name, option) => {
        onFilterChange(name, option ? option.value : "All");
    };

    return (
        <div className="w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SearchDropdown
                    label="Category"
                    name="category"
                    options={categoryOptions}
                    value={filters.category}
                    onChange={handleSelectChange}
                />

                <SearchDropdown
                    label="Department"
                    name="department"
                    options={departmentOptions}
                    value={filters.department}
                    onChange={handleSelectChange}
                />

                <SearchDropdown
                    label="Semester Based"
                    name="semBased"
                    options={semBasedOptions}
                    value={filters.semBased}
                    onChange={handleSelectChange}
                />
            </div>
        </div>
    );
}

export default StudentFilterSection;