import React from "react";

function DonorTable({ donors, onEdit, onDelete, onAmount }) {

    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
            <div className="max-h-[700px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
                    <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
                        <tr>
                            {["Id", "Name", "Actions"].map((header) => (
                                <th
                                    key={header}
                                    className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {donors.map((donor) => (
                            <tr
                                key={donor.donorId}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
                            >
                                <td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
                                    {donor.donorId}
                                </td>
                                <td className="px-4 py-4 text-sm lg:text-base font-medium text-gray-800 dark:text-white">
                                    {donor.donorName}
                                </td>
                                <td className="px-4 py-4 text-sm lg:text-base whitespace-nowrap">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => onAmount(donor)}
                                            className="w-20 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition text-xs sm:text-sm"
                                        >
                                            Amount
                                        </button>
                                        <button
                                            className="w-20 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition text-xs sm:text-sm"
                                            onClick={() => onEdit(donor)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(donor)}
                                            className="w-20 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition text-xs sm:text-sm"
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
    )
}

export default DonorTable;