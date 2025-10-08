import React, { useEffect, useState } from 'react';
import { useFetch } from '../hook/useFetch';
import { useParams } from "react-router-dom";
import { useAdd } from '../hook/useAdd';
import HeaderTag from '../common/HeaderTag';
import StaffStatus from '../components/Others/StaffStatus';

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

            <div className="text-right font-semibold mb-4 text-lg">
                No of Students : {students.length}
            </div>

            <div className="overflow-y-auto overflow-x-auto rounded-2xl shadow-lg ring-1 ring-black/10 max-h-[500px] bg-white">
                <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                    {/* Table Head */}
                    <thead className="bg-emerald-700 text-white sticky top-0 z-20">
                        <tr>
                            {["S.No", "Reg No", "Name", "Department", "Prev Sem (%)", "Curr Sem Attended", "Percentage", "Remarks"].map((heading, idx) => (
                                <th key={idx} className="px-4 py-3 text-center text-md font-semibold uppercase text-white border-r border-gray-300">
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {/* Table Body */}
                    <tbody className="bg-white divide-y divide-gray-100">
                        {students.length > 0 ? (
                            students.map((stu, index) => (
                                <tr key={stu._id || index} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 text-center font-semibold text-gray-700 border-r border-gray-200">{index + 1}</td>
                                    <td className="px-6 py-4 text-center text-sm font-semibold text-gray-800 uppercase border-r border-gray-200">{stu.registerNo}</td>
                                    <td className="px-6 py-4 text-center text-sm font-semibold text-gray-800 border-r border-gray-200">{stu.name}</td>
                                    <td className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">{stu.department}</td>

                                    {/* Prev Sem (%) */}
                                    <td className="px-4 py-3 text-center border-r border-gray-200">
                                        <input
                                            type="number"
                                            placeholder="Prev Sem"
                                            className="w-24 border border-gray-300 p-2 rounded-lg text-center focus:ring-2 outline-none transition"
                                            value={studentRows[index]?.prevSem ?? ""}
                                            onChange={e => handleInputChange(index, 'prevSem', e.target.value)}
                                            disabled={studentRows[index]?.isSemOne}
                                            onFocus={e => {
                                                e.target.addEventListener('wheel', (ev) => ev.preventDefault(), { passive: false });
                                            }}
                                        />
                                    </td>
                                    {/* Curr Sem Attended */}
                                    <td className="px-4 py-3 text-center border-r border-gray-200">
                                        <input
                                            type="number"
                                            placeholder="Curr Sem"
                                            className="w-24 border border-gray-300 p-2 rounded-lg text-center focus:ring-2 outline-none transition"
                                            value={studentRows[index]?.currSem ?? ""}
                                            onChange={e => handleInputChange(index, 'currSem', e.target.value)}
                                            onFocus={e => {
                                                e.target.addEventListener('wheel', (ev) => ev.preventDefault(), { passive: false });
                                            }}
                                        />
                                    </td>
                                    {/* Percentage */}
                                    <td className="px-4 py-3 text-center border-r border-gray-200">
                                        <input
                                            type="number"
                                            placeholder="Percentage"
                                            className="w-28 border border-gray-200 p-2 rounded-lg text-center bg-gray-50 font-semibold text-gray-600"
                                            value={studentRows[index]?.percentage ?? ""}
                                            readOnly
                                            onFocus={e => {
                                                e.target.addEventListener('wheel', (ev) => ev.preventDefault(), { passive: false });
                                            }}
                                        />
                                    </td>
                                    {/* Remarks */}
                                    <td className="px-4 py-3 text-center border-gray-200">
                                        <input
                                            type="text"
                                            placeholder="Remark"
                                            className="w-24 border border-gray-300 p-2 rounded-lg text-center focus:ring-2 outline-none transition"
                                            value={studentRows[index]?.remark ?? ""}
                                            onChange={e => handleInputChange(index, 'remark', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center p-6 text-gray-500 font-medium">
                                    No student data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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