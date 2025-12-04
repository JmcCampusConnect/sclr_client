import React, { useState } from "react";
import axios from "axios";
import "../../App.css";

const apiUrl = import.meta.env.VITE_API_URL;

function AddDepartmentModal({ onClose, onAddDepartment }) {

    const [formData, setFormData] = useState({ department: "", departmentName: "" });
    const [errors, setErrors] = useState({});

    const handleDepartmentChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            department: value.toUpperCase(),
        }));
        setErrors((prev) => ({ ...prev, department: "" }));
    };

    const handleDepartmentNameChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            departmentName: value,
        }));
        setErrors((prev) => ({ ...prev, departmentName: "" }));
    };

    const toTitleCase = (str) =>
        str
            .toLowerCase()
            .split(" ")
            .filter(Boolean)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

    const validateForm = () => {
        const newErrors = {};
        if (!formData.department.trim())
            newErrors.department = "Department ID is required.";
        if (!formData.departmentName.trim())
            newErrors.departmentName = "Department Name is required.";
        setErrors(newErrors);
        return newErrors;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            const firstErrorField = Object.keys(newErrors)[0];
            const el = document.querySelector(`[name="${firstErrorField}"]`);
            if (el) el.focus();
            return;
        }

        const payload = {
            ...formData,
            department: formData.department.toUpperCase(),
            departmentName: toTitleCase(formData.departmentName),
        };

        try {
            const response = await axios.post(`${apiUrl}/api/dept/addDepartment`, payload);
            if (response.data.success) {
                alert(response.data.message);
                onAddDepartment?.(response.data.department);
                onClose();
            } else {
                alert(response.data.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("Error adding department : ", error);
            if (error.response) {
                alert(error.response.data.message || "Server error occurred.");
            } else if (error.request) {
                alert("No response from server. Please check your network.");
            } else {
                alert("Unexpected error. Please try again later.");
            }
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full border border-gray-200 dark:border-gray-700 max-w-6xl hide-scrollbar overflow-y-auto max-h-[80vh]">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        🏛️ Add Department
                    </h1>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold transition"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            🧾 Basic Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Department ID"
                                name="department"
                                value={formData.department}
                                onChange={handleDepartmentChange}
                                required
                                error={errors.department}
                            />
                            <Input
                                label="Department Name"
                                name="departmentName"
                                value={formData.departmentName}
                                onChange={handleDepartmentNameChange}
                                required
                                error={errors.departmentName}
                            />
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
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const Input = ({ label, name, type = "text", value, onChange, error, ...props }) => (
    <div className="space-y-2">
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            {label} : {props.required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            {...props}
            className={`w-full p-2.5 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none transition
      		${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
)

export default AddDepartmentModal;