import React, { useEffect, useState } from 'react';
import StaffStatus from '../../components/Others/StaffStatus';
import Button from '../../common/Button';
import HeaderTag from '../../common/HeaderTag';
import { useFetch } from '../../hook/useFetch';
import { useAdd } from '../../hook/useAdd'

function CoeMark() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { fetchError, fetchData } = useFetch();
    const [StudentsData, setStudentsData] = useState([]);
    const [changedStudents, setChangedStudents] = useState([]);
    const [statusCount, setStatusCount] = useState({});
    const { addError, addData } = useAdd()

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
            try {
                const Students = await fetchData(`${apiUrl}/api/staff/coe/students`, {});
                setStudentsData(Students.data?.data || []);
                setStatusCount(Students.data.counts)
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    fetchError && fetchError(err.response.data.message || 'No students found');
                } else {
                    console.error('Something error on fetch student for coe:', err);
                    fetchError && fetchError('Server error: unable to fetch student data');
                }
            }
        }
        fetchStudents()
    }, [])

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
        } catch (err) {
            console.log('Something error in saving mark in COE : ');
            fetchError && erroAdd('Failed to save student marks');
        }
    }

    return (
        <div>
            <HeaderTag label="Semester Mark Entry" />
            <StaffStatus counts={statusCount} />

            <div className="text-right font-semibold mb-4 text-lg">
                No of Students : {StudentsData.length}
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
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
                                        <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
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