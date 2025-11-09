import React from "react";

const StatCard = ({ icon: Icon, title, color, bgColor, stats }) => (
    
    <div className="flex flex-col bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition duration-300 hover:shadow-3xl">
        <div className={`p-6 flex items-start justify-between ${bgColor}`}>
            <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-600">{title}</p>
                <p className="mt-1 text-4xl font-extrabold text-gray-900">{stats.mainValue}</p>
                <p className="mt-1 text-sm font-medium text-gray-500">{stats.subLabel}</p>
            </div>
            <Icon className={`w-8 h-8 ${color} opacity-80`} />
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
            {stats.details.map((detail, i) => (
                <div key={i}>
                    <p className="text-xs text-gray-500 uppercase font-medium">{detail.label}</p>
                    <p className="mt-0.5 text-lg font-bold text-gray-800">{detail.value}</p>
                </div>
            ))}
        </div>
    </div>
)

export default StatCard;