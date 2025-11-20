import React from "react";
import SearchDropdown from "../../common/SearchDropDown";

function StudentFilterSection({ departments, filters, setFilters }) {

    const handleSelectChange = (name, option) => {
        setFilters((prev) => ({
            ...prev,
            [name]: option ? option.value : "All",
        }));
    };

    const categoryOptions = [
        { value: "All", label: "All" },
        { value: "Aided", label: "AIDED" },
        { value: "SFM", label: "SFM" },
        { value: "SFW", label: "SFW" },
    ];

    const depts = [
        { value: "All", label: "All" },
        ...Object.values(departments).map((item) => ({
            value: item.department,
            label: `${item.department} - ${item.departmentName}`,
        })),
    ];

    const semBasedOptions = [
        { value: "All", label: "All" },
        { value: "1", label: "Yes" },
        { value: "0", label: "No" },
    ];

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
                    options={depts}
                    value={filters.department}
                    onChange={handleSelectChange}
                />

                <SearchDropdown
                    label="Semester Based"
                    name="semBased"
                    options={semBasedOptions}
                    value={filters.semBased}
                    onChange={handleSelectChange}
                    required
                />
            </div>
        </div>
    );
}

export default StudentFilterSection;