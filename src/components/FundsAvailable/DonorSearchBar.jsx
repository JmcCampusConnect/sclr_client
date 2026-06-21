import React from "react";
import { Search } from 'lucide-react';

const DonorSearchBar = ({
    searchTerm,
    setSearchTerm,
    donorCount,
    formControlClass,
    showOnlyWithFunds,
    setShowOnlyWithFunds
}) => (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-5">
            <div className="relative w-104">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search donors..."
                    className={`w-full pl-10 pr-4 focus:ring-gray-400 focus:border-gray-400 ${formControlClass}`}
                />
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 whitespace-nowrap">
                <input
                    type="checkbox"
                    id="showOnlyWithFunds"
                    checked={showOnlyWithFunds}
                    onChange={(e) => setShowOnlyWithFunds(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="showOnlyWithFunds" className="text-md font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                    Show only donors with available funds
                </label>
            </div>
        </div>

        <p className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
            No of Donors : {" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {donorCount}
            </span>
        </p>
    </div>
);

export default DonorSearchBar;