import React from "react";
import { Search } from 'lucide-react';

function ActionBar({ totalStudents, searchTerm, setSearchTerm, onSearchClick }) {

    const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-gray-400 focus:border-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 outline-none transition";

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:w-1/2">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                        placeholder="Search Applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 ${formControlClass}`}
                    />
                </div>
                <button
                    type="button"
                    onClick={onSearchClick}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                >
                    Search
                </button>
            </div>
            <p className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                No. of Students :{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {totalStudents}
                </span>
            </p>
        </div>
    )
}

export default ActionBar;