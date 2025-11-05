import React from "react";

export const Card = ({ title, children }) => (
    <div className="bg-white shadow-lg rounded-xl border border-gray-200">
        <h3 className="bg-gray-100 px-4 py-2 text-lg font-semibold rounded-t-xl border-b border-gray-200">{title}</h3>
        <div className="p-6">{children}</div>
    </div>
)

export const Detail = ({ label, value }) => (
    <div className="flex flex-col gap-1.5">
        <p className="text-gray-500 text-md ">{label} :</p>
        <p className="font-semibold text-gray-800 uppercase">{value || "-"}</p>
    </div>
)

export const InfoCard = ({ label, value }) => (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-md text-center">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-indigo-700 uppercase">{value}</p>
    </div>
)

export const StatusMessage = ({ type, message }) => {
    const colors = {
        pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
        approved: "text-green-600 bg-green-50 border-green-200",
        rejected: "text-red-600 bg-red-50 border-red-200",
    }
    return (
        <div className={`p-4 rounded-lg border ${colors[type]}`}>
            <p className="font-semibold">{message}</p>
        </div>
    )
}

export const TableRow = ({ label, children }) => (
    <tr className="">
        <td className="px-4 border border-gray-200 py-3 font-semibold text-gray-700 bg-gray-50">{label}</td>
        <td className="px-4 border border-gray-200 py-3 text-center">{children}</td>
    </tr>
)