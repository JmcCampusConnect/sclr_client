import React, { useEffect, useState } from 'react';
import StaffStatus from '../../components/Others/StaffStatus';
import Button from '../../common/Button';
import HeaderTag from '../../common/HeaderTag';
import { useFetch } from '../../hook/useFetch';
import { useAdd } from '../../hook/useAdd';
import Loading from '../../assets/svg/Pulse.svg';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function CoeMark() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { fetchData } = useFetch();
    const [StudentsData, setStudentsData] = useState([]);
    const [changedStudents, setChangedStudents] = useState([]);
    const [statusCount, setStatusCount] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { addData } = useAdd();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("");
    const [uploadStatus, setUploadStatus] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [viewMode, setViewMode] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');

    const pendingHeaders = [
        { key: 'sno', label: 'S.No', className: 'w-[6%]' },
        { key: 'regNo', label: 'Reg No', style: { width: '12%' } },
        { key: 'name', label: 'Name', style: { width: '12%' } },
        { key: 'department', label: 'Department', style: { width: '12%' } },
        { key: 'semester', label: 'Semester', style: { width: '10%' } },
        { key: 'maxMark', label: 'Max Mark', style: { width: '10%' } },
        { key: 'markSecured', label: 'Mark Secured', style: { width: '10%' } },
        { key: 'percent', label: 'Percent %', style: { width: '10%' } },
        { key: 'arrears', label: 'Arrears', style: { width: '10%' } },
    ];

    const completedHeaders = [
        { key: 'sno', label: 'S.No', className: 'w-[8%]' },
        { key: 'regNo', label: 'Reg No', style: { width: '15%' } },
        { key: 'name', label: 'Name', style: { width: '20%' } },
        { key: 'department', label: 'Department', style: { width: '15%' } },
        { key: 'semester', label: 'Semester', style: { width: '12%' } },
        { key: 'percent', label: 'Percentage %', style: { width: '15%' } },
        { key: 'arrears', label: 'Arrears', style: { width: '15%' } },
    ];

    // FETCH STUDENT DATA
    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const Students = await fetchData(`${apiUrl}/api/staff/coe/students`, {});
                const semesterOrder = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6 };

                const sortedData = (Students.data?.data || [])
                    .sort((a, b) => (semesterOrder[a.semester] || 99) - (semesterOrder[b.semester] || 99))
                    .map(st => {
                        const rawPct = st.semesterMarkPercentage;
                        const pctNum =
                            rawPct === "" || rawPct === null || rawPct === undefined
                                ? -1
                                : Number(rawPct);

                        return {
                            ...st,
                            semesterMarkPercentage: pctNum,
                            isCompleted: pctNum !== -1,
                        };
                    });

                setStudentsData(sortedData);
                setStatusCount(Students.data.counts);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError(err.response?.data?.message || "Server error");
                } else {
                    console.error("Something error on fetch student for COE:", err);
                }
            } finally { setIsLoading(false) }
        };
        fetchStudents();
    }, [apiUrl]);

    // FOR HANDLE INPUT CHANGE FOR PERCENTAGE
    const handleMarkChange = (studentId, field, value) => {
        setStudentsData((prev) => {
            const idx = prev.findIndex((s) => s._id === studentId);
            if (idx === -1) return prev;

            const updated = [...prev];
            const student = { ...updated[idx] };

            if (field === "maxMark" || field === "markSecured") {
                let newVal = value === "" ? "" : Number(value);
                if (field === "markSecured") {
                    const max = Number(student.maxMark) || 0;
                    if (newVal > max) newVal = "";
                }
                student[field] = newVal;
                const secured = Number(student.markSecured) || 0;
                const max = Number(student.maxMark) || 0;
                student.semesterMarkPercentage = max > 0 && secured !== "" ? (secured / max) * 100 : -1;
            } else if (field === "arrears") {
                student.semesterArrear = value === "" ? "" : Number(value);
            }

            updated[idx] = student;

            setChangedStudents((prevChanged) => {
                const existsIndex = prevChanged.findIndex((s) => s.registerNo === student.registerNo);
                const changedStudent = {
                    _id: student._id,
                    registerNo: student.registerNo,
                    semesterMarkPercentage: student.semesterMarkPercentage,
                    semesterArrear: student.semesterArrear,
                };
                if (existsIndex > -1) {
                    const newArr = [...prevChanged];
                    newArr[existsIndex] = changedStudent;
                    return newArr;
                }
                return [...prevChanged, changedStudent];
            });

            return updated;
        });
    };

    // SAVING MARK
    const handleSubmitMark = async () => {

        const invalidStudent = StudentsData.find(st =>
            st.maxMark !== "" &&
            st.maxMark !== undefined &&
            st.maxMark !== null &&
            (st.markSecured === "" || st.markSecured === undefined || st.markSecured === null)
        );

        if (invalidStudent) {
            alert(`Please enter mark secured for register no : ${invalidStudent.registerNo}`);
            return;
        }

        try {
            const normalizedStudents = changedStudents.map(st => ({
                ...st, semesterArrear:
                    st.semesterArrear === "" ||
                        st.semesterArrear === undefined ||
                        st.semesterArrear === null ? 0 : st.semesterArrear
            }));

            const Students = await addData(
                `${apiUrl}/api/staff/coe/saveStudentMark`,
                { changedStudents: normalizedStudents }
            );

            setStudentsData(Students.data.data || []);
            if (Students.status === 200) {
                alert("Mark saved successfully");
                window.location.reload();
            }
        } catch (error) {
            console.log('Something error in saving mark in COE : ', error);
            alert("Something error in saving mark in COE");
        }
    }

    // Filter data based on view mode and search
    const getFilteredData = () => {
        let filtered = StudentsData;

        if (viewMode === 'pending') {
            filtered = StudentsData.filter(st => !st.isCompleted);
        } else if (viewMode === 'completed') {
            filtered = StudentsData.filter(st => st.isCompleted);
        }

        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(st =>
                st.registerNo?.toLowerCase().includes(search) ||
                st.name?.toLowerCase().includes(search) ||
                st.department?.toLowerCase().includes(search) ||
                st.semester?.toLowerCase().includes(search)
            );
        }

        return filtered;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
                <p className="text-gray-600 font-medium text-lg">Loading students...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
        )
    }

    const handleDownloadExcel = () => {
        if (!StudentsData.length) {
            alert("No data available to download");
            return;
        }

        const excelData = StudentsData.map((st) => ({
            _id: st._id,
            "registerNo": st.registerNo, "name": st.name,
            "department": st.department, "semester": st.semester,
            "semesterMarkPercentage": st.semesterMarkPercentage === -1 ? "" : st.semesterMarkPercentage.toFixed(2),
            "semesterArrear": "",
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "COE Marks");
        const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
        const file = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(file, "Scholarship Mark Entry Data.xlsx");
    }

    const handleUploadClick = async () => {

        if (!selectedFile) {
            setUploadMessage("Please select a file first.");
            setUploadStatus(false);
            return;
        }

        setUploadLoading(true);
        setUploadMessage("");

        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(sheet).map(row => ({
                    _id: row._id,
                    semesterMarkPercentage: row.semesterMarkPercentage,
                    semesterArrear: row.semesterArrear,
                    semesterGrade: row.semesterGrade
                }));
                const res = await addData(`${apiUrl}/api/fileUpload/uploadMarkExcel`, { excelData: jsonData });
                if (res.status === 200) {
                    alert("Uploaded successfully");
                    setUploadStatus(true);
                    window.location.reload();
                }
            } catch (err) {
                setUploadMessage("Failed to upload file");
                setUploadStatus(false);
                console.error('Error in uploding mark file : ', err)
            } finally { setUploadLoading(false) }
        }
        reader.readAsArrayBuffer(selectedFile);
    }

    const filteredData = getFilteredData();
    const currentHeaders = viewMode === 'pending' ? pendingHeaders : completedHeaders;

    return (
        <div>
            <HeaderTag label="Semester Mark Entry" />
            <StaffStatus counts={statusCount} />

            <div className='flex flex-col sm:flex-row justify-end items-start sm:items-center mt-4'>
                <div className="flex flex-col space-y-3 w-full lg:w-auto lg:flex-row lg:space-y-0 lg:space-x-4 items-center">
                    <div className="flex flex-row space-x-4 w-full lg:w-auto">
                        <label
                            htmlFor="file-upload"
                            className={`
                            flex items-center justify-center cursor-pointer flex-grow
                            h-10 px-4 py-2 text-sm font-medium rounded-lg
                            border transition duration-150 ease-in-out
                            ${selectedFile
                                    ? 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'
                                    : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
                                }
                                overflow-hidden
                            `}
                        >
                            <svg className="w-4 h-4 flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <span className="truncate">
                                {uploadLoading
                                    ? "Processing..."
                                    : selectedFile ? selectedFile.name : "Choose Excel File (.xlsx)"
                                }
                            </span>
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept=".xlsx"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                setSelectedFile(file);
                                setUploadMessage("");
                                e.target.value = null;
                            }}
                        />

                        <button
                            disabled={!selectedFile || uploadLoading}
                            onClick={handleUploadClick}
                            className="
                                h-10 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md flex-shrink-0
                                disabled:bg-blue-400 disabled:cursor-not-allowed
                                hover:bg-blue-700 transition duration-150 ease-in-out
                            "
                        >
                            {uploadLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                </span>
                            ) : (
                                "Upload"
                            )}
                        </button>
                    </div>

                    {uploadMessage && (
                        <p className={`text-xs font-medium w-full text-center lg:text-left ${uploadStatus ? "text-green-600" : "text-red-600"}`}>
                            {uploadMessage}
                        </p>
                    )}

                    <div className="hidden lg:block w-px h-6 bg-gray-200"></div>

                    <button
                        onClick={() => { handleDownloadExcel() }}
                        className="
                            h-10 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg shadow-md flex-shrink-0 w-full lg:w-auto
                            hover:bg-green-700 transition duration-150 ease-in-out flex items-center justify-center
                        "
                    >
                        <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Download Template
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6 mb-4">
                <div className="relative w-full sm:w-72 md:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <svg
                            className="h-4 w-4 text-gray-400 group-focus-within:text-gray-500 transition-colors duration-200"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2.5"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Reg No, Name, Dept..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none text-gray-900 dark:text-gray-100 transition-all duration-200"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-1.5 p-2 bg-gray-100 dark:bg-gray-900 rounded-xl w-full sm:w-auto">
                    <button
                        onClick={() => setViewMode('pending')}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] flex-1 sm:flex-none ${viewMode === 'pending'
                            ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Pending</span>
                        <span className={`ml-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-md transition-colors duration-200 ${viewMode === 'pending'
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}>
                            {statusCount.pending || 0}
                        </span>
                    </button>

                    <button
                        onClick={() => setViewMode('completed')}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] flex-1 sm:flex-none ${viewMode === 'completed'
                            ? 'bg-green-600 text-white shadow-sm shadow-green-600/20'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Completed</span>
                        <span className={`ml-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-md transition-colors duration-200 ${viewMode === 'completed'
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}>
                            {statusCount.completed || 0}
                        </span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                <div className="max-h-[700px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
                        <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10 h-15">
                            <tr>
                                {currentHeaders.map((header) => (
                                    <th
                                        key={header.key}
                                        className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                        style={header.style}
                                    >
                                        {header.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredData.length > 0 ? (
                                filteredData.map((student, index) => {
                                    if (viewMode === 'pending') {
                                        return (
                                            <tr
                                                key={student._id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
                                            >
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white uppercase">
                                                    {student.registerNo}
                                                </td>
                                                <td className="min-w-74 px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                    {student.name}
                                                </td>
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                    {student.department}
                                                </td>
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                    {student.semester}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="number"
                                                        className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                                        value={student.maxMark ?? ""}
                                                        onChange={(e) => handleMarkChange(student._id, "maxMark", e.target.value)}
                                                        onFocus={(e) => {
                                                            e.target.addEventListener("wheel", (ev) => ev.preventDefault(), { passive: false });
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="number"
                                                        className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                                        value={student.markSecured ?? ""}
                                                        onChange={(e) => handleMarkChange(student._id, "markSecured", e.target.value)}
                                                        onFocus={(e) => {
                                                            e.target.addEventListener("wheel", (ev) => ev.preventDefault(), { passive: false });
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="text"
                                                        className="w-28 px-3 py-1.5 border border-gray-300 bg-gray-100 font-semibold rounded-lg text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600"
                                                        value={
                                                            student.semesterMarkPercentage >= 0
                                                                ? Number(student.semesterMarkPercentage).toFixed(2)
                                                                : ""
                                                        }
                                                        readOnly
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="number"
                                                        className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                                        value={student.semesterArrear === 0 ? "" : student.semesterArrear}
                                                        onChange={(e) => handleMarkChange(student._id, "arrears", e.target.value)}
                                                        onFocus={(e) => {
                                                            e.target.addEventListener("wheel", (ev) => ev.preventDefault(), { passive: false });
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    } else {
                                        return (
                                            <tr
                                                key={student._id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200 bg-green-50/30 dark:bg-green-900/10"
                                            >
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white uppercase">
                                                    {student.registerNo}
                                                </td>
                                                <td className="min-w-74 px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                    {student.name}
                                                </td>
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                    {student.department}
                                                </td>
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                    {student.semester}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg text-sm font-semibold text-green-700 dark:text-green-300 inline-block min-w-[80px]">
                                                        {student.semesterMarkPercentage >= 0
                                                            ? `${Number(student.semesterMarkPercentage).toFixed(2)}%`
                                                            : 'N/A'
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 inline-block min-w-[60px]">
                                                        {student.semesterArrear || 0}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={viewMode === 'pending' ? 9 : 7}
                                        className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base"
                                    >
                                        {searchTerm ? `No ${viewMode === 'pending' ? 'pending' : 'completed'} students found matching "${searchTerm}"` : `No ${viewMode === 'pending' ? 'pending' : 'completed'} student data available.`}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {viewMode === 'pending' && (
                <div className="text-right">
                    <Button
                        customBtnStyle="bg-blue-600 mt-6 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold"
                        label="Submit"
                        handleSubmit={handleSubmitMark}
                    />
                </div>
            )}
        </div>
    )
}

export default CoeMark;