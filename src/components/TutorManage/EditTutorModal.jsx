import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../App.css";
import SearchDropdown from "../../common/SearchDropDown";

const apiUrl = import.meta.env.VITE_API_URL;

function EditTutorModal({ tutor, onClose, onUpdateTutor }) {

    const [formData, setFormData] = useState({ ...tutor });
    const [departments, setDepartments] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/tutor/departments`);
                setDepartments(response.data.departments);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };
        fetchDepartments();
    }, []);

    const dep = Object.values(departments).map((item) => ({
        value: item.department,
        label: `${item.department} - ${item.departmentName}`,
    }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (name, option) => {
        setFormData((prev) => ({
            ...prev,
            [name]: option ? option.value : "",
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.staffId?.trim()) newErrors.staffId = "Staff ID is required.";
        if (!formData.staffName?.trim()) newErrors.staffName = "Staff Name is required.";
        if (!formData.department) newErrors.department = "Department is required.";
        if (!formData.category) newErrors.category = "Category is required.";
        if (!formData.batch) newErrors.batch = "Batch is required.";
        if (!formData.section) newErrors.section = "Section is required.";

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

        try {
            const response = await axios.post(`${apiUrl}/api/tutor/updateTutor`, formData);
            if (response.status === 200) {
                alert(response.data.message || "Tutor updated successfully!");
                onUpdateTutor?.(formData);
                onClose();
            }
        } catch (error) {
            const status = error?.response?.status;
            const msg = error?.response?.data?.message;

            if (status === 401) alert(msg || "Unauthorized request.");
            else if (status === 404) alert(msg || "Tutor not found.");
            else alert("Server error while updating tutor.");
            console.error("Update tutor error:", error);
        }
    };

    const categoryOptions = ["AIDED", "SFM", "SFW"].map((v) => ({
        value: v,
        label: v,
    }));

    const batchOptions = ["2020", "2021", "2022", "2023", "2024"].map((v) => ({
        value: v,
        label: v,
    }));

    const sectionOptions = ["A", "B", "C", "D", "E", "F", "G", "H"].map((v) => ({
        value: v,
        label: v,
    }));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full border border-gray-200 dark:border-gray-700 max-w-6xl hide-scrollbar overflow-y-auto max-h-[80vh]">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        ✏️ Edit Tutor
                    </h1>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold transition"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="p-6 space-y-7">
                    {/* Section 1: Basic Info */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            🧾 Basic Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input
                                label="Staff ID"
                                name="staffId"
                                value={formData.staffId}
                                onChange={handleChange}
                                required
                                disabled
                                error={errors.staffId}
                            />
                            <Input
                                label="Staff Name"
                                name="staffName"
                                value={formData.staffName}
                                onChange={handleChange}
                                required
                                error={errors.staffName}
                            />
                            <SearchDropdown
                                label="Department"
                                name="department"
                                value={formData.department}
                                options={dep}
                                onChange={handleSelectChange}
                                required
                                error={errors.department}
                            />
                            <SearchDropdown
                                label="Category"
                                name="category"
                                value={formData.category}
                                options={categoryOptions}
                                onChange={handleSelectChange}
                                required
                                error={errors.category}
                            />
                            <SearchDropdown
                                label="Batch"
                                name="batch"
                                value={formData.batch}
                                options={batchOptions}
                                onChange={handleSelectChange}
                                required
                                error={errors.batch}
                            />
                            <SearchDropdown
                                label="Section"
                                name="section"
                                value={formData.section}
                                options={sectionOptions}
                                onChange={handleSelectChange}
                                required
                                error={errors.section}
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
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
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
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
);

export default EditTutorModal;