import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const primaryButtonClass = "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md";

function DonorFilters({ onAdd, filterOptions, selectedCategories, donors }) {

    const isAllChecked = selectedCategories.includes("All");
    const isWellWishersChecked = selectedCategories.includes("Well Wishers");
    const isAlumniChecked = selectedCategories.includes("Alumini");
    const isOthersChecked = selectedCategories.includes("Others");

    const handleDownloadExcel = () => {

        if (!donors || donors.length === 0) {
            alert("No donor records to download");
            return;
        }

        const excelData = donors.map((donor) => ({
            "Donor ID": donor.donorId,
            "Donor Name": donor.donorName,
            "Donor Type": donor.donorType,
            "PAN / Aadhaar": donor.panOrAadhaar,
            "Mobile No": donor.mobileNo,
            "Email ID": donor.emailId,
            "Address": donor.address,
            "District": donor.district,
            "State": donor.state,
            "Pin Code": donor.pinCode,
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Donors");
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx", type: "array",
        });
        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(file, "Sclr Donor.xlsx");
    };

    return (
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Filter Checkboxes - Left */}
            <div className="flex gap-2 flex-wrap">
                {/* ALL */}
                <label
                    className="flex items-center p-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer shadow-sm"
                >
                    <input
                        type="checkbox"
                        checked={isAllChecked}
                        onChange={() => filterOptions("All")}
                        className="h-4 w-4 accent-indigo-600 rounded-md focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm lg:text-base text-gray-700 dark:text-gray-200">
                        All
                    </span>
                </label>

                {/* WELL WISHERS */}
                <label
                    className="flex items-center p-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer shadow-sm"
                >
                    <input
                        type="checkbox"
                        checked={isAllChecked || isWellWishersChecked}
                        onChange={() => filterOptions("Well Wishers")}
                        className="h-4 w-4 accent-indigo-600 rounded-md focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm lg:text-base text-gray-700 dark:text-gray-200">
                        Well Wishers
                    </span>
                </label>

                {/* ALUMNI */}
                <label
                    className="flex items-center p-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer shadow-sm"
                >
                    <input
                        type="checkbox"
                        checked={isAllChecked || isAlumniChecked}
                        onChange={() => filterOptions("Alumini")}
                        className="h-4 w-4 accent-indigo-600 rounded-md focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm lg:text-base text-gray-700 dark:text-gray-200">
                        Alumini
                    </span>
                </label>

                {/* OTHERS */}
                <label className="flex items-center p-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer shadow-sm">
                    <input
                        type="checkbox"
                        checked={isAllChecked || isOthersChecked}
                        onChange={() => filterOptions("Others")}
                        className="h-4 w-4 accent-indigo-600 rounded-md focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm lg:text-base text-gray-700 dark:text-gray-200">
                        Others
                    </span>
                </label>
            </div>

            {/* Right Section - Download Excel + Add Donor */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {/* Download Excel Button */}
                <button
                    onClick={handleDownloadExcel}
                    className="
                        h-10 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg shadow-md
                        hover:bg-green-700 transition duration-150 ease-in-out
                        flex items-center justify-center w-full sm:w-auto
                    "
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                    </svg>
                    Download Excel
                </button>

                {/* Add Donor Button */}
                <button onClick={onAdd} className={`${primaryButtonClass} w-full sm:w-auto`}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Donor
                </button>
            </div>
        </div>
    )
}

export default DonorFilters;