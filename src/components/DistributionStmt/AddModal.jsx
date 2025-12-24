import React, { useState } from "react";
import axios from "axios";
import SearchDropdown from "../../common/SearchDropDown";
import AcceptModal from '../Others/AcceptModal'

const apiUrl = import.meta.env.VITE_API_URL;

function AddModal({ onClose, donors, onSubmissionSuccess }) {

    const [formData, setFormData] = useState({
        semesterType: "", registerNo: "", name: "", applicationId: "",
        department: "", category: "", graduate: "", semester: "", sclrType: "",
    });

    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedStudent, setSelectedStudent] = useState(null);

    /* ================= RADIO ================= */

    const handleRadioChange = (e) => {
        setFormData({
            semesterType: e.target.value, applicationId: "",
            registerNo: "", name: "", department: "",
            category: "", graduate: "", semester: "", sclrType: "",
        });
        setStudents([]);
        setErrors({});
    };

    /* ================= SEMESTER LOGIC ================= */

    const getSemesters = () => {
        if (formData.semesterType === "Odd") return ["I", "III", "V"];
        if (formData.semesterType === "Even") return ["II", "IV", "VI"];
        return [];
    };

    /* ================= FETCH STUDENTS ================= */

    const handleFetchStudent = async () => {

        if (!formData.semesterType) {
            alert("Select Odd / Even Semester first");
            return;
        }

        setLoading(true);

        try {

            const res = await axios.post(
                `${apiUrl}/api/distribution/fetchBySemester`,
                { semesters: getSemesters() }
            );

            setStudents(
                res.data.map((s) => ({
                    value: s.registerNo,
                    label: `${s.registerNo} - ${s.name}`,
                    data: s,
                }))
            );
        } catch (err) {
            console.error('Error in fetching students : ', err);
            alert("Error fetching students");
        } finally { setLoading(false) }
    };

    /* ================= STUDENT SELECT ================= */

    const handleStudentSelect = (name, option) => {
        if (!option) {
            setFormData((prev) => ({ ...prev, registerNo: "" }));
            return;
        }

        const s = option.data;

        const normalizedStudent = {
            ...s,
            applicationId: s._id, // ✅ map _id to expected key
        };

        setFormData((prev) => ({
            ...prev,
            applicationId: s._id,
            registerNo: s.registerNo,
            name: s.name,
            department: s.department,
            category: s.category,
            graduate: s.graduate,
            semester: s.semester,
            sclrType: s.sclrType,
        }));

        setSelectedStudent(normalizedStudent); // ✅ pass normalized object
        setErrors({});
    };

    /* ================= ACCEPT MODAL ================= */

    const handleAcceptAppln = async (e) => {
        e.preventDefault();
        if (!formData.registerNo) {
            setErrors({ registerNo: "Please select a student" });
            return;
        }
        setShowAcceptModal(true);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full border border-gray-200 dark:border-gray-700 max-w-6xl hide-scrollbar overflow-y-auto max-h-[80vh]">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        ✏️ Add Distribution
                    </h1>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold transition"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleAcceptAppln} noValidate className="p-6 space-y-6">

                    {/* Selection Section */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-300 dark:border-gray-700 pb-2.5">
                            🔍 Select Student
                        </h2>
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-10 p-2.5 px-5 rounded-lg border border-gray-200">
                                <label className="flex items-center gap-3 text-gray-700 dark:text-gray-200 cursor-pointer font-medium text-md">
                                    <input
                                        type="radio"
                                        value="Odd"
                                        checked={formData.semesterType === "Odd"}
                                        onChange={handleRadioChange}
                                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                    />
                                    Odd Semester
                                </label>
                                <label className="flex items-center gap-3 text-gray-700 dark:text-gray-200 cursor-pointer font-medium text-md">
                                    <input
                                        type="radio"
                                        value="Even"
                                        checked={formData.semesterType === "Even"}
                                        onChange={handleRadioChange}
                                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                    />
                                    Even Semester
                                </label>
                            </div>
                            <button
                                type="button"
                                onClick={handleFetchStudent}
                                disabled={loading}
                                className="px-6 py-2.5 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition disabled:bg-gray-400 dark:disabled:bg-gray-600"
                            >
                                {loading ? "Fetching..." : "Get Data"}
                            </button>
                        </div>
                    </div>

                    {/* Student Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2.5">
                            📋 Student Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SearchDropdown
                                label="Register No"
                                name="registerNo"
                                value={formData.registerNo}
                                options={students}
                                onChange={handleStudentSelect}
                                required
                                error={errors.registerNo}
                            />
                            <Input label="Name" value={formData.name} disabled />
                            <Input label="Department" value={formData.department} disabled />
                            <Input label="Category" value={formData.category} disabled />
                            <Input label="Graduate" value={formData.graduate} disabled />
                            <Input label="Semester" value={formData.semester} disabled />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg font-semibold bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md transition"
                        >
                            Accept Application
                        </button>
                    </div>
                </form>
            </div>
            {showAcceptModal && (
                <AcceptModal
                    showAcceptModal={showAcceptModal}
                    closeModal={() => setShowAcceptModal(false)}
                    selectedStudent={selectedStudent}
                    donors={donors}
                    onSubmissionSuccess={onSubmissionSuccess}
                />
            )}
        </div>
    );
}

const Input = ({ label, value, error, disabled, ...props }) => (

    <div className="space-y-2">
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            {label} :
        </label>

        <input
            type="text"
            value={value}
            disabled={disabled}
            {...props}
            className={`w-full p-2.5 border rounded-lg outline-none transition
                ${disabled
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed border-gray-200 dark:border-gray-600"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 focus:ring-blue-500"
                }
                ${error ? "border-red-500 focus:ring-red-500" : ""}
            `}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

export default AddModal;
