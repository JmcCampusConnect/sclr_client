import React, { useEffect } from "react";
import StaffStatus from "../../components/Others/StaffStatus";
import Button from "../../common/Button";
import HeaderTag from "../../common/HeaderTag";
import axios from "axios";

function ScholarshipStaff() {

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await axios.get(`${apiUrl}/api/staff/sclr/students`);
        }
        fetchStudents()
    }, []);

    const headers = [
        { key: "sno", label: "S.No", className: "w-[6%]" },
        { key: "regNo", label: "Reg No", style: { width: "12%" } },
        { key: "name", label: "Name", style: { width: "12%" } },
        { key: "department", label: "Department", style: { width: "12%" } },
        { key: "maxMark", label: "Max Mark", style: { width: "10%" } },
        { key: "markSecured", label: "Mark Secured", style: { width: "10%" } },
        { key: "percent", label: "Percent %", style: { width: "10%" } },
        { key: "arrears", label: "Arrears", style: { width: "10%" } },
        { key: "remarks", label: "Grade", style: { width: "20%" } },
    ];

    const dummyStudents = Array.from({ length: 10 }, (_, i) => ({
        _id: i + 1,
        registerNo: `REG00${i + 1}`,
        name: `Student ${i + 1}`,
        department: "CSE",
        maxMark: "",
        markSecured: "",
        semesterMarkPercentage: "",
        semesterArrear: "",
        semesterGrade: "",
    }));

    return (
        <div>
            <HeaderTag label="Semester Mark Entry" />
            <StaffStatus counts={{ total: 10, completed: 3, pending: 7 }} />
            <div className="text-right font-semibold mb-4 text-lg">
                No of Students : {dummyStudents.length}
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
                            {dummyStudents.map((student, index) => (
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

                                    <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                        {student.name}
                                    </td>

                                    <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                        {student.department}
                                    </td>

                                    <td className="px-4 py-4">
                                        <input
                                            type="number"
                                            className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                            placeholder="-"
                                        />
                                    </td>

                                    <td className="px-4 py-4">
                                        <input
                                            type="number"
                                            className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                            placeholder="-"
                                        />
                                    </td>

                                    <td className="px-4 py-4">
                                        <input
                                            type="text"
                                            readOnly
                                            className="w-28 px-3 py-1.5 border border-gray-300 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600"
                                            value="0.00"
                                        />
                                    </td>

                                    <td className="px-4 py-4">
                                        <input
                                            type="number"
                                            className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                            placeholder="-"
                                        />
                                    </td>

                                    <td className="px-4 py-4">
                                        <input
                                            type="text"
                                            className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                                            placeholder="Grade"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-right">
                <Button
                    label="Submit"
                    customBtnStyle="bg-blue-600 mt-6 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold"
                />
            </div>
        </div>
    );
}

export default ScholarshipStaff;
