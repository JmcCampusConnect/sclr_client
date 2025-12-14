import React, { useEffect, useState } from "react";
import SearchDropdown from "../../common/SearchDropDown";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

function ApplnManageFilters({ filters, setFilters }) {

    const [dropdownData, setDropdownData] = useState({
        categories: [], departments: [], batches: [],
        semesters: [
            { value: "All", label: "All" },
            { value: "EVEN", label: "Even Semester" },
            { value: "ODD", label: "Odd Semester" }
        ]
    });

    const handleSelectChange = (name, option) => {
        setFilters(prev => ({
            ...prev,
            [name]: option ? option.value : "All",
        }));
    };

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/common/fetchDropdownData`);
                setDropdownData(prev => ({
                    ...prev,
                    categories: [
                        { value: "All", label: "All" },
                        ...res.data.categories.map(c => ({
                            value: c, label: c.toUpperCase()
                        }))
                    ],
                    departments: [
                        { value: "All", label: "All" },
                        ...res.data.departments.map(d => ({
                            value: d.department,
                            label: `${d.department} - ${d.departmentName}`
                        }))
                    ],
                    batches: [
                        { value: "All", label: "All" },
                        ...res.data.batches.map(b => ({
                            value: b, label: b
                        }))
                    ]
                }));
            } catch (err) {
                console.error("Dropdown fetch error:", err);
            }
        };
        fetchDropdownData();
    }, []);

    return (
        <div className="w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">

                {/* Category */}
                <SearchDropdown
                    label="Category"
                    name="category"
                    options={dropdownData.categories}
                    value={filters.category}
                    onChange={handleSelectChange}
                />

                {/* Department */}
                <SearchDropdown
                    label="Department"
                    name="department"
                    options={dropdownData.departments}
                    value={filters.department}
                    onChange={handleSelectChange}
                />

                {/* Batch */}
                <SearchDropdown
                    label="Batch"
                    name="batch"
                    options={dropdownData.batches}
                    value={filters.batch}
                    onChange={handleSelectChange}
                />

                {/* Semester */}
                <SearchDropdown
                    label="Semester"
                    name="semester"
                    options={dropdownData.semesters}
                    value={filters.semester}
                    onChange={handleSelectChange}
                />

            </div>
        </div>
    )
}

export default ApplnManageFilters;