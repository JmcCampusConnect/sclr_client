import React, { useEffect, useState } from "react";
import SearchDropdown from "../../common/SearchDropDown";
import axios from "axios";

function DonorFilters({ filters, setFilters }) {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [dropdownData, setDropdownData] = useState({ donors: [] });
    const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/common/fetchDropdownData`);
                setDropdownData({
                    donors: [
                        { value: "all", label: "All" },
                        ...res.data.donors.map(d => ({
                            value: d.donorId,
                            label: `${d.donorId} - ${d.donorName}`,
                        })),
                    ],
                });
            } catch (err) {
                console.error("Dropdown fetch error : ", err);
            }
        };
        fetchDropdownData();
    }, [apiUrl]);

    return (
        <div className="w-full space-y-6">

            <div className="flex gap-4 flex-wrap">

                {/* ALL */}
                <label className="flex items-center p-3 px-6 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 
                    transition-colors duration-200 cursor-pointer shadow-sm"
                >
                    <input
                        type="checkbox"
                        className="h-4 w-4 accent-indigo-600 rounded-md focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm lg:text-base text-gray-700 dark:text-gray-200">
                        All
                    </span>
                </label>

                {/* WELL WISHERS */}
                <label className="flex items-center p-3 px-6 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 
                    transition-colors duration-200 cursor-pointer shadow-sm"
                >
                    <input
                        type="checkbox"
                        className="h-4 w-4 accent-indigo-600 rounded-md focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm lg:text-base text-gray-700 dark:text-gray-200">
                        Well Wishers
                    </span>
                </label>

                {/* ALUMNI */}
                <label className="flex items-center p-3 px-6 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 
                    transition-colors duration-200 cursor-pointer shadow-sm"
                >
                    <input
                        type="checkbox"
                        className="h-4 w-4 accent-indigo-600 rounded-md focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm lg:text-base text-gray-700 dark:text-gray-200">
                        Alumni
                    </span>
                </label>

                {/* OTHERS */}
                <label className="flex items-center p-3 px-6 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 
                    transition-colors duration-200 cursor-pointer shadow-sm"
                >
                    <input
                        type="checkbox"
                        className="h-4 w-4 accent-indigo-600 rounded-md focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm lg:text-base text-gray-700 dark:text-gray-200">
                        Others
                    </span>
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Donor Dropdown */}
                <SearchDropdown
                    label="Select Donor"
                    name="donorId"
                    options={dropdownData.donors}
                />

                {/* From Date */}
                <div className="space-y-2.5">
                    <label className="block text-md lg:text-base font-medium text-gray-700 dark:text-gray-300">
                        From Date :
                    </label>
                    <input
                        type="date"
                        className={formControlClass}
                    />
                </div>

                {/* To Date */}
                <div className="space-y-2.5">
                    <label className="block text-md lg:text-base font-medium text-gray-700 dark:text-gray-300">
                        To Date :
                    </label>
                    <input
                        type="date"
                        className={formControlClass}
                    />
                </div>
            </div>
        </div>
    )
}

export default DonorFilters;