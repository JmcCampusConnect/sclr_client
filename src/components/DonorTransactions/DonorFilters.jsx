import React, { useEffect, useState } from "react";
import SearchDropdown from "../../common/SearchDropDown";
import axios from "axios";

function DonorFilters({ filters, setFilters }) {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [dropdownData, setDropdownData] = useState({ donors: [] });
    const [allDonors, setAllDonors] = useState([]);
    const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/common/fetchDropdownData`);
                setAllDonors(res.data.donors || []);
                console.log(res.data.donors)
            } catch (err) {
                console.error("Dropdown fetch error : ", err);
            }
        };
        fetchDropdownData();
    }, [apiUrl]);

    // Filter donors based on selected donor types

    useEffect(() => {
        const selectedTypes = [];
        if (filters.donorTypes.wellWishers) selectedTypes.push("Well Wishers");
        if (filters.donorTypes.alumni) selectedTypes.push("Alumini");
        if (filters.donorTypes.others) selectedTypes.push("Others");
        let filteredDonors = allDonors;
        const allSelected = filters.donorTypes.wellWishers && filters.donorTypes.alumni && filters.donorTypes.others;

        // If none selected -> no donors
        if (selectedTypes.length === 0) {
            filteredDonors = [];
        } else if (!allSelected) {
            // Filter by selected types
            filteredDonors = allDonors.filter(d => {
                const match = selectedTypes.includes(d.donorType);
                console.log(`Checking donor ${d.donorId} (${d.donorName}): type="${d.donorType}", match=${match}`);
                return match;
            });
        }

        setDropdownData({
            donors: filteredDonors.length > 0 ? [
                { value: "all", label: "All" },
                ...filteredDonors.map(d => ({
                    value: d.donorId,
                    label: `${d.donorId} - ${d.donorName}`,
                    type: d.donorType
                })),
            ] : [],
        });

        // Reset donor selection if it's no longer in the filtered list
        if (filters.donorId !== "all" && !filteredDonors.find(d => d.donorId === filters.donorId)) {
            setFilters(prev => ({
                ...prev,
                donorId: "all"
            }));
        }
    }, [filters.donorTypes, allDonors]);

    // Handle "All" checkbox toggle
    const handleAllToggle = (checked) => {
        setFilters(prev => ({
            ...prev,
            donorTypes: {
                all: checked,
                wellWishers: checked,
                alumni: checked,
                others: checked
            }
        }));
    };

    // Handle individual checkbox toggle

    const handleDonorTypeToggle = (type, checked) => {

        const newDonorTypes = {
            ...filters.donorTypes,
            [type]: checked
        };

        // Check if all non-all checkboxes are checked
        const allChecked = newDonorTypes.wellWishers && newDonorTypes.alumni && newDonorTypes.others;

        // Check if any checkbox is unchecked
        const anyUnchecked = !newDonorTypes.wellWishers || !newDonorTypes.alumni || !newDonorTypes.others;

        setFilters(prev => ({
            ...prev, donorTypes: {
                ...newDonorTypes,
                all: allChecked && !anyUnchecked
            }
        }));
    };

    // Handle donor ID change

    const handleDonorIdChange = (name, option) => {
        const value = option ? option.value : "all";
        setFilters(prev => ({
            ...prev, donorId: value
        }));
    };

    // Handle date changes

    const handleDateChange = (field, value) => {
        setFilters(prev => ({
            ...prev, [field]: value
        }));
    };

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
                        checked={filters.donorTypes.all}
                        onChange={(e) => handleAllToggle(e.target.checked)}
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
                        checked={filters.donorTypes.wellWishers}
                        onChange={(e) => handleDonorTypeToggle("wellWishers", e.target.checked)}
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
                        checked={filters.donorTypes.alumni}
                        onChange={(e) => handleDonorTypeToggle("alumni", e.target.checked)}
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
                        checked={filters.donorTypes.others}
                        onChange={(e) => handleDonorTypeToggle("others", e.target.checked)}
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
                    value={filters.donorId}
                    onChange={handleDonorIdChange}
                />

                {/* From Date */}
                <div className="space-y-2.5">
                    <label className="block text-md lg:text-base font-medium text-gray-700 dark:text-gray-300">
                        From Date :
                    </label>
                    <input
                        type="date"
                        value={filters.fromDate}
                        onChange={(e) => handleDateChange("fromDate", e.target.value)}
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
                        value={filters.toDate}
                        onChange={(e) => handleDateChange("toDate", e.target.value)}
                        className={formControlClass}
                    />
                </div>
            </div>
        </div>
    )
}

export default DonorFilters;