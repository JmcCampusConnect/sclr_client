import React from "react";
import * as XLSX from "xlsx";

function ActionBar({ total = 0, searchTerm, setSearchTerm, data = [] }) {

    const downloadExcel = () => {

        if (!data || data.length === 0) {
            alert("No data to download");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(
            data.map((row, i) => ({
                "S.No": i + 1,
                "Register No": row.registerNo,
                "Name": row.name,
                "Department": row.department,
                "Category": row.category,
                "Scholarship Type": row.sclrType,
                "Donor Name": row.donorName,
                "Donor Type": row.donorType,
                "Date": new Date(row.createdAt).toLocaleDateString("en-IN"),
                "Amount": row.givenAmt,
            }))
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Distribution Statement");
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, "0");
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const yy = String(now.getFullYear()).slice(-2);
        const fileName = `Distribution Statement ${dd}-${mm}-${yy}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    }

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 my-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                    <div className="flex justify-end gap-4 w-full">
                        <button
                            className="flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-md"
                            onClick={downloadExcel}
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Excel
                        </button>

                    </div>
                </div>
            </div>

            {/* Search + Count */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="🔍 Search..."
                    className="w-full md:w-1/2 block px-3 py-2 border border-gray-300 rounded-lg"
                />

                <p className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400">
                    No. of Records:
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400"> {total}</span>
                </p>
            </div>
        </>
    );
}

export default ActionBar;