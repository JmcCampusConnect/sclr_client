import React, {useState} from "react";
import axios from "axios";
import "../../App.css";

const apiUrl = import.meta.env.VITE_API_URL;

function AddAcademicYearModal({onClose, onAdded}) {

    const [formData, setFormData] = useState({
        academicYear: "",
        startDate: "",
        endDate: "",
        isActive: false,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setErrors((prev) => ({...prev, [name]: ""}));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.academicYear.trim()) {
            newErrors.academicYear = "Academic Year is required.";
        }
        if (!formData.startDate) {
            newErrors.startDate = "Start date is required.";
        }
        if (!formData.endDate) {
            newErrors.endDate = "End date is required.";
        }
        if (formData.startDate && formData.endDate) {
            if (new Date(formData.startDate) > new Date(formData.endDate)) {
                newErrors.endDate = "End date must be after start date.";
            }
        }

        setErrors(newErrors);
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(formData)

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) return;

        try {
            const response = await axios.post(
                `${apiUrl}/api/application/settings/addAcademicYear`,
                formData
            );

            if (response.status == 200) {
                alert(`${response.data.message}`);
                if (response.data.addedData) {
                    onAdded(response.data.addedData);
                }
            }
            // alert("Academic year added successfully!");
            // onAdded(response.data.academic);
            onClose();

        } catch (error) {

            if (error.status == 409) {
                alert(`Academic Year already Exists`);

            }
            console.error("Error adding academic:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-6xl hide-scrollbar overflow-y-auto max-h-[80vh]">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        🗓 Add Academic Year
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

                    {/* Academic Section */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            📘 Academic Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input
                                label="Academic Year"
                                name="academicYear"
                                placeholder="e.g. 2024 - 2025"
                                value={formData.academicYear}
                                required
                                error={errors.academicYear}
                                onChange={handleChange}
                            />



                            <Input
                                label="Start Date"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                required
                                error={errors.startDate}
                                onChange={handleChange}
                            />

                            <Input
                                label="End Date"
                                name="endDate"
                                type="date"
                                value={formData.endDate}
                                required
                                error={errors.endDate}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Checkbox */}
                        <div className="flex items-center gap-3 mt-4">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-5 h-5"
                            />
                            <label className="text-gray-800 dark:text-gray-200 font-semibold">
                                Set as Active Academic Year
                            </label>
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
    );
}

const Input = ({label, name, type = "text", value, onChange, error, ...props}) => (
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

export default AddAcademicYearModal;
