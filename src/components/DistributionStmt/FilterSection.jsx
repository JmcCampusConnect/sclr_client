import React, { useEffect, useState } from "react";
import SearchDropdown from "../../common/SearchDropDown";
import axios from "axios";

function FilterSection({ filters, setFilters, departments = [] }) {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [dropdownData, setDropdownData] = useState({ donors: [] });

    const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/common/fetchDropdownData`);
                setDropdownData({
                    donors: [{ value: "all", label: "All" }, ...res.data.donors.map(d => ({ value: d.donorId, label: `${d.donorId} - ${d.donorName}` }))]
                });
            } catch (err) {
                console.error("Dropdown fetch error:", err);
            }
        };

        fetchDropdownData();
    }, []);

    return (
        <div className="w-full space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Donor Dropdown */}
                <SearchDropdown
                    label="Select Donor"
                    name="donorId"
                    value={filters.donorId}
                    options={dropdownData.donors}
                    onChange={(name, option) =>
                        setFilters(prev => ({ ...prev, donorId: option?.value || "all" }))
                    }
                />
                {/* Conditional Dropdown */}
                <div className="space-y-2.5">
                    <SearchDropdown
                        label="Department ID"
                        name="department"
                        value={filters.department}
                        options={[
                            { value: "all", label: "All" },
                            ...departments.map((d) => ({ value: d.department, label: `${d.department} - ${d.departmentName}` })),
                        ]}
                        onChange={(name, option) => setFilters(prev => ({ ...prev, [name]: option ? option.value : "all" }))}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Category */}
                <div className="space-y-2.5">
                    <SearchDropdown
                        label="Category"
                        name="category"
                        value={filters.category}
                        options={[
                            { value: "all", label: "All" },
                            { value: "Aided", label: "AIDED" },
                            { value: "SFM", label: "SFM" },
                            { value: "SFW", label: "SFW" },
                        ]}
                        onChange={(name, option) =>
                            setFilters(prev => ({ ...prev, [name]: option ? option.value : "all" }))
                        }
                    />
                </div>
                {/* Semester */}
                <div className="space-y-2.5">
                    <SearchDropdown
                        label="Semester"
                        name="semester"
                        value={filters.semester}
                        options={[
                            { value: "all", label: "All" },
                            { value: "even", label: "Even Semester" },
                            { value: "odd", label: "Odd Semester" },
                        ]}
                        onChange={(name, option) =>
                            setFilters(prev => ({ ...prev, [name]: option ? option.value : "all" }))
                        }
                    />
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
                        onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value }))}
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
                        onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
                        className={formControlClass}
                    />
                </div>
            </div>
        </div>
    )
}

export default FilterSection;