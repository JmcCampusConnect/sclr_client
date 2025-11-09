import React, { useState } from 'react';
import axios from 'axios';
import SearchDropdown from '../../common/SearchDropdown';
const apiUrl = import.meta.env.VITE_API_URL;

function RejectModal({ showRejectModal, closeModal, selectedStudent }) {

    const student = selectedStudent || {};

    const reasonOptions = [
        { value: "reappear", label: "Re Appear" },
        { value: "lowMarks", label: "Low Percentage of Marks" },
        { value: "missingDocs", label: "Missing Document" },
        { value: "redo", label: "Redo" },
        { value: "shortageAttendance", label: "Shortage of Attendance" },
        { value: "shortageDeeniyath", label: "Shortage of Deeniyath Attendance" },
        { value: "shortageMoral", label: "Shortage of Moral Attendance" },
        { value: "others", label: "Others" },
    ];

    const [dropdownReason, setDropdownReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();
        const finalReason = customReason.trim() || dropdownReason;
        if (!finalReason) {
            alert("Please select or enter a reason for rejection.");
            return;
        }

        const payload = { registerNo: student.registerNo, reason: finalReason, _id: student._id };

        try {

            setLoading(true);
            const response = await axios.post(`${apiUrl}/api/admin/application/rejectApplications`, payload);
            if (response.data.success) {
                alert("Student application has been rejected successfully!");
                closeModal();
                window.location.reload();
            } else { alert(response.data.message || "Failed to reject application.") }
        } catch (error) {
            console.error("Error rejecting application : ", error);
            alert("Something went wrong while rejecting the application.");
        } finally { setLoading(false) }
    }

    return (
        <>
            {showRejectModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80">
                    <div className="bg-white w-[80%] max-w-6xl max-h-[80vh] rounded-2xl overflow-y-auto shadow-2xl p-8 relative hide-scrollbar">
                        <form className="space-y-8" onSubmit={handleSubmit}>
                            {/* Header Grid */}
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

                            {/* Reason */}
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
                                        value={dropdownReason}
                                        onChange={(name, option) => {
                                            setDropdownReason(option?.value || "");
                                            setCustomReason("");
                                        }}
                                    />

                                    <input
                                        type="text"
                                        value={customReason}
                                        onChange={(e) => {
                                            setCustomReason(e.target.value);
                                            setDropdownReason("");
                                        }}
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
    )
}

export default RejectModal;