import React, { useEffect, useState } from 'react'
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

function Staff() {

    const [staffs, setStaffs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`${apiUrl}/api/staffManage/fetchStaffs`);
            setStaffs(response.data.staffs);
        };
        fetchData();
    }, []);
    return (
        <>
            {/* Header */}
            <header className="">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Staff Management
                </h1>

                <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="🔍 Search donars..."
                        className={`w-full md:w-1/2 ${formControlClass}`}
                    />
                    <p className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        No. of Records : {" "}
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                            {staffs.length}
                        </span>
                    </p>
                </div>

                <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                    <div className="max-h-[700px] overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
                            {/* Table Head */}
                            <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
                                <tr>
                                    {["S.No", "Staff ID", "Staff Name", "Password", ].map(
                                        // "Action"
                                        (header) => (
                                            <th
                                                key={header}
                                                className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                            >
                                                {header}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {staffs.length > 0 ? (
                                    staffs.map((staff, index) => (
                                        <tr
                                            key={staff.staffId}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
                                        >
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
                                                {staff.staffId}
                                            </td>
                                            <td className="uppercase px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
                                                {staff.staffName}
                                            </td>
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
                                                {staff.password}
                                            </td>
                                            {/* <td className="px-4 py-4 text-sm lg:text-base whitespace-nowrap">
                                                <div className="flex justify-center gap-4">
                                                    <button
                                                        className="w-20 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition text-xs sm:text-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </td> */}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base"
                                        >
                                            No records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Staff