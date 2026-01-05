import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

function DonorActionBar({ donors, handleSearch }) {

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
            "General Amount": donor.generalAmt,
            "Zakkath Amount": donor.zakkathAmt,
            "General Balance": donor.generalBal,
            "Zakkath Balance": donor.zakkathBal,
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
        <>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="🔍 Search donors..."
                    className={`w-full md:w-1/2 ${formControlClass}`}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <p className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    No. of Records : {" "}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {donors.length}
                    </span>
                </p>
            </div>
            <div className="flex flex-col space-y-3 w-full lg:w-auto lg:flex-row lg:space-y-0 lg:space-x-4 items-center justify-end mb-6">

                {/* UPLOAD SECTION */}
                <div className="flex flex-row space-x-4 w-full lg:w-auto">

                    {/* Choose File Button */}
                    <label
                        htmlFor="file-upload"
                        className="
                            flex items-center justify-center cursor-pointer flex-grow
                            h-10 px-4 py-2 text-sm font-medium rounded-lg
                            border transition duration-150 ease-in-out
                            bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100
                            overflow-hidden
                        "
                    >
                        <svg
                            className="w-4 h-4 flex-shrink-0 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                            />
                        </svg>
                        <span className="truncate">
                            Choose Excel File (.xlsx)
                        </span>
                    </label>

                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".xlsx"
                    />

                    {/* Upload Button */}
                    <button
                        className="
                            h-10 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md
                            hover:bg-blue-700 transition duration-150 ease-in-out
                        "
                    >
                        Upload
                    </button>
                </div>

                {/* SEPARATOR */}
                <div className="hidden lg:block w-px h-6 bg-gray-200"></div>

                {/* DOWNLOAD BUTTON */}
                <button
                    onClick={handleDownloadExcel}
                    className="
                        h-10 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg shadow-md
                        hover:bg-green-700 transition duration-150 ease-in-out
                        flex items-center justify-center w-full lg:w-auto
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

            </div>
        </>
    )
}

export default DonorActionBar;