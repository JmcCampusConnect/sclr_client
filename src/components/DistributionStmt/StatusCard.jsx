import React from 'react'

function StatusCard() {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white border-l-4 border-blue-600 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    📋 Application Summary
                </h3>
                <div className="flex justify-between text-gray-700">
                    <span>Applied Students :</span>
                    <span className="font-bold">1200</span>
                </div>
                <div className="flex justify-between text-gray-700 mt-2">
                    <span>Benefitted Students :</span>
                    <span className="font-bold">800</span>
                </div>
            </div>
            <div className="bg-white border-l-4 border-green-600 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    💰 Scholarship Summary
                </h3>
                <div className="flex justify-between text-gray-700">
                    <span>Total Received :</span>
                    <span className="font-bold">100000</span>
                </div>
                <div className="flex justify-between text-gray-700 mt-2">
                    <span>Total Awarded :</span>
                    <span className="font-bold">80000</span>
                </div>
            </div>
        </div>
    )
}

export default StatusCard