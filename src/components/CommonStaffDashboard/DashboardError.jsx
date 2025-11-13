import React from 'react';
import Loading from '../../assets/svg/Pulse.svg';

const DashboardError = ({ type, message }) => {

    if (type === 'loading')
        return (
            <div className="flex flex-col items-center justify-center">
                <img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
                <p className="text-gray-600 font-medium text-lg">Loading datas...</p>
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