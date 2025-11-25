import React from 'react'

function AcademicYearTable({ acYears, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-lg">
            <div className="max-h-[700px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
                    <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3">Academic Id</th>
                            <th className="px-4 py-3">Academic Year</th>
                            <th className="px-4 py-3">Active Status</th>
                            <th className="px-4 py-3">Application Start</th>
                            <th className="px-4 py-3">Application End</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {acYears.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-4 py-4 text-gray-700">
                                    No academics found.
                                </td>
                            </tr>
                        )}

                        {acYears.map((ac) => (
                            <tr key={ac._id} className="hover:bg-gray-50 transition">
                                <td className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">{ac._id}</td>
                                <td className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">{ac.academicYear}</td>
                                <td className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">{ac.isActive ? "Active" : "Inactive"}</td>
                                <td className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">{ac.startDate}</td>
                                <td className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">{ac.endDate}</td>


                                <td className="px-4 py-4 text-sm lg:text-base whitespace-nowrap">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            className="w-20 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition text-xs sm:text-sm"
                                            onClick={() => onEdit(ac)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="w-20 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition text-xs sm:text-sm"
                                            onClick={() => onDelete(ac)}
                                        >
                                            Delete
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


export default AcademicYearTable