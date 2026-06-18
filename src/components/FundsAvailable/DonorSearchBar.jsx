import React from "react";
import { Search } from 'lucide-react';

const DonorSearchBar = ({ searchTerm, setSearchTerm, donorCount, formControlClass }) => (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search donors..."
                className={`w-full pl-10 pr-4 focus:ring-gray-400 focus:border-gray-400 ${formControlClass}`}
            />
        </div>
        <p className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
            No. of Donors :{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {donorCount}
            </span>
        </p>
    </div>
);

export default DonorSearchBar;