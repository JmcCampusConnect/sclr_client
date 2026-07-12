import React from "react";
import { CheckCircle, Clock, Users, TrendingUp } from "lucide-react";

function StaffStatus({ counts }) {

    const total = counts?.totalApplications || 0;
    const completed = counts?.completed || 0;
    const pending = counts?.pending || 0;

    return (
        <div className="space-y-4 mb-6">
            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Applications Card */}
                <div className="group relative bg-white dark:bg-gray-800 rounded-md shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600"></div>
                    <div className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Total Applications
                                </p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                                    {total.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Completed Card */}
                <div className="group relative bg-white dark:bg-gray-800 rounded-md shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-500 to-green-600"></div>
                    <div className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Completed
                                </p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                                    {completed.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending Card */}
                <div className="group relative bg-white dark:bg-gray-800 rounded-md shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-amber-600"></div>
                    <div className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Pending
                                </p>
                                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                                    {pending.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StaffStatus;