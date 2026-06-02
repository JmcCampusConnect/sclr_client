import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";

const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

function DonorActionBar({ donors, handleSearch, onUploadComplete }) {

    const fileInputRef = useRef(null);
    const [selectedFileName, setSelectedFileName] = useState("");
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleFileSelect = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFileName(file.name);
        } else {
            setSelectedFileName("");
        }
    };

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

    const handleDownloadSample = async () => {

        if (!donors || donors.length === 0) {
            alert("No donor records to download");
            return;
        }

        const excelData = donors.map((donor) => ({
            "donorId": donor.donorId,
            "donorName": donor.donorName,
            "donorType": donor.donorType,
            "generalAmt": "",
            "zakkathAmt": "",
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
        saveAs(file, "Sclr Fund Sample.xlsx");
    };

    const handleUpload = async () => {

        const file = fileInputRef.current?.files?.[0];

        if (!file) {
            alert("Please select an Excel file first");
            return;
        }

        // Validate file type
        const validTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel"
        ];

        if (!validTypes.includes(file.type)) {
            alert("Please upload a valid Excel file (.xlsx or .xls)");
            return;
        }

        const formData = new FormData();
        formData.append("excelFile", file);

        try {
            const response = await axios.post(
                `${apiUrl}/api/donor/bulk-upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {

                const { summary, details } = response.data;

                // Show detailed results
                let message = `Upload Complete!\n\n`;
                message += `Total : ${summary.total}\n`;
                message += `Successful : ${summary.successful}\n`;
                message += `Failed : ${summary.failed}\n\n`;

                if (details.failed.length > 0) {
                    message += `Failed Records:\n`;
                    details.failed.forEach((fail, index) => {
                        if (index < 5) {
                            message += `- ${fail.reason}\n`;
                        }
                    });
                    if (details.failed.length > 5) {
                        message += `... and ${details.failed.length - 5} more`;
                    }
                }

                alert(message);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                    setSelectedFileName("");
                }
                if (onUploadComplete) { onUploadComplete() }

            } else {
                alert(`Upload failed: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert(
                error.response?.data?.message ||
                "Error uploading file. Please check the file format and try again."
            );
        }
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
            </div >
            <div className="flex flex-col space-y-3 w-full lg:w-auto lg:flex-row lg:space-y-0 lg:space-x-4 items-center justify-end mb-6">

                {/* DOWNLOAD SAMPLE BUTTON - NOW COMES FIRST BEFORE UPLOAD */}
                <button
                    onClick={handleDownloadSample}
                    className="
                        h-10 px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg shadow-md
                        hover:bg-orange-700 transition duration-150 ease-in-out
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
                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
                        />
                    </svg>
                    Download Sample
                </button>

                {/* UPLOAD SECTION */}
                <div className="flex flex-row w-full lg:w-auto">

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
                            {selectedFileName ? selectedFileName : "Choose Excel File (.xlsx)"}
                        </span>
                    </label>

                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".xlsx"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                    />
                </div>

                {/* UPLOAD BUTTON - NOW COMES AFTER DOWNLOAD SAMPLE */}
                <button
                    onClick={handleUpload}
                    className="
                        h-10 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md
                        hover:bg-blue-700 transition duration-150 ease-in-out
                    "
                >
                    Upload
                </button>

                {/* SEPARATOR */}
                <div className="hidden lg:block w-px h-6 bg-gray-400"></div>

                {/* DOWNLOAD ALL BUTTON */}
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