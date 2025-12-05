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
    const { addData } = useAdd()

    const headers = [
        { key: 'sno', label: 'S.No', className: 'w-[6%]' },
        { key: 'regNo', label: 'Reg No', style: { width: '12%' } },
        { key: 'name', label: 'Name', style: { width: '12%' } },
        { key: 'department', label: 'Department', style: { width: '12%' } },
        { key: 'maxMark', label: 'Max Mark', style: { width: '10%' } },
        { key: 'markSecured', label: 'Mark Secured', style: { width: '10%' } },
        { key: 'percent', label: 'Percent %', style: { width: '10%' } },
        { key: 'arrears', label: 'Arrears', style: { width: '10%' } },
        { key: 'remarks', label: 'Grade', style: { width: '20%' } },
    ]

    // FETCH STUDENT DATA

    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const Students = await fetchData(`${apiUrl}/api/staff/coe/students`, {});
                setStudentsData(Students.data?.data || []);
                setStatusCount(Students.data.counts)
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError(err.response?.data?.message || "Server error");
                } else {
                    console.error('Something error on fetch student for coe:', err);
                }
            } finally { setIsLoading(false) }
        }
        fetchStudents()
    }, []);

    // FOR HANDLE INPUT CHANGE FOR PERCENTAGE

    const handleMarkChange = (index, field, value) => {

        setStudentsData((prev) => {
            const updated = [...prev];
            const student = { ...updated[index] };
            if (field === "maxMark" || field === "markSecured") {
                const newVal = value === "" ? "" : Number(value);
                student[field] = newVal;
                const secured = Number(student.markSecured) || 0;
                const max = Number(student.maxMark) || 0;
                student.semesterMarkPercentage = max > 0 ? (secured / max) * 100 : -1;
            } else if (field === "arrears") {
                student.semesterArrear = value === "" ? "" : Number(value);
            } else if (field === "remarks") {
                student.semesterGrade = value;
            }
            updated[index] = student;
            setChangedStudents((prev) => {
                const existsIndex = prev.findIndex(s => s.registerNo === student.registerNo);
                const changedStudent = {
                    _id: student._id,
                    registerNo: student.registerNo,
                    semesterMarkPercentage: student.semesterMarkPercentage,
                    semesterArrear: student.semesterArrear,
                    semesterGrade: student.semesterGrade
                }
                if (existsIndex > -1) {
                    const newArr = [...prev];
                    newArr[existsIndex] = changedStudent;
                    return newArr;
                } else { return [...prev, changedStudent] }
            })
            return updated;
        })
    }

    // SAVING MARK 

    const handleSubmitMark = async () => {
        try {
            const Students = await addData(`${apiUrl}/api/staff/coe/saveStudentMark`, { changedStudents });
            setStudentsData(Students.data.data || []);
            if (Students.status == 200) {
                alert("Mark saved successfully")
                window.location.reload();
            }
        } catch (error) {
            console.log('Something error in saving mark in COE : ', error);
        }
    }

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

    // DOWNLOAD EXCEL

    const handleDownloadExcel = () => {

        if (!StudentsData.length) {
            alert("No data available to download");
            return;
        }

        const excelData = StudentsData.map((st) => ({
            "registerNo": st.registerNo, "name": st.name,
            "department": st.department,
            "semesterMarkPercentage": st.semesterMarkPercentage === -1 ? "" : st.semesterMarkPercentage.toFixed(2),
            "semesterArrear": st.semesterArrear ?? "",
            "semesterGrade": st.semesterGrade ?? "",
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "COE Marks");
        const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
        const file = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(file, "Scholarship Mark Entry Data.xlsx");
    };

    return (
        <div>
            <HeaderTag label="Semester Mark Entry" />
            <StaffStatus counts={statusCount} />

            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
                <div className="text-right font-semibold text-lg">
                    No of Students : {StudentsData.length}
                </div>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 order-1 sm:order-2 w-full sm:w-auto justify-end items-center">
                    <label
                        htmlFor="file-upload"
                        className="
                            flex items-center justify-center w-full sm:w-auto
                            h-10 px-4 py-2
                            border-2 border-dashed border-gray-300 rounded-lg cursor-pointer 
                            bg-gray-50 hover:bg-gray-100 
                            transition duration-150 ease-in-out
                        "
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                                <path d="M9.25 13.25a.75.75 0 001.5 0V7.636l2.955 3.016a.75.75 0 101.09-1.053l-4.25-4.333a.75.75 0 00-1.082 0l-4.25 4.333a.75.75 0 001.09 1.053l2.955-3.016v5.614z" />
                                <path d="M3.5 16.75a.75.75 0 00.75.75h11.5a.75.75 0 00.75-.75v-2a.75.75 0 00-1.5 0v2H4.25v-2a.75.75 0 00-1.5 0v2z" />
                            </svg>
                            <span className="text-sm font-medium text-indigo-600">Click to upload</span>
                        </div>
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept=".xlsx"
                        />
                    </label>
                    <div className="hidden sm:block w-px h-10 bg-gray-300"></div>
                    <button
                        onClick={handleDownloadExcel}
                        className="
                            flex items-center space-x-2 
                            px-4 py-2 w-full sm:w-auto h-10
                            text-sm font-medium 
                            text-white bg-indigo-600 
                            rounded-lg shadow-md 
                            hover:bg-indigo-700 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                            transition duration-150 ease-in-out
                        "
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path d="M10.75 2.75a.75.75 0 00-1.5 0v5.614L6.295 5.398a.75.75 0 00-1.09 1.053l4.25 4.333a.75.75 0 001.082 0l4.25-4.333a.75.75 0 00-1.09-1.053L10.75 8.364V2.75z" />
                            <path d="M3.5 16.75a.75.75 0 00.75.75h11.5a.75.75 0 00.75-.75v-2a.75.75 0 00-1.5 0v2H4.25v-2a.75.75 0 00-1.5 0v2z" />
                        </svg>
                        <span>Download Template</span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                <div className="max-h-[700px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">

                        <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10 h-15">
                            <tr>
                                {headers.map((header) => (
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
                            {StudentsData.length > 0 ? (
                                StudentsData.map((student, index) => (
                                    <tr
                                        key={student._id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
                                    >
                                        {/* S.No */}
                                        <td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
                                            {index + 1}
                                        </td>

                                        {/* Register No */}
                                        <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white uppercase">
                                            {student.registerNo}
                                        </td>

                                        {/* Name */}
                                        <td className="min-w-74 px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                            {student.name}
                                        </td>

                                        {/* Department */}
                                        <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                            {student.department}
                                        </td>

                                        {/* Max Mark */}
                                        <td className="px-4 py-4">
                                            <input
                                                type="number"
                                                className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                                value={student.maxMark ?? ""}
                                                onChange={(e) => handleMarkChange(index, "maxMark", e.target.value)}
                                                onFocus={(e) => {
                                                    e.target.addEventListener("wheel", (ev) => ev.preventDefault(), { passive: false });
                                                }}
                                            />
                                        </td>

                                        {/* Marks Secured */}
                                        <td className="px-4 py-4">
                                            <input
                                                type="number"
                                                className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                                value={student.markSecured ?? ""}
                                                onChange={(e) => handleMarkChange(index, "markSecured", e.target.value)}
                                                onFocus={(e) => {
                                                    e.target.addEventListener("wheel", (ev) => ev.preventDefault(), { passive: false });
                                                }}
                                            />
                                        </td>

                                        {/* Percentage */}
                                        <td className="px-4 py-4">
                                            <input
                                                type="text"
                                                className="w-28 px-3 py-1.5 border border-gray-300 bg-gray-100 font-semibold rounded-lg text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600"
                                                value={
                                                    student.semesterMarkPercentage >= 0
                                                        ? student.semesterMarkPercentage.toFixed(2)
                                                        : "0.00"
                                                }
                                                readOnly
                                            />
                                        </td>

                                        {/* Arrears */}
                                        <td className="px-4 py-4">
                                            <input
                                                type="number"
                                                className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                                value={student.semesterArrear ?? ""}
                                                onChange={(e) => handleMarkChange(index, "arrears", e.target.value)}
                                                onFocus={(e) => {
                                                    e.target.addEventListener("wheel", (ev) => ev.preventDefault(), { passive: false });
                                                }}
                                            />
                                        </td>

                                        {/* Grade */}
                                        <td className="px-4 py-4">
                                            <input
                                                type="text"
                                                className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                                value={student.semesterGrade ?? ""}
                                                onChange={(e) => handleMarkChange(index, "remarks", e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base"
                                    >
                                        No student data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-right">
                <Button
                    customBtnStyle="bg-blue-600 mt-6 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold"
                    label="Submit"
                    handleSubmit={handleSubmitMark}
                />
            </div>
        </div>
    )
}

export default CoeMark;