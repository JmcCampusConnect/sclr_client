import React from 'react';
import Loading from '../../assets/svg/Pulse.svg';

const DashboardError = ({ type, message }) => {

    if (type === 'loading')
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <img src={Loading} alt="Loading..." className="w-16 h-16 animate-pulse" />
                <p className="ml-4 text-lg text-gray-600">Loading dashboard...</p>
            </div>
        )

    if (type === 'error')
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="p-8 bg-white/70 backdrop-blur-md border border-red-200 rounded-xl shadow-md text-center">
                    <p className="text-red-600 font-semibold text-xl mb-2">Error</p>
                    <p className="text-gray-600">{message}</p>
                </div>
            </div>
        )

    return null;
}

export default DashboardError;