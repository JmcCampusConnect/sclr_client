import React from "react";

const DonorSearchBar = ({ searchTerm, setSearchTerm, donorCount, formControlClass }) => (

    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search donors..."
            className={`w-full md:w-1/2 ${formControlClass}`}
        />
        <p className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
            No. of Donors :{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {donorCount}
            </span>
        </p>
    </div>
);

export default DonorSearchBar;