import React from "react";
import { Card, StatusMessage } from "./UI";
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const STATUS = {
    PENDING: 0,
    APPROVED: 1,
    REJECTED: 2,
};

const ApplicationStatus = ({ status, rejectionReasons = [] }) => {

    const renderMessage = () => {
        
        switch (status) {
            case STATUS.PENDING:
                return (
                    <StatusMessage
                        type="pending"
                        message={
                            <div className="flex items-center space-x-2">
                                <FaHourglassHalf className="text-xl text-yellow-500 animate-pulse" />
                                <span>Your application is currently under review. We'll notify you of any updates.</span>
                            </div>
                        }
                    />
                );

            case STATUS.APPROVED:
                return (
                    <StatusMessage
                        type="approved"
                        message={
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <FaCheckCircle className="text-xl text-green-500" />
                                    <span className="text-lg font-semibold">Congratulations! Your application has been approved.</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 border-l-4 border-green-500 pl-3 py-1 bg-green-50/50 dark:bg-gray-800">
                                    For any queries regarding the next steps, please contact ERP or the Scholarship Office directly.
                                </p>
                            </div>
                        }
                    />
                );

            case STATUS.REJECTED:
                return (
                    <StatusMessage
                        type="rejected"
                        message={
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2 border-b pb-3 mb-4">
                                    <FaTimesCircle className="text-xl text-red-600" />
                                    <span className="text-lg font-semibold text-red-600 dark:text-red-400">Application Rejected</span>
                                </div>

                                <p className="text-base mb-4 text-black">
                                    We regret to inform you that your application could not be selected at this time.
                                </p>

                                {rejectionReasons.length > 0 && (
                                    <div className="p-3 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20">
                                        <p className="font-medium text-red-600 dark:text-red-400 mb-2">Reasons for Rejection :</p>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-red-500 dark:text-red-300 ml-4">
                                            {rejectionReasons.map((reason, index) => (
                                                <li key={index} className="py-0.5">
                                                    <span className="font-medium">
                                                        {typeof reason === "string" ? reason : reason.type}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 pt-1">
                                    Please review the requirements and consider reapplying in the next academic year.
                                </p>
                            </div>
                        }
                    />
                );

            default:
                return (
                    <p className="text-gray-500 italic">No status information available.</p>
                );
        }
    };

    return (
        <Card title="Application Status">
            {renderMessage()}
        </Card>
    );
}

export default ApplicationStatus;