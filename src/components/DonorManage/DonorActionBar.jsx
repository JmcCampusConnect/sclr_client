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
            {/* Single line with search on left and download on right */}
            <div className="flex items-center justify-between gap-4 mb-6">
                {/* Search - Left Corner */}
                <input
                    type="text"
                    placeholder="🔍 Search donors..."
                    className={`w-full max-w-md ${formControlClass}`}
                    onChange={(e) => handleSearch(e.target.value)}
                />

                {/* Download Button - Right Corner */}
                <button
                    onClick={handleDownloadExcel}
                    className="
                        h-10 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg shadow-md
                        hover:bg-green-700 transition duration-150 ease-in-out
                        flex items-center justify-center whitespace-nowrap
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