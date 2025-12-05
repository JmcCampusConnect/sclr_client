import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchDropdown from '../../common/SearchDropdown';

const apiUrl = import.meta.env.VITE_API_URL;

function RejectModal({ showRejectModal, closeModal, selectedStudent, refreshStudents }) {

    const student = selectedStudent || {};

    const reasonOptions = [
        { value: "Low Percentage of Marks", label: "Low Percentage of Marks" },
        { value: "Re-Appear (Failed in Exam)", label: "Re-Appear (Failed in Exam)" },
        { value: "Shortage of Attendance", label: "Shortage of Attendance" },
        { value: "Shortage of Deeniyath Moral Attendance", label: "Shortage of Deeniyath Moral Attendance" },
        { value: "High Family Income", label: "High Family Income" },
        { value: "Required Documents Not Submitted", label: "Required Documents Not Submitted" },
    ];

    const [selectedReasons, setSelectedReasons] = useState([]);
    const [customReason, setCustomReason] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!showRejectModal) {
            setSelectedReasons([]);
            setCustomReason("");
            setLoading(false);
        }
    }, [showRejectModal]);


    const handleSubmit = async (e) => {

        e.preventDefault();

        const finalReasons = [
            ...selectedReasons,
            ...(customReason.trim() ? [toTitleCase(customReason.trim())] : []),
        ];

        if (finalReasons.length === 0) {
            alert("Please select or enter at least one reason for rejection.");
            return;
        }

        const payload = {
            applicationId: student.applicationId,
            registerNo: student.registerNo,
            reasons: finalReasons,
        };

        try {
            setLoading(true);
            const response = await axios.post(`${apiUrl}/api/admin/application/rejectApplications`, payload);
            if (response.data.success) {
                alert("Student application has been rejected successfully!");
                await refreshStudents();
                closeModal();

            } else {
                alert(response.data.message || "Failed to reject application.");
            }
        } catch (error) {
            console.error("Error rejecting application:", error);
            alert("Something went wrong while rejecting the application.");
        } finally {
            setLoading(false);
        }
    };
    const toTitleCase = (str) => {
        return str
            .toLowerCase()
            .split(" ")
            .filter(word => word.trim() !== "")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };


    return (
        <>
            {showRejectModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80">
                    <div className="bg-white w-[80%] max-w-6xl max-h-[80vh] rounded-2xl overflow-y-auto shadow-2xl p-8 relative hide-scrollbar">
                        <form className="space-y-8" onSubmit={handleSubmit}>
                            {/* Student Info */}
                            <div className="bg-gray-100 rounded-xl p-6 shadow-inner">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3">
                                    Student Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex gap-1">
                                        <label className="block text-md font-semibold text-gray-700 mb-1">
                                            Register No. :
                                        </label>
                                        <div className="font-medium text-md text-gray-900">
                                            {student.registerNo || "—"}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <label className="block text-md font-semibold text-gray-700 mb-1">
                                            Name :
                                        </label>
                                        <div className="font-medium text-md text-gray-900">
                                            {student.name || "—"}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <label className="block text-md font-semibold text-gray-700 mb-1">
                                            Department :
                                        </label>
                                        <div className="font-medium text-md text-gray-900">
                                            {student.department || "—"}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <label className="block text-md font-semibold text-gray-700 mb-1">
                                            Special Category :
                                        </label>
                                        <div className="font-medium text-md text-gray-900 uppercase">
                                            {student.specialCategory || "—"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rejection Reasons */}
                            <div className="bg-gray-50 border border-gray-200 rounded-md p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                    <label className="block text-gray-700 font-semibold">
                                        Rejection Reason :
                                    </label>
                                    <label className="block text-gray-700 font-semibold">
                                        Enter Custom Reason :
                                    </label>

                                    <SearchDropdown
                                        name="reason"
                                        options={reasonOptions}
                                        isMulti={true}
                                        value={selectedReasons}
                                        onChange={(name, options) => {
                                            const selectedValues = options.map((opt) => opt.value);
                                            setSelectedReasons(selectedValues);
                                        }}
                                    />

                                    <input
                                        type="text"
                                        value={customReason}
                                        onChange={(e) => setCustomReason(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                    />

                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end items-center gap-6 mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-green-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-60"
                                >
                                    {loading ? "Submitting..." : "Submit"}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-red-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-red-600 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default RejectModal;