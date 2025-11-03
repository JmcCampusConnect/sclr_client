import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useFetch } from '../../hook/useFetch';
import { useAdd } from '../../hook/useAdd';
import StaffStatus from '../../components/Others/StaffStatus';
import HeaderTag from '../../common/HeaderTag';
import Button from '../../common/Button';

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

    useEffect(() => {
        const getStudents = async () => {
            try {
                const response = await fetchData(`${apiUrl}/api/staff/dm/studentsDM`, { userId });
                setStudents(response.data.students || []);
                setCount(response.data.counts);
                setStaffData(response.data.StaffData[0])
            } catch (error) {
                console.log("Error while fetching students : ", error);
            }
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
            alert("Please enter Previous Year Working Days first.");
            return false;
        }
        if (type === "curr" && currYearWorkingDays === "") {
            alert("Please enter Current Year Working Days first.");
            return false;
        }
        return true;
    };

    const onStudentDaysChange = (registerNo, type, val, semester) => {

        if (!validateGlobalWorkingDaysBeforeStudentInput(type)) return;
        const maxPrev = parseInt(prevYearWorkingDays) || Number.MAX_SAFE_INTEGER;
        const maxCurr = parseInt(currYearWorkingDays) || Number.MAX_SAFE_INTEGER;
        if (!/^\d*$/.test(val)) return;
        if (type === "prev" && val !== "" && parseInt(val) > maxPrev) return;
        if (type === "curr" && val !== "" && parseInt(val) > maxCurr) return;

        let record = editedStudents[registerNo] || { prev: "", curr: "", percentage: "0.00", remark: "Good" };

        record = { ...record, [type]: val };

        const prevVal = record.prev === "" ? 0 : parseInt(record.prev);
        const currVal = record.curr === "" ? 0 : parseInt(record.curr);

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

        if (!(registerNo in editedStudents) || !editedStudents[registerNo].hasOwnProperty('remark')) {
            record.remark = "Good";
        }

        setEditedStudents(prev => ({ ...prev, [registerNo]: record }));
    };

    const onStudentRemarkChange = (registerNo, val) => {
        let record = editedStudents[registerNo] || { prev: "", curr: "", percentage: "0.00", remark: "" };
        record = { ...record, remark: val };
        setEditedStudents(prev => ({ ...prev, [registerNo]: record }));
    };

    const onSubmit = async () => {

        const submissionArray = Object.entries(editedStudents).map(([registerNo, data]) => ({
            registerNo,
            previousYearDays: data.prev,
            currentYearDays: data.curr,
            percentage: data.percentage,
            remark: data.remark.trim() === "" ? "Good" : data.remark
        }));

        try {
            const saveStudents = await addData(`${apiUrl}/api/staff/dm/saveStdutntDM`, submissionArray);
            alert("Attendance saved");
            window.location.reload();
        } catch (e) {
            console.log("Something went wrong while saving attendance DM");
            addError && addError(e);
        }
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
            <div className="overflow-y-auto overflow-x-auto rounded-2xl shadow-lg ring-1 ring-black/10 max-h-[500px]">
                <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                    {/* Table Head */}
                    <thead className="bg-emerald-700 text-white sticky top-0 z-20">
                        <tr>
                            <th className="px-4 py-3 text-center text-md font-semibold uppercase border-r border-gray-300">
                                S.No
                            </th>
                            {["Reg No", "Name", "Department", "Prev Year", "Curr Year", "Percentage", "Remarks"].map(
                                (heading, i) => (
                                    <th
                                        key={i}
                                        className="px-4 py-3 text-center text-md font-semibold uppercase border-r border-gray-300"
                                    >
                                        {heading}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="bg-white divide-y divide-gray-100">
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
                                        className="hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4 text-center font-semibold text-gray-700 border-r border-gray-200">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-semibold text-gray-800 uppercase border-r border-gray-200">
                                            {student.registerNo}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-semibold text-gray-800 uppercase border-r border-gray-200">
                                            {student.name}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">
                                            {student.department || student.dept}
                                        </td>

                                        {/* Prev Year */}
                                        <td className="px-4 py-3 text-center border-r border-gray-200">
                                            {student.semester === "I" ? (
                                                <span className="text-gray-400">NA</span>
                                            ) : (
                                                <input
                                                    type="number"
                                                    className="w-24 border border-gray-300 p-2 rounded-lg text-center focus:ring-2 outline-none transition"
                                                    value={edited.prev}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val === "" || handleDayInput(val, maxPrev)) {
                                                            onStudentDaysChange(student.registerNo, "prev", val, student.semester);
                                                        }
                                                    }}
                                                    onFocus={(e) =>
                                                        e.target.addEventListener("wheel", (ev) => ev.preventDefault(), { passive: false })
                                                    }
                                                />
                                            )}
                                        </td>

                                        {/* Curr Year */}
                                        <td className="px-4 py-3 text-center border-r border-gray-200">
                                            <input
                                                type="number"
                                                className="w-24 border border-gray-300 p-2 rounded-lg text-center focus:ring-2 outline-none transition"
                                                value={edited.curr}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === "" || handleDayInput(val, maxCurr)) {
                                                        onStudentDaysChange(student.registerNo, "curr", val, student.semester);
                                                    }
                                                }}
                                                onFocus={(e) =>
                                                    e.target.addEventListener("wheel", (ev) => ev.preventDefault(), { passive: false })
                                                }
                                            />
                                        </td>

                                        {/* Percentage */}
                                        <td className="px-4 py-3 text-center border-r border-gray-200">
                                            <input
                                                type="text"
                                                className="w-28 border border-gray-200 p-2 rounded-lg text-center bg-gray-50 font-semibold text-gray-600"
                                                value={edited.percentage}
                                                readOnly
                                            />
                                        </td>

                                        {/* Remarks */}
                                        <td className="px-4 py-3 text-center border-gray-200">
                                            <input
                                                type="text"
                                                className="w-24 border border-gray-300 p-2 rounded-lg text-center focus:ring-2 outline-none transition"
                                                value={edited.remark}
                                                onChange={(e) => onStudentRemarkChange(student.registerNo, e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
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