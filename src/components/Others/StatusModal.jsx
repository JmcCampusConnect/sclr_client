import React from "react";
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function StatusModal({ data, onClose, onRelease }) {

    const handleRelease = () => {
        if (onRelease)
            onRelease(data);
        onClose();
    };

    const DisplayField = ({ label, value }) => (
        <div className="space-y-1">
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                {label} :
            </label>
            <div className="w-full p-2.5 border rounded-lg bg-gray-100 dark:bg-gray-800
                text-gray-900 dark:text-gray-100 border-gray-300">
                {value ?? "-"}
            </div>
        </div>
    );

    const Section = ({ title, children }) => (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6
            bg-gray-50 dark:bg-gray-800/50 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b
                border-gray-300 dark:border-gray-700 pb-2">
                {title}
            </h2>
            {children}
        </div>
    );

    const renderApplicationStatus = () => {

        const status = data.applicationStatus;
        const reasons = data.rejectionReasons || [];

        switch (status) {
            case 0:
                return (
                    <div className="border border-yellow-300 dark:border-yellow-800 rounded-xl mt-6
                        p-5 bg-yellow-50 dark:bg-yellow-900/20">
                        <div className="flex items-center space-x-2">
                            <FaHourglassHalf className="text-xl text-yellow-500 animate-pulse" />
                            <span className="text-yellow-700 dark:text-yellow-300">
                                Your application is currently under review. We'll notify you of any updates.
                            </span>
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="border border-green-300 dark:border-green-800 rounded-xl mt-6
                        p-5 bg-green-50 dark:bg-green-900/20 space-y-3">

                        <div className="flex items-center space-x-2">
                            <FaCheckCircle className="text-xl text-green-500" />
                            <span className="text-lg font-semibold text-green-700 dark:text-green-300">
                                Congratulations! Your application has been approved.
                            </span>
                        </div>

                        <p className="text-sm text-gray-700 dark:text-gray-300 border-l-4
                            border-green-500 pl-3 py-1 bg-green-50/50 dark:bg-gray-800">
                            For any queries regarding the next steps, please contact ERP or the Scholarship Office.
                        </p>
                    </div>
                );

            case 2:
                return (
                    <div className="border border-red-300 dark:border-red-900 rounded-xl mt-6
                        p-5 bg-red-50 dark:bg-red-900/20 space-y-4">

                        <div className="flex items-center space-x-2 border-b pb-3">
                            <FaTimesCircle className="text-xl text-red-600" />
                            <span className="text-lg font-semibold text-red-700 dark:text-red-400">
                                Application Rejected
                            </span>
                        </div>

                        <p className="text-base text-red-700 dark:text-red-300">
                            We regret to inform you that your application could not be selected at this time.
                        </p>

                        {reasons.length > 0 && (
                            <div className="p-3 border border-red-300 rounded-lg bg-red-100 dark:bg-red-900/20">
                                <p className="font-medium text-red-700 dark:text-red-400 mb-2">
                                    Reasons for Rejection :
                                </p>

                                <ul className="list-disc list-inside space-y-1 text-sm text-red-600
                                    dark:text-red-300 ml-4">
                                    {reasons.map((reason, index) => (
                                        <li key={index}>
                                            {typeof reason === "string" ? reason : reason.type}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Please review the requirements and consider reapplying next year.
                        </p>
                    </div>
                );

            default: return <p className="text-gray-500 italic">No status data available.</p>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full border border-gray-200 dark:border-gray-700 hide-scrollbar max-w-6xl hide-scrollbar overflow-y-auto max-h-[80vh]">

                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-4
                    border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        📄 Student Application Details
                    </h1>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400
                            dark:hover:text-gray-200 text-xl font-bold transition">
                        ×
                    </button>
                </div>

                {/* BODY */}
                <div className="p-6 space-y-6">

                    {/* APPLICATION STATUS */}
                    <Section title="📌 Application Status">
                        {renderApplicationStatus()}
                    </Section>

                    {/* BASIC INFORMATION */}
                    <Section title="🧾 Basic Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <DisplayField label="Register No" value={data.registerNo} />
                            <DisplayField label="Name" value={data.name} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <DisplayField label="Department" value={data.department} />
                            <DisplayField label="Graduate" value={data.graduate} />
                            <DisplayField label="Semester" value={data.semester} />
                            <DisplayField label="Category" value={data.category} />
                            <DisplayField label="Special Category" value={data.specialCategory} />
                            <DisplayField label="Scholarship Type" value={data.sclrType} />
                        </div>
                    </Section>

                    {/* ACADEMICS */}
                    <Section title="📚 Academic Details">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <DisplayField label="Class Attendance %" value={data.classAttendancePercentage} />
                            <DisplayField label="Deeniyath Attendance %" value={data.deeniyathMoralAttendancePercentage} />
                            <DisplayField label="Govt Scholarship" value={data.governmentScholarship === 0 ? "Pending" : data.governmentScholarship === 1 ? "Yes" : data.governmentScholarship === 2 ? "No" : "-"} />
                            <DisplayField label="Semester Mark %" value={data.semesterMarkPercentage} />
                            <DisplayField label="Semester Grade" value={data.semesterGrade} />
                            <DisplayField label="Semester Arrear" value={data.semesterArrear} />
                        </div>
                    </Section>

                    {/* SCHOLARSHIP */}
                    <Section title="💰 Scholarship Details">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <DisplayField label="Last Year Credited" value={data.lastYearCreditedAmount} />
                            <DisplayField label="Current Year Credited" value={data.currentYearCreditedAmount} />
                            <DisplayField label="Total Credited Amount" value={data.totalCreditedAmount} />
                        </div>
                    </Section>

                    {/* TUTOR VERIFICATION */}
                    <Section title="📜 Tutor Verification">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <DisplayField label="Orphan or Single Parent" value={data?.tutorVerificationDetails?.orphanOrSingleParent ? "Yes" : "No"} />
                            <DisplayField label="Hazrath or Muaddin" value={data?.tutorVerificationDetails?.hazrathOrMuaddin ? "Yes" : "No"} />
                            <DisplayField label="Eligible for Zakkath" value={data?.tutorVerificationDetails?.eligibleForZakkath ? "Yes" : "No"} />
                            <DisplayField label="Needy but Not Zakkath" value={data?.tutorVerificationDetails?.needyButNotZakkath ? "Yes" : "No"} />
                            <DisplayField label="Remarks" value={data?.tutorVerificationDetails?.remarks ? data.tutorVerificationDetails.remarks : "-"} />
                            <DisplayField label="Verified By" value={data?.tutorVerificationDetails?.verifiedBy ? data.tutorVerificationDetails.verifiedBy : "-"} />
                        </div>
                    </Section>

                </div>

                {/* FOOTER BUTTONS */}
                <div className="flex justify-end gap-4 px-6 py-4
                    border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg font-semibold bg-gray-300
                            hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600
                            dark:text-gray-100 transition">
                        Close
                    </button>

                    <button
                        onClick={handleRelease}
                        className="px-6 py-2.5 rounded-lg font-semibold bg-green-600 hover:bg-green-700
                            text-white shadow-md transition">
                        Release
                    </button>
                </div>

            </div>
        </div>
    )
}

export default StatusModal;