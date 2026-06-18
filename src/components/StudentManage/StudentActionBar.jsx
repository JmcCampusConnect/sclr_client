import React, { useRef, useEffect, memo } from "react";
import { Search } from 'lucide-react';

const StudentActionBar = memo(({ totalCount, searchTerm, setSearchTerm }) => {

    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            if (document.activeElement !== inputRef.current) {
                inputRef.current.focus();
            }
        }
    }, [searchTerm]);

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 mt-8">
            <div className="relative w-full md:w-1/2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                    ref={inputRef}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search students..."
                    className={`w-full pl-10 pr-4 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-gray-400 focus:border-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 outline-none transition`}
                    autoComplete="off"
                />
            </div>
            <p className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                No. of Students :{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {totalCount}
                </span>
            </p>
        </div>
    );
});

export default StudentActionBar;