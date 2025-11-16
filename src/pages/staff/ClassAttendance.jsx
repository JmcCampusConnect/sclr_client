import React, { useEffect, useState } from 'react';
import { useFetch } from '../../hook/useFetch';
import { useParams } from "react-router-dom";
import { useAdd } from '../../hook/useAdd';
import HeaderTag from '../../common/HeaderTag';
import StaffStatus from '../../components/Others/StaffStatus';
import Button from '../../common/Button'

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

    // FETCH STUDENT DATA

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetchData(`${apiUrl}/api/staff/class/students`, { userId });
                if (response.status === 200) {
                    setStaffData(response.data.staffData);
                    setStudents(response.data.studentData);
                    setCount(response.data.counts)
                    setStudentRows(response.data.studentData.map(stu => ({
                        _id: stu._id,
                        regNo: stu.registerNo,
                        prevSem: stu.semester === "I" ? 100 : "",
                        currSem: "",
                        remark: stu.classAttendanceRemark || "",
                        percentage: "",
                        isSemOne: stu.semester === "I"
                    })));
                }
            } catch (error) { console.log("Something error in fetch student : ", error) }
        }
        fetchStudents()
    }, [])

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
            if (value === "") { newRows[index].currSem = "" }
            else {
                let val = parseFloat(value);
                if (isNaN(val) || val < 0) return;
                const maxWorkingDays = parseFloat(workingDays);
                if (val > maxWorkingDays) { newRows[index].currSem = "" }
                else { newRows[index].currSem = val.toString() }
            }
        } else { newRows[index][field] = value }

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
            .filter(row => row.currSem !== "" && row.percentage !== "")
            .map(row => ({
                _id: row._id,
                regNo: row.regNo,
                percentage: row.percentage,
                remark: row.remark
            }));
        try {
            const saveAttendance = await addData(`${apiUrl}/api/staff/class/saveAttendance`, { enteredData });
            if (saveAttendance.status === 200) {
                alert(saveAttendance.data.message);
                window.location.reload()
            } else { alert(saveAttendance.data.message) }
        } catch (err) {
            console.error("Something error to add attendance : ", err);
            alert("Something error to add attendance");
        }
    }

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

            <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                <div className="max-h-[700px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">

                        {/* Table Head */}
                        <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10 h-15">
                            <tr>
                                {["S.No", "Reg No", "Name", "Department", "Prev Sem (%)", "Curr Sem Attended", "Percentage", "Remarks"].map((heading, idx) => (
                                    <th
                                        key={idx}
                                        className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {students.length > 0 ? (
                                students.map((stu, index) => (
                                    <tr
                                        key={stu._id || index}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
                                    >
                                        {/* S.No */}
                                        <td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
                                            {index + 1}
                                        </td>

                                        {/* Register No */}
                                        <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white uppercase">
                                            {stu.registerNo}
                                        </td>

                                        {/* Name */}
                                        <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                            {stu.name}
                                        </td>

                                        {/* Department */}
                                        <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                            {stu.department}
                                        </td>

                                        {/* Prev Sem (%) */}
                                        <td className="px-4 py-4">
                                            {studentRows[index]?.isSemOne ? (
                                                <span className="text-gray-400 dark:text-gray-500 font-medium">N/A</span>
                                            ) : (
                                                <input
                                                    type="number"
                                                    value={studentRows[index]?.prevSem ?? ""}
                                                    onChange={(e) => handleInputChange(index, "prevSem", e.target.value)}
                                                    onFocus={(e) =>
                                                        e.target.addEventListener("wheel", (ev) => ev.preventDefault(), { passive: false })
                                                    }
                                                    className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 
                                                   focus:outline-none focus:ring-2 focus:ring-blue-400 transition
                                                   dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                                />
                                            )}
                                        </td>

                                        {/* Curr Sem Attended */}
                                        <td className="px-4 py-4">
                                            <input
                                                type="number"
                                                value={studentRows[index]?.currSem ?? ""}
                                                onChange={(e) => handleInputChange(index, "currSem", e.target.value)}
                                                onFocus={(e) =>
                                                    e.target.addEventListener("wheel", (ev) => ev.preventDefault(), { passive: false })
                                                }
                                                className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 
                                               focus:outline-none focus:ring-2 focus:ring-blue-400 transition
                                               dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                            />
                                        </td>

                                        {/* Percentage */}
                                        <td className="px-4 py-4">
                                            <input
                                                type="number"
                                                readOnly
                                                value={studentRows[index]?.percentage ?? ""}
                                                onFocus={(e) =>
                                                    e.target.addEventListener("wheel", (ev) => ev.preventDefault(), { passive: false })
                                                }
                                                className="w-28 px-3 py-1.5 border border-gray-300 bg-gray-100 font-semibold rounded-lg 
                                               text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600"
                                            />
                                        </td>

                                        {/* Remarks */}
                                        <td className="px-4 py-4">
                                            <input
                                                type="text"
                                                value={studentRows[index]?.remark ?? ""}
                                                onChange={(e) => handleInputChange(index, "remark", e.target.value)}
                                                className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 
                                               focus:outline-none focus:ring-2 focus:ring-blue-400 transition
                                               dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                            />
                                        </td>
                                    </tr>
                                ))
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

            <div className="text-right">
                <Button
                    customBtnStyle="bg-blue-600 mt-6 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold"
                    label="Submit"
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
    )
}

export default ClassAttendance;