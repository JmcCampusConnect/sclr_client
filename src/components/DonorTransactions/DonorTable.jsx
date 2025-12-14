import React from "react";

function DonorTable({ transactions, loading }) {

    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
            <div className="max-h-[700px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
                    <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
                        <tr>
                            {[
                                "S.No.",
                                "Donor ID",
                                "Donor Name",
                                "Type",
                                "General",
                                "Zakkath",
                                "Date",
                                "Actions"
                            ].map((header) => (
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
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-4 py-4 text-gray-600 dark:text-gray-300"
                                >
                                    Loading transactions...
                                </td>
                            </tr>
                        ) : transactions.length > 0 ? (
                            transactions.map((txn, index) => (
                                <tr
                                    key={txn._id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
                                >
                                    <td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
                                        {index + 1}
                                    </td>

                                    <td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
                                        {txn.donorId}
                                    </td>

                                    <td className="uppercase text-nowrap px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                        {txn.donorName}
                                    </td>

                                    <td className="uppercase px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
                                        {txn.donorType}
                                    </td>

                                    <td className="px-4 py-4 text-sm lg:text-base text-green-600 dark:text-green-400 font-semibold">
                                        ₹{txn.generalAmt}
                                    </td>

                                    <td className="px-4 py-4 text-sm lg:text-base text-indigo-600 dark:text-indigo-400 font-semibold">
                                        ₹{txn.zakkathAmt}
                                    </td>

                                    <td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
                                        {new Date(txn.createdAt).toLocaleDateString()}
                                    </td>

                                    <td className="px-4 py-4 text-sm lg:text-base whitespace-nowrap">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => alert('Work under progress')}
                                                className="w-20 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition text-xs sm:text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => alert('Work under progress')}
                                                className="w-20 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition text-xs sm:text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300"
                                >
                                    No transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DonorTable;