import React, { useRef, useState } from "react";
import * as XLSX from 'xlsx';
import { Search } from 'lucide-react';
const apiUrl = import.meta.env.VITE_API_URL;

function TutorActionBar({ onAddTutor, handleSearch, tutors, onUploadComplete }) {

    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const primaryButtonClass = "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md";
    const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-gray-400 focus:border-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 outline-none transition";

    // Function to download sample Excel file
    const handleDownloadSample = () => {

        const sampleData = [
            {
                staffId: 'T001',
                staffName: 'John Doe',
                batch: '2023',
                department: 'Computer Science',
                category: 'Senior Tutor',
                section: 'A'
            },
            {
                staffId: 'T002',
                staffName: 'Jane Smith',
                batch: '2024',
                department: 'Information Technology',
                category: 'Junior Tutor',
                section: 'B'
            },
            {
                staffId: 'T003',
                staffName: 'Robert Johnson',
                batch: '2023',
                department: 'Electronics',
                category: 'Senior Tutor',
                section: 'C'
            },
            {
                staffId: 'T004',
                staffName: 'Maria Garcia',
                batch: '2024',
                department: 'Mechanical',
                category: 'Junior Tutor',
                section: 'A'
            },
            {
                staffId: 'T005',
                staffName: 'David Lee',
                batch: '2022',
                department: 'Civil',
                category: 'Head Tutor',
                section: 'B'
            }
        ];

        const worksheet = XLSX.utils.json_to_sheet(sampleData);
        worksheet['!cols'] = [
            { wch: 12 }, // staffId
            { wch: 20 }, // staffName
            { wch: 10 }, // batch
            { wch: 25 }, // department
            { wch: 15 }, // category
            { wch: 10 }  // section
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tutors_Sample');
        XLSX.writeFile(workbook, 'Tutor Sample.xlsx');
    };

    // Function to download all tutors
    const handleDownloadAllTutors = async () => {

        try {

            if (!tutors || tutors.length === 0) {
                alert('No tutors available to download.');
                return;
            }

            const exportData = tutors.map(tutor => ({
                staffId: tutor.staffId,
                staffName: tutor.staffName,
                batch: tutor.batch || '',
                department: tutor.department || '',
                category: tutor.category || '',
                section: tutor.section || ''
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportData);
            worksheet['!cols'] = [
                { wch: 12 }, // staffId
                { wch: 20 }, // staffName
                { wch: 10 }, // batch
                { wch: 25 }, // department
                { wch: 15 }, // category
                { wch: 10 }  // section
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Tutors List');
            XLSX.writeFile(workbook, `Tutors List.xlsx`);

        } catch (error) {
            console.error('Error downloading tutors:', error);
            alert('Error downloading tutors. Please try again.');
        }
    };

    // Handle file selection
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) { setSelectedFile(file) }
    }

    // Handle upload button click
    const handleUploadClick = async () => {

        if (!selectedFile) {
            alert('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('excelFile', selectedFile);
        setUploading(true);

        try {

            const response = await fetch(`${apiUrl}/api/tutor/bulk-upload`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                const { summary } = data;
                let message = `Upload Complete!\n\n`;
                message += `Total Rows: ${summary.totalRows}\n`;
                message += `Inserted: ${summary.inserted}\n`;
                message += `Updated: ${summary.updated}\n`;
                message += `Errors: ${summary.errors}\n`;
                alert(message);
                if (onUploadComplete) { onUploadComplete() }
                setSelectedFile(null);
                if (fileInputRef.current) { fileInputRef.current.value = '' }
            } else {
                alert('Upload failed: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading file. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col mt-6 lg:flex-row items-center justify-between gap-4 mb-6">
                {/* Left Section - Download Sample Excel + Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    {/* Download Sample Excel Button */}
                    <button
                        onClick={handleDownloadSample}
                        className="
                            h-10 px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg shadow-md
                            hover:bg-orange-700 transition duration-150 ease-in-out
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
                                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
                            />
                        </svg>
                        Download Sample Excel
                    </button>

                    {/* UPLOAD SECTION */}
                    <div className="flex flex-row space-x-2 w-full sm:w-auto">
                        {/* Choose File Button */}
                        <label
                            htmlFor="file-upload"
                            className={`
                                flex items-center justify-center cursor-pointer flex-grow
                                h-10 px-4 py-2 text-sm font-medium rounded-lg
                                border transition duration-150 ease-in-out
                                ${uploading ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-gray-100'}
                                text-gray-600 border-gray-300
                                overflow-hidden
                            `}
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
                            <span className="truncate max-w-[120px] sm:max-w-[200px]">
                                {selectedFile ? selectedFile.name : 'Choose Excel File'}
                            </span>
                        </label>

                        <input
                            id="file-upload"
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".xlsx, .xls"
                            onChange={handleFileSelect}
                            disabled={uploading}
                        />

                        {/* Upload Button */}
                        <button
                            onClick={handleUploadClick}
                            disabled={uploading || !selectedFile}
                            className="
                                h-10 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md
                                hover:bg-blue-700 transition duration-150 ease-in-out
                                disabled:opacity-50 disabled:cursor-not-allowed
                                flex items-center justify-center
                            "
                        >
                            {uploading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Uploading...
                                </>
                            ) : (
                                'Upload'
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Section - Download All Tutors + Add Tutor */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    {/* Download All Tutors Button */}
                    <button
                        onClick={handleDownloadAllTutors}
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
                        Download All Tutors
                    </button>

                    {/* Add Tutor Button */}
                    <button
                        onClick={onAddTutor}
                        className={primaryButtonClass}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Tutor
                    </button>
                </div>
            </div>

            {/* Search + Count */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="relative w-full md:w-1/2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                        placeholder="Search tutors..."
                        className={`w-full pl-10 pr-4 ${formControlClass}`}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                <p className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    No. of Tutors :{" "}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {tutors.length}
                    </span>
                </p>
            </div>
        </>
    );
}

export default TutorActionBar;