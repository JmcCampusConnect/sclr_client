import React, { useEffect, useState } from 'react';
import StaffStatus from '../components//Others/StaffStatus';
import Button from '../common/Button';
import HeaderTag from '../common/HeaderTag';
import { useFetch } from '../hook/useFetch';
import { useAdd } from '../hook/useAdd'

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
                student.semesterArrear = value === "" ? -1 : Number(value);
            } else if (field === "remarks") {
                student.semesterGrade = value;
            }
            updated[index] = student;
            setChangedStudents((prev) => {
                const existsIndex = prev.findIndex(s => s.registerNo === student.registerNo);
                const changedStudent = {
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

            <div className="overflow-y-auto overflow-x-auto rounded-2xl shadow-lg ring-1 ring-black/10 max-h-[500px]">
                <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                    {/* Table Head */}
                    <thead className="bg-emerald-700 text-white sticky top-0 z-20">
                        <tr>
                            {headers.map((header) => (
                                <th
                                    key={header.key}
                                    className={`px-4 py-3 text-center text-md font-semibold uppercase text-white border-r border-gray-300 ${header.className || ''}`}
                                    style={header.style}
                                >
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="bg-white divide-y divide-gray-100">
                        {StudentsData.length > 0 ? (
                            StudentsData.map((student, index) => (
                                <tr
                                    key={student._id}
                                    className="hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 text-center font-semibold text-gray-700 border-r border-gray-200"> {index + 1} </td>
                                    <td className="px-6 py-4 text-center text-sm font-semibold text-gray-800 uppercase border-r border-gray-200"> {student.registerNo} </td>
                                    <td className="px-6 py-4 text-center text-sm font-semibold text-gray-800 border-r border-gray-200"> {student.name} </td>
                                    <td className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-r border-gray-200"> {student.department} </td>

                                    {/* Max Mark */}
                                    <td className="px-4 py-3 text-center border-r border-gray-200">
                                        <input
                                            type="number"
                                            className="w-24 border border-gray-300 p-2 rounded-lg text-center focus:ring-2 outline-none transition"
                                            value={student.maxMark ?? ""}
                                            onChange={(e) => handleMarkChange(index, "maxMark", e.target.value)}
                                            onFocus={(e) => {
                                                e.target.addEventListener('wheel', (ev) => ev.preventDefault(), { passive: false });
                                            }}
                                        />
                                    </td>

                                    {/* Marks Secured */}
                                    <td className="px-4 py-3 text-center border-r border-gray-200">
                                        <input
                                            type="number"
                                            className="w-24 border border-gray-300 p-2 rounded-lg text-center focus:ring-2 outline-none transition"
                                            value={student.markSecured ?? ""}
                                            onChange={(e) => handleMarkChange(index, "markSecured", e.target.value)}
                                            onFocus={(e) => {
                                                e.target.addEventListener('wheel', (ev) => ev.preventDefault(), { passive: false });
                                            }}
                                        />
                                    </td>

                                    {/* Percentage */}
                                    <td className="px-4 py-3 text-center border-r border-gray-200">
                                        <input
                                            type="text"
                                            className="w-28 border border-gray-200 p-2 rounded-lg text-center bg-gray-50 font-semibold text-gray-600"
                                            value={student.semesterMarkPercentage ? student.semesterMarkPercentage.toFixed(2) : "0.00"}
                                            readOnly
                                        />
                                    </td>

                                    {/* Arrears */}
                                    <td className="px-4 py-3 text-center border-r border-gray-200">
                                        <input
                                            type="number"
                                            className="w-20 border border-gray-300 p-2 rounded-lg text-center focus:ring-2 outline-none transition"
                                            value={student.semesterArrear ?? ""}
                                            onChange={(e) => handleMarkChange(index, "arrears", e.target.value)}
                                            onFocus={(e) => {
                                                e.target.addEventListener('wheel', (ev) => ev.preventDefault(), { passive: false });
                                            }}
                                        />
                                    </td>

                                    {/* Grade */}
                                    <td className="px-4 py-3 text-center border-gray-200">
                                        <input
                                            type="text"
                                            className="w-24 border border-gray-300 p-2 rounded-lg text-center focus:ring-2 outline-none transition"
                                            value={student.semesterGrade ?? ""}
                                            onChange={(e) => handleMarkChange(index, "remarks", e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center p-6 text-gray-500 font-medium">
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
                    handleSubmit={handleSubmitMark}
                />
            </div>
        </div>
    )
}

export default CoeMark;