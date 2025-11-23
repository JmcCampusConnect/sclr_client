import React from 'react'

function QuickRejection() {

    return (
        <div className="w-full space-y-8">

            {/* Title */}
            <header className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Quick Rejection

                </h1>
            </header>
            <h3 className="text-xl my-5 font-semibold text-gray-700 text-center dark:text-gray-200 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow">
                Students will be rejected if they meet any one of the following conditions
            </h3>

            {/* Filters Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Class Attendance */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                            Class Attendance (≤) :
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        />
                    </div>

                    {/* Deeniyath attendance */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                            Deeniyath / Moral Attendance (≤) :
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        />
                    </div>

                    {/* Percentage */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                            Percentage of Marks (≤) :
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        />
                    </div>

                    {/* Arrear Subjects */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                            Arrear Subjects (≥) :
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        />
                    </div>

                    {/* Income */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                            Annual Income (≥) :
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        />
                    </div>

                    {/* Apply Button */}
                    <div className="flex items-end">
                        <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow transition">
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Count */}
            <div className="text-right text-lg font-semibold text-gray-700 dark:text-gray-300">
                No of Students :
                <span className="text-indigo-600 dark:text-indigo-400 ml-1">0</span>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-x-auto">
                <table className="min-w-full text-center divide-y divide-gray-200 dark:divide-gray-700">

                    {/* Head */}
                    <thead className="bg-gray-100 dark:bg-gray-900">
                        <tr>
                            {["Register No", "Name", "Special Categories", "Rejection Reason"].map((head, i) => (
                                <th
                                    key={i}
                                    className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide"
                                >
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">

                        {/* Empty */}
                        <tr className="h-[70px]">
                            <td colSpan="4" className="text-gray-500 dark:text-gray-400 font-medium">
                                No records found.
                            </td>
                        </tr>

                        {/* Sample */}
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                            <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">12345</td>
                            <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">Sample Student</td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">—</td>
                            <td className="px-4 py-3">
                                <input
                                    type="text"
                                    placeholder="Enter reason"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
                <button className="px-6 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg font-medium shadow transition">
                    Back
                </button>

                <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow transition">
                    Submit All Rejections
                </button>
            </div>

        </div>
    )
}

export default QuickRejection
