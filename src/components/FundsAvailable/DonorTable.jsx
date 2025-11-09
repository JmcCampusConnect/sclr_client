import React from "react";

const DonorTable = ({ donors, formatCurrency }) => (
    
    <div className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
            <table className="min-w-full divide-y divide-gray-200 text-center">
                <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                        {["Donor ID", "Donor Type", "Name", "General", "Zakat"].map((title, i) => (
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
                    {donors.map((donor, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition duration-200">
                            <td className="px-6 py-4 font-semibold">{donor.donorId}</td>
                            <td className="px-6 py-4">{donor.donorType || "N/A"}</td>
                            <td className="px-6 py-4">{donor.donorName || "Unknown"}</td>
                            <td className="px-6 py-4">{formatCurrency(donor.generalAmt || 0)}</td>
                            <td className="px-6 py-4">{formatCurrency(donor.zakkathAmt || 0)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
)

export default DonorTable;