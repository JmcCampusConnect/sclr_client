import React, { useEffect, useState } from 'react';
import { useFetch } from '../../hook/useFetch';
import { useParams } from "react-router-dom";
import { useAdd } from '../../hook/useAdd';
import HeaderTag from '../../common/HeaderTag';
import StaffStatus from '../../components/Others/StaffStatus';
import Button from '../../common/Button';
import Loading from '../../assets/svg/Pulse.svg';

function ClassAttendance() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { userId } = useParams();
    const { fetchData } = useFetch();
    const { addData } = useAdd();
    const [students, setStudents] = useState([]);
    const [staffData, setStaffData] = useState({});
    const [workingDays, setWorkingDays] = useState("");
    const [studentRows, setStudentRows] = useState([]);
    const [count, setCount] = useState()
    const prevSemWorkingDays = 100;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');

    // FETCH STUDENT DATA
    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetchData(`${apiUrl}/api/staff/class/students`, { userId });
                if (response.status === 200) {
                    setStaffData(response.data.staffData);
                    const semesterOrder = ["I", "II", "III", "IV", "V", "VI"];
                    const sortedStudents = response.data.studentData.sort(
                        (a, b) => semesterOrder.indexOf(a.semester) - semesterOrder.indexOf(b.semester)
                    );
                    setStudents(sortedStudents);
                    setCount(response.data.counts);

                    // Populate studentRows with existing data from database
                    setStudentRows(sortedStudents.map(stu => {
                        const isMarked = stu.classAttendancePercentage !== -1;
                        // Calculate currSem from the percentage if marked
                        let currSem = "";
                        let percentage = "";

                        if (isMarked) {
                            percentage = stu.classAttendancePercentage;
                            // If we have workingDays, calculate currSem from percentage
                            if (workingDays) {
                                currSem = Math.round((percentage / 100) * workingDays);
                            }
                        }

                        return {
                            _id: stu._id,
                            regNo: stu.registerNo,
                            prevSem: stu.semester === "I" ? 100 : "",
                            currSem: currSem,
                            remark: stu.classAttendanceRemark || "",
                            percentage: percentage,
                            isSemOne: stu.semester === "I",
                            isMarked: isMarked,
                            // Store the saved percentage for display in completed view
                            savedPercentage: isMarked ? stu.classAttendancePercentage : null,
                            savedRemark: isMarked ? stu.classAttendanceRemark : ""
                        };
                    }));
                }
            } catch (error) {
                setError("Failed to load student data. Please try again later.");
                console.log("Something error in fetch student : ", error)
            } finally { setIsLoading(false) }
        }
        fetchStudents()
    }, [])

    // Update studentRows when workingDays changes
    useEffect(() => {
        if (workingDays && students.length > 0) {
            setStudentRows(prevRows =>
                prevRows.map((row) => {
                    if (row.isMarked && row.savedPercentage) {
                        const currSem = Math.round((row.savedPercentage / 100) * workingDays);
                        return {
                            ...row,
                            currSem: currSem.toString(),
                            percentage: row.savedPercentage
                        };
                    }
                    return row;
                })
            );
        }
    }, [workingDays]);

    // FUNCTION FOR HANDLE THE INPUT FIELDS AND VALIDATION
    const handleInputChange = (index, field, value) => {

        const newRows = [...studentRows];

        if (field === 'prevSem' && value !== "") {
            let val = parseFloat(value);
            if (isNaN(val) || val < 0) return;
            if (val > 100) val = 100;
            newRows[index].prevSem = val.toString();
        } else if (field === 'currSem') {
            if (!workingDays || workingDays === "") {
                alert("Please enter Current Semester Working Days first.");
                return;
            }
            if (value === "") {
                newRows[index].currSem = "";
                newRows[index].percentage = "";
            } else {
                let val = parseFloat(value);
                if (isNaN(val) || val < 0) return;
                const maxWorkingDays = parseFloat(workingDays);
                if (val > maxWorkingDays) {
                    newRows[index].currSem = "";
                    newRows[index].percentage = "";
                } else {
                    newRows[index].currSem = val.toString();
                }
            }
        } else {
            newRows[index][field] = value;
        }

        const currSemAttended = parseFloat(newRows[index].currSem) || 0;
        const currSemWorking = parseFloat(workingDays) || 0;
        let overallPercent = "";

        if (newRows[index].isSemOne) {
            if (currSemAttended !== "" && currSemWorking > 0) {
                overallPercent = Math.round((currSemAttended / currSemWorking) * 100);
            }
        } else {
            const prevSemPercent = parseFloat(newRows[index].prevSem) || 0;
            if (prevSemPercent !== "" && currSemAttended !== "" && currSemWorking > 0) {
                const prevSemAttendedDays = (prevSemPercent / 100) * prevSemWorkingDays;
                const totalAttended = prevSemAttendedDays + currSemAttended;
                const totalWorking = prevSemWorkingDays + currSemWorking;
                overallPercent = Math.round((totalAttended / totalWorking) * 100);
            }
        }
        newRows[index].percentage = overallPercent === "" ? "" : overallPercent;
        setStudentRows(newRows);
    }

    // FUNCTION FOR CALCULATE PERCENTAGE
    const handleWorkingDaysChange = (value) => {

        if (value !== "") {
            let val = parseFloat(value);
            if (isNaN(val) || val <= 0) {
                alert("Working Days must be a positive number");
                return;
            }
            setWorkingDays(val.toString());
        } else {
            setWorkingDays("");
        }

        const newRows = studentRows.map(row => {
            // Don't recalculate for marked students
            if (row.isMarked && row.savedPercentage) {
                const currSem = Math.round((row.savedPercentage / 100) * (value || 0));
                return {
                    ...row,
                    currSem: value ? currSem.toString() : "",
                    percentage: row.savedPercentage
                };
            }

            const currSemAttended = parseFloat(row.currSem) || 0;
            const currSemWorking = parseFloat(value) || 0;
            let overallPercent = "";
            if (row.isSemOne) {
                if (currSemAttended !== "" && currSemWorking > 0) {
                    overallPercent = Math.round((currSemAttended / currSemWorking) * 100);
                }
            } else {
                const prevSemPercent = parseFloat(row.prevSem) || 0;
                if (prevSemPercent !== "" && currSemAttended !== "" && currSemWorking > 0) {
                    const prevSemAttendedDays = (prevSemPercent / 100) * prevSemWorkingDays;
                    const totalAttended = prevSemAttendedDays + currSemAttended;
                    const totalWorking = prevSemWorkingDays + currSemWorking;
                    overallPercent = Math.round((totalAttended / totalWorking) * 100);
                }
            }
            return { ...row, percentage: overallPercent === "" ? "" : overallPercent };
        });
        setStudentRows(newRows);
    }

    // SAVE STUDENTS ATTENDANCE DATA
    const handleSubmit = async () => {
        const enteredData = studentRows
            .filter(row => row.currSem !== "" && row.percentage !== "" && !row.isMarked)
            .map(row => ({
                _id: row._id,
                regNo: row.regNo,
                percentage: row.percentage,
                remark: row.remark || "Good"
            }));

        if (enteredData.length === 0) {
            alert("No new data to save");
            return;
        }

        try {
            const saveAttendance = await addData(`${apiUrl}/api/staff/class/saveAttendance`, { enteredData });
            if (saveAttendance.status === 200) {
                alert(saveAttendance.data.message);
                window.location.reload()
            } else {
                alert(saveAttendance.data.message)
            }
        } catch (err) {
            console.error("Something error to add attendance : ", err);
            alert("Something error to add attendance");
        }
    }

    // Filter data based on view mode and search
    const getFilteredData = () => {
        let filtered = students;

        // Filter by view mode
        if (viewMode === 'pending') {
            filtered = students.filter((stu, index) =>
                !studentRows[index]?.isMarked
            );
        } else if (viewMode === 'completed') {
            filtered = students.filter((stu, index) =>
                studentRows[index]?.isMarked
            );
        }

        // Filter by search term
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

    const filteredData = getFilteredData();

    return (
        <div>
            <HeaderTag label={staffData.staffName} />
            <StaffStatus counts={count} />

            {/* Working Days + Student Count */}
            <div className="flex flex-wrap justify-between items-center mb-6 font-semibold text-lg">
                <div className="flex items-center gap-2">
                    <label>Current Year Working Days :</label>
                    <input
                        type="number"
                        className="w-24 border border-gray-300 p-2 rounded-lg text-center focus:ring-2 outline-none transition"
                        value={workingDays}
                        onChange={(e) => handleWorkingDaysChange(e.target.value)}
                        onFocus={(e) =>
                            e.target.addEventListener("wheel", (ev) => ev.preventDefault(), { passive: false })
                        }
                    />
                </div>
                <div className="text-right">
                    No of Students : {students.length}
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6 mb-4">
                {/* Search Bar - Left Side */}
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

                {/* Filter Buttons - Right Side */}
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
                            {count?.pending || 0}
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
                            {count?.completed || 0}
                        </span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                <div className="max-h-[700px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">

                        {/* Table Head */}
                        {/* Table Head */}
                        <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10 h-15">
                            <tr>
                                {viewMode === 'completed' ? (
                                    ["S.No", "Reg No", "Name", "Department", "Semester", "Percentage", "Remarks"].map((heading, idx) => (
                                        <th
                                            key={idx}
                                            className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                        >
                                            {heading}
                                        </th>
                                    ))
                                ) : (
                                    ["S.No", "Reg No", "Name", "Department", "Semester", "Prev Sem (%)", "Curr Sem Attended", "Percentage", "Remarks"].map((heading, idx) => (
                                        <th
                                            key={idx}
                                            className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                        >
                                            {heading}
                                        </th>
                                    ))
                                )}
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredData.length > 0 ? (
                                filteredData.map((stu, index) => {
                                    const rowIndex = students.findIndex(s => s._id === stu._id);
                                    const row = studentRows[rowIndex];
                                    if (viewMode === 'completed') {
                                        return (
                                            <tr
                                                key={stu._id || index}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200 bg-green-50/30 dark:bg-green-900/10"
                                            >
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white uppercase">
                                                    {stu.registerNo}
                                                </td>
                                                <td className="min-w-74 px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                    {stu.name}
                                                </td>
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                    {stu.department}
                                                </td>
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                    {stu.semester}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg text-sm font-semibold text-green-700 dark:text-green-300 inline-block min-w-[80px]">
                                                        {row?.savedPercentage ? `${row.savedPercentage}%` : (row?.percentage ? `${row.percentage}%` : 'N/A')}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 inline-block min-w-[80px]">
                                                        {row?.savedRemark || row?.remark || '-'}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }
                                    return (
                                        <tr
                                            key={stu._id || index}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
                                        >
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white uppercase">
                                                {stu.registerNo}
                                            </td>
                                            <td className="min-w-74 px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                {stu.name}
                                            </td>
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                {stu.department}
                                            </td>
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                {stu.semester}
                                            </td>
                                            <td className="px-4 py-4">
                                                {row?.isSemOne ? (
                                                    <span className="text-gray-400 dark:text-gray-500 font-medium">N/A</span>
                                                ) : (
                                                    <input
                                                        type="number"
                                                        value={row?.prevSem ?? ""}
                                                        onChange={(e) => handleInputChange(rowIndex, "prevSem", e.target.value)}
                                                        onFocus={(e) =>
                                                            e.target.addEventListener("wheel", (ev) => ev.preventDefault(), { passive: false })
                                                        }
                                                        className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 
                                                        focus:outline-none focus:ring-2 focus:ring-blue-400 transition
                                                        dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                                    />
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <input
                                                    type="number"
                                                    value={row?.currSem ?? ""}
                                                    onChange={(e) => handleInputChange(rowIndex, "currSem", e.target.value)}
                                                    onFocus={(e) =>
                                                        e.target.addEventListener("wheel", (ev) => ev.preventDefault(), { passive: false })
                                                    }
                                                    className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 
                                                    focus:outline-none focus:ring-2 focus:ring-blue-400 transition
                                                    dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <input
                                                    type="number"
                                                    readOnly
                                                    value={row?.percentage ?? ""}
                                                    className="w-28 px-3 py-1.5 border border-gray-300 bg-gray-100 font-semibold rounded-lg 
                                                    text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <input
                                                    type="text"
                                                    value={row?.remark ?? ""}
                                                    onChange={(e) => handleInputChange(rowIndex, "remark", e.target.value)}
                                                    className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 
                                                    focus:outline-none focus:ring-2 focus:ring-blue-400 transition
                                                    dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={viewMode === 'completed' ? 7 : 9}
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

            {/* Submit button - only show in pending view */}
            {viewMode === 'pending' && (
                <div className="text-right">
                    <Button
                        customBtnStyle="bg-blue-600 mt-6 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold"
                        label="Submit"
                        handleSubmit={handleSubmit}
                    />
                </div>
            )}
        </div>
    )
}

export default ClassAttendance;