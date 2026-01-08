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
        // Check if global working days are entered
        if (!validateGlobalWorkingDaysBeforeStudentInput(type)) return;

        const maxPrev = parseInt(prevYearWorkingDays) || Number.MAX_SAFE_INTEGER;
        const maxCurr = parseInt(currYearWorkingDays) || Number.MAX_SAFE_INTEGER;

        // Only allow numbers
        if (!/^\d*$/.test(val)) return;

        // If value exceeds max, remove it (set to "")
        if ((type === "prev" && val !== "" && parseInt(val) > maxPrev) ||
            (type === "curr" && val !== "" && parseInt(val) > maxCurr)) {
            val = ""; // <-- removes the value
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
        let record = editedStudents[registerNo] || { prev: "", curr: "", percentage: "0.00", remark: "" };
        record = { ...record, remark: val };
        setEditedStudents(prev => ({ ...prev, [registerNo]: record }));
    };

    const onSubmit = async () => {
        const submissionArray = Object.entries(editedStudents).map(([registerNo, data]) => {
            const student = students.find(std => std.registerNo === registerNo);
            return {
                _id: student?._id,
                registerNo,
                previousYearDays: data.prev,
                currentYearDays: data.curr,
                percentage: data.percentage,
                remark: data.remark.trim() === "" ? "Good" : data.remark
            }
        })

        try {
            await addData(`${apiUrl}/api/staff/dm/saveStdutntDM`, submissionArray);
            alert("Attendance saved successfully");
            window.location.reload();
        } catch (e) {
            console.log("Something went wrong while saving attendance DM : ", e);
            addError && addError(e);
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

            {/* Table */}
            <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                <div className="max-h-[700px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">

                        {/* Table Head */}
                        <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10 h-15">
                            <tr>
                                {["S.No", "Reg No", "Name", "Department", "Semester", "Prev Year", "Curr Year", "Percentage", "Remarks"].map((heading, idx) => (
                                    <th
                                        key={idx}
                                        className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold 
                                       text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {students.length > 0 ? (
                                students.map((student, index) => {
                                    const defaultRemark = student.deeniyathMoralRemark || "Good";

                                    const edited = editedStudents[student.registerNo] || {
                                        prev: "",
                                        curr: "",
                                        percentage: "0.00",
                                        remark: defaultRemark,
                                    };

                                    const maxPrev = parseInt(prevYearWorkingDays) || Number.MAX_SAFE_INTEGER;
                                    const maxCurr = parseInt(currYearWorkingDays) || Number.MAX_SAFE_INTEGER;

                                    return (
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

                                            {/* Semester */}
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                {student.semester}
                                            </td>

                                            {/* Prev Year */}
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

                                            {/* Curr Year */}
                                            <td className="px-4 py-4">
                                                {/* Curr Year */}
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

                                            {/* Percentage */}
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

                                            {/* Remarks */}
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
                                        colSpan="8"
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

            {/* Submit Button */}
            <div className="text-right">
                <Button
                    customBtnStyle="bg-blue-600 mt-6 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold"
                    label="Submit"
                    handleSubmit={onSubmit}
                />
            </div>
        </div>
    )
}

export default DmAttendance;