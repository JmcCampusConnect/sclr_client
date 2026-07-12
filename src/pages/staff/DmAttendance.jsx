import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useFetch } from '../../hook/useFetch';
import { useAdd } from '../../hook/useAdd';
import StaffStatus from '../../components/Others/StaffStatus';
import HeaderTag from '../../common/HeaderTag';
import Button from '../../common/Button';
import Loading from '../../assets/svg/Pulse.svg';

function DmAttendance() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { userId } = useParams();
    const { fetchData } = useFetch();
    const { addError, addData } = useAdd();
    const [students, setStudents] = useState([]);
    const [prevYearWorkingDays, setPrevYearWorkingDays] = useState("");
    const [currYearWorkingDays, setCurrYearWorkingDays] = useState("");
    const [editedStudents, setEditedStudents] = useState({});
    const [count, setCount] = useState();
    const [staffData, setStaffData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const getStudents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetchData(`${apiUrl}/api/staff/dm/studentsDM`, { userId });
                const semesterOrder = ["I", "II", "III", "IV", "V", "VI"];
                const sortedStudents = (response.data.students || []).sort(
                    (a, b) => semesterOrder.indexOf(a.semester) - semesterOrder.indexOf(b.semester)
                );
                setStudents(sortedStudents);
                setCount(response.data.counts);
                setStaffData(response.data.StaffData[0]);

                // Initialize editedStudents with existing data for completed students
                const initialEdited = {};
                sortedStudents.forEach(student => {
                    if (student.deeniyathMoralAttendancePercentage !== -1) {
                        initialEdited[student.registerNo] = {
                            prev: "",
                            curr: "",
                            percentage: student.deeniyathMoralAttendancePercentage || "0.00",
                            remark: student.deeniyathMoralRemark || "Good",
                            isMarked: true,
                            savedPercentage: student.deeniyathMoralAttendancePercentage,
                            savedRemark: student.deeniyathMoralRemark || "Good"
                        };
                    }
                });
                setEditedStudents(initialEdited);
            } catch (error) {
                setError("Failed to load student data. Please try again later.");
                console.log("Error while fetching students : ", error);
            } finally { setIsLoading(false) }
        };
        getStudents();
    }, []);

    const handleDayInput = (value, max) => {
        if (value === "") return true;
        if (/^\d+$/.test(value)) {
            if (parseInt(value) <= max) return true;
        }
        return false;
    };

    const onPrevYearWorkingDaysChange = (e) => {
        const val = e.target.value;
        if (val === "" || /^\d+$/.test(val)) {
            setPrevYearWorkingDays(val);
        }
    };

    const onCurrYearWorkingDaysChange = (e) => {
        const val = e.target.value;
        if (val === "" || /^\d+$/.test(val)) {
            setCurrYearWorkingDays(val);
        }
    };

    const validateGlobalWorkingDaysBeforeStudentInput = (type) => {
        if (type === "prev" && prevYearWorkingDays === "") {
            alert("Please enter previous year working days first.");
            return false;
        }
        if (type === "curr" && currYearWorkingDays === "") {
            alert("Please enter current year working days first.");
            return false;
        }
        return true;
    };

    const onStudentDaysChange = (registerNo, type, val, semester) => {
        // Check if already marked
        if (editedStudents[registerNo]?.isMarked) {
            alert("This student's attendance is already marked and cannot be edited.");
            return;
        }

        // Check if global working days are entered
        if (!validateGlobalWorkingDaysBeforeStudentInput(type)) return;

        const maxPrev = parseInt(prevYearWorkingDays) || Number.MAX_SAFE_INTEGER;
        const maxCurr = parseInt(currYearWorkingDays) || Number.MAX_SAFE_INTEGER;

        // Only allow numbers
        if (!/^\d*$/.test(val)) return;

        // If value exceeds max, remove it (set to "")
        if ((type === "prev" && val !== "" && parseInt(val) > maxPrev) ||
            (type === "curr" && val !== "" && parseInt(val) > maxCurr)) {
            val = "";
        }

        // Get existing record or create new
        let record = editedStudents[registerNo] || { prev: "", curr: "", percentage: "0.00", remark: "Good" };
        record = { ...record, [type]: val };

        const prevVal = record.prev === "" ? 0 : parseInt(record.prev);
        const currVal = record.curr === "" ? 0 : parseInt(record.curr);

        // Calculate percentage
        let totalAllowed;
        let percentage = "0.00";

        if (semester === "I") {
            totalAllowed = parseInt(currYearWorkingDays) || 0;
            if (totalAllowed > 0 && currVal <= totalAllowed) {
                percentage = ((currVal / totalAllowed) * 100).toFixed(2);
            }
        } else {
            totalAllowed = (parseInt(prevYearWorkingDays) || 0) + (parseInt(currYearWorkingDays) || 0);
            if (totalAllowed > 0 && (prevVal + currVal) <= totalAllowed) {
                percentage = (((prevVal + currVal) / totalAllowed) * 100).toFixed(2);
            }
        }

        record.percentage = percentage;

        // Default remark to "Good"
        if (!(registerNo in editedStudents) || !editedStudents[registerNo].hasOwnProperty('remark')) {
            record.remark = "Good";
        }

        // Update state
        setEditedStudents(prev => ({ ...prev, [registerNo]: record }));
    };

    const onStudentRemarkChange = (registerNo, val) => {
        // Check if already marked
        if (editedStudents[registerNo]?.isMarked) {
            alert("This student's attendance is already marked and cannot be edited.");
            return;
        }

        let record = editedStudents[registerNo] || { prev: "", curr: "", percentage: "0.00", remark: "" };
        record = { ...record, remark: val };
        setEditedStudents(prev => ({ ...prev, [registerNo]: record }));
    };

    const onSubmit = async () => {
        const submissionArray = Object.entries(editedStudents)
            .filter(([registerNo, data]) => !data.isMarked && data.percentage !== "0.00")
            .map(([registerNo, data]) => {
                const student = students.find(std => std.registerNo === registerNo);
                return {
                    _id: student?._id,
                    registerNo,
                    previousYearDays: data.prev,
                    currentYearDays: data.curr,
                    percentage: data.percentage,
                    remark: data.remark.trim() === "" ? "Good" : data.remark
                }
            });

        if (submissionArray.length === 0) {
            alert("No new data to save");
            return;
        }

        try {
            await addData(`${apiUrl}/api/staff/dm/saveStdutntDM`, submissionArray);
            alert("Attendance saved successfully");
            window.location.reload();
        } catch (e) {
            console.log("Something went wrong while saving attendance DM : ", e);
            addError && addError(e);
        }
    }

    // Filter data based on view mode and search
    const getFilteredData = () => {
        let filtered = students;

        // Filter by view mode
        if (viewMode === 'pending') {
            filtered = students.filter(stu =>
                editedStudents[stu.registerNo]?.isMarked !== true
            );
        } else if (viewMode === 'completed') {
            filtered = students.filter(stu =>
                editedStudents[stu.registerNo]?.isMarked === true
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
            {/* Header */}
            <HeaderTag label={staffData?.staffName || "Attendance Entry"} />
            <StaffStatus counts={count} />

            {/* Working Days + Student Count */}
            <div className="flex flex-wrap justify-between items-center mb-6 font-semibold text-lg">
                <div className="flex items-center gap-4">
                    <label>Previous Year Working Days :</label>
                    <input
                        type="number"
                        className="w-24 border border-gray-300 p-2 rounded-lg text-center focus:ring-2 outline-none transition"
                        value={prevYearWorkingDays}
                        onChange={onPrevYearWorkingDaysChange}
                        onFocus={(e) =>
                            e.target.addEventListener("wheel", (ev) => ev.preventDefault(), { passive: false })
                        }
                    />
                </div>
                <div className="flex items-center gap-4">
                    <label>Current Year Working Days :</label>
                    <input
                        type="number"
                        className="w-24 border border-gray-300 p-2 rounded-lg text-center focus:ring-2 outline-none transition"
                        value={currYearWorkingDays}
                        onChange={onCurrYearWorkingDaysChange}
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

            {/* Table */}
            <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                <div className="max-h-[700px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">

                        {/* Table Head */}
                        <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10 h-15">
                            <tr>
                                {viewMode === 'completed' ? (
                                    // Completed view headers - fewer columns
                                    ["S.No", "Reg No", "Name", "Department", "Semester", "Percentage", "Remarks"].map((heading, idx) => (
                                        <th
                                            key={idx}
                                            className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold 
                                           text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                        >
                                            {heading}
                                        </th>
                                    ))
                                ) : (
                                    // Pending view headers - all columns
                                    ["S.No", "Reg No", "Name", "Department", "Semester", "Prev Year", "Curr Year", "Percentage", "Remarks"].map((heading, idx) => (
                                        <th
                                            key={idx}
                                            className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold 
                                           text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
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
                                filteredData.map((student, index) => {
                                    const edited = editedStudents[student.registerNo] || {
                                        prev: "",
                                        curr: "",
                                        percentage: "0.00",
                                        remark: student.deeniyathMoralRemark || "Good",
                                        isMarked: false,
                                        savedPercentage: null,
                                        savedRemark: null
                                    };

                                    const isMarked = edited.isMarked || false;

                                    // Completed view - show only percentage and remark
                                    if (viewMode === 'completed') {
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
                                                        {edited.savedPercentage || edited.percentage || 'N/A'}%
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 inline-block min-w-[80px]">
                                                        {edited.savedRemark || edited.remark || '-'}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    // PENDING VIEW - editable inputs
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
                                                {student.semester === "I" ? (
                                                    <span className="text-gray-400 dark:text-gray-500">N/A</span>
                                                ) : (
                                                    <input
                                                        type="number"
                                                        value={edited.prev ?? ""}
                                                        onChange={(e) => {
                                                            onStudentDaysChange(student.registerNo, "prev", e.target.value, student.semester);
                                                        }}
                                                        onFocus={(e) =>
                                                            e.target.addEventListener("wheel", (ev) => ev.preventDefault(), { passive: false })
                                                        }
                                                        className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg 
                                                        text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400
                                                        dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                                    />
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <input
                                                    type="number"
                                                    value={edited.curr ?? ""}
                                                    onChange={(e) => {
                                                        onStudentDaysChange(student.registerNo, "curr", e.target.value, student.semester);
                                                    }}
                                                    onFocus={(e) =>
                                                        e.target.addEventListener("wheel", (ev) => ev.preventDefault(), { passive: false })
                                                    }
                                                    className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg 
                                                    text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400
                                                    dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={edited.percentage ?? ""}
                                                    className="w-28 px-3 py-1.5 border border-gray-300 bg-gray-100 font-semibold 
                                                   rounded-lg text-sm text-gray-700 
                                                   dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <input
                                                    type="text"
                                                    value={edited.remark ?? ""}
                                                    onChange={(e) =>
                                                        onStudentRemarkChange(student.registerNo, e.target.value)
                                                    }
                                                    className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg 
                                                   text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400
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

            {/* Submit Button - only show in pending view */}
            {viewMode === 'pending' && (
                <div className="text-right">
                    <Button
                        customBtnStyle="bg-blue-600 mt-6 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold"
                        label="Submit"
                        handleSubmit={onSubmit}
                    />
                </div>
            )}
        </div>
    )
}

export default DmAttendance;