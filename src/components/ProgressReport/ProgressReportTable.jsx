import React from "react";

const ProgressReportTable = ({ rows }) => {

    return (
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden w-full">
            <div className="overflow-x-auto max-h-[600px]">
                <table className="min-w-full divide-y divide-gray-200 text-center">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                            {["Report Type", "Finished", "Pending", "Total"].map((title, i) => (
                                <th
                                    key={i}
                                    className="px-6 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 uppercase tracking-wider"
                                >
                                    {title}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 text-gray-800 text-sm sm:text-base">
                        {rows.map((row, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 transition duration-200"
                            >
                                <td className="px-6 py-4 font-semibold text-gray-700">
                                    {row.type}
                                </td>

                                <td className="px-6 py-4 text-green-600 font-semibold">
                                    {row.finished}
                                </td>

                                <td className="px-6 py-4 text-yellow-600 font-semibold">
                                    {row.pending}
                                </td>

                                <td className="px-6 py-4 text-blue-600 font-semibold">
                                    {row.total}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProgressReportTable;
