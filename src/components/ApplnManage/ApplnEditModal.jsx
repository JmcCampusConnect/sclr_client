import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchDropdown from "../../common/SearchDropDown";
import "../../App.css";

const apiUrl = import.meta.env.VITE_API_URL;

function ApplnEditModal({ application, onClose, onUpdate }) {

    const [formData, setFormData] = useState(null);
    const [errors, setErrors] = useState({});
    const [oldRegNo, setOldRegNo] = useState("");
    const [dropdownData, setDropdownData] = useState({
        categories: [],
        departments: [],
        batches: [],
        semesters: [
            { value: "I", label: "I" },
            { value: "II", label: "II" },
            { value: "III", label: "III" },
            { value: "IV", label: "IV" },
            { value: "V", label: "V" },
            { value: "VI", label: "VI" },
        ],
        sections: ["A", "B", "C", "D", "E", "F", "G", "H", "I"].map(v => ({ value: v, label: v })),
        religions: ["Muslim", "Hindu", "Christian", "Others"].map(v => ({ value: v, label: v }))
    });

    useEffect(() => {
        if (application) {
            setFormData(structuredClone(application));
            setOldRegNo(application.registerNo);
        } else {
            setFormData(null);
            setOldRegNo("");
        }
        setErrors({});
    }, [application]);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/common/fetchDropdownData`);
                setDropdownData(prev => ({
                    ...prev,
                    categories: [{ value: "All", label: "All" }, ...res.data.categories.map(c => ({ value: c, label: c.toUpperCase() }))],
                    departments: [{ value: "All", label: "All" }, ...res.data.departments.map(d => ({ value: d.department, label: `${d.department} - ${d.departmentName}` }))],
                    batches: [{ value: "All", label: "All" }, ...res.data.batches.map(b => ({ value: b, label: b }))]
                }));
            } catch (err) {
                console.error("Dropdown fetch error:", err);
            }
        };
        fetchDropdownData();
    }, []);

    useEffect(() => {
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
            const el = document.querySelector(`[name="${firstErrorField}"]`);
            if (el) el.focus();
        }
    }, [errors]);

    const setByPath = (prev, path, value) => {
        if (!path.includes(".")) return { ...prev, [path]: value };
        const parts = path.split(".");
        const key = parts[0];
        const rest = parts.slice(1).join(".");
        return { ...prev, [key]: setNested(prev[key] ?? {}, rest, value) };
    };

    const setNested = (obj, path, value) => {
        const parts = path.split(".");
        if (parts.length === 1) return { ...obj, [parts[0]]: value };
        const [head, ...tail] = parts;
        return { ...obj, [head]: setNested(obj[head] ?? {}, tail.join("."), value) };
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        let v;
        if (type === "file") {
            v = files[0] || null;
        } else if (type === "number") {
            v = value === "" ? "" : Number(value);
        } else {
            v = value;
        }
        setFormData(prev => setByPath(prev, name, v));
        setErrors(prev => {
            const copy = { ...prev };
            delete copy[name];
            return copy;
        });
    };

    const handleSelectChange = (name, option) => {
        setFormData(prev => setByPath(prev, name, option ? option.value : ""));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validate = () => {

        const newErrors = {};
        const requiredFields = [
            "registerNo", "name", "category", "graduate", "department",
            "yearOfAdmission", "semester", "section", "religion",
            "mobileNo", "aadharNo"
        ];

        const capitalizeWords = (str) => str
            .replace(/([A-Z])/g, " $1")
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        requiredFields.forEach(field => {
            if (!formData?.[field]?.toString().trim()) {
                newErrors[field] = `${capitalizeWords(field)} is required.`;
            }
        });

        setErrors(newErrors);
        return newErrors;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        if (!formData) return;

        const newErrors = validate();
        if (Object.keys(newErrors).length) return;

        try {

            const data = new FormData();

            Object.keys(formData).forEach(key => {
                if (key !== "jamathLetter") {
                    data.append(key, formData[key]);
                }
            });

            if (formData.jamathLetter instanceof File) {
                data.append("jamathLetter", formData.jamathLetter);
            }

            data.append("oldRegNo", oldRegNo);

            const res = await axios.post(
                `${apiUrl}/api/manage/appln/updateApplication`,
                data,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.status === 200) {
                alert(res.data.message || "Application updated successfully!");
                onUpdate?.(formData);
                onClose();
                window.location.reload();
            }

        } catch (err) {
            console.error("Update application error:", err);
            alert("Server error while updating application.");
        }
    };

    if (!formData) return null;

    const graduateOptions = ["UG", "PG"].map(v => ({ value: v, label: v }));
    const categoryOptions = [
        { value: 'Aided', label: 'AIDED' },
        { value: 'SFM', label: 'SFM' },
        { value: 'SFW', label: 'SFW' }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full border border-gray-200 dark:border-gray-700 max-w-6xl hide-scrollbar overflow-y-auto max-h-[80vh]">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        ✏️ Edit Application
                    </h1>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold transition" type="button">×</button>
                </div>

                <form onSubmit={handleSubmit} noValidate className="p-6 space-y-7">
                    {/* Personal Info */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">👤 Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Register No" name="registerNo" value={formData.registerNo} onChange={handleChange} required error={errors.registerNo} />
                            <Input label="Name" name="name" value={formData.name} onChange={handleChange} required error={errors.name} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                            <SearchDropdown label="Category" name="category" value={formData.category} options={categoryOptions} onChange={handleSelectChange} required error={errors.category} />
                            <SearchDropdown label="Graduate" name="graduate" value={formData.graduate} options={graduateOptions} onChange={handleSelectChange} required error={errors.graduate} />
                            <SearchDropdown label="Department" name="department" value={formData.department} options={dropdownData.departments} onChange={handleSelectChange} required error={errors.department} />
                            <Input label="Batch (Year of Admission)" name="yearOfAdmission" value={formData.yearOfAdmission} onChange={handleChange} required error={errors.yearOfAdmission} />
                            <SearchDropdown label="Semester" name="semester" value={formData.semester} options={dropdownData.semesters} onChange={handleSelectChange} required error={errors.semester} />
                            <SearchDropdown label="Section" name="section" value={formData.section} options={dropdownData.sections} onChange={handleSelectChange} required error={errors.section} />
                            <SearchDropdown label="Religion" name="religion" value={formData.religion} options={dropdownData.religions} onChange={handleSelectChange} required error={errors.religion} />
                            <Input label="Mobile No" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required error={errors.mobileNo} />
                            <Input label="Aadhar No" name="aadharNo" value={formData.aadharNo} onChange={handleChange} required error={errors.aadharNo} />
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">📊 Performance Metrics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input label="Semester Mark (%)" name="semesterMarkPercentage" type="number" value={formData.semesterMarkPercentage ?? ""} onChange={handleChange} />
                            <Input label="Semester Arrear" name="semesterArrear" type="number" value={formData.semesterArrear ?? ""} onChange={handleChange} />
                            <Input label="Class Attendance (%)" name="classAttendancePercentage" type="number" value={formData.classAttendancePercentage ?? ""} onChange={handleChange} />
                            <Input label="Deeniyath Attendance (%)" name="deeniyathMoralAttendancePercentage" type="number" value={formData.deeniyathMoralAttendancePercentage ?? ""} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50 max-w-md">
                        <label className="text-sm font-semibold text-gray-700">Jamath Letter : </label>
                        {formData.jamathLetter ? (
                            <div className="relative group">
                                {/* Image Container */}
                                <div className="overflow-hidden rounded-md border-2 border-indigo-100 shadow-sm transition-all hover:border-indigo-300">
                                    <img
                                        src={
                                            typeof formData.jamathLetter === "string"
                                                ? `${apiUrl}/${formData.jamathLetter}`
                                                : URL.createObjectURL(formData.jamathLetter)
                                        }
                                        alt="Jamath Letter Preview"
                                        className="w-full h-58"
                                    />
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xs text-gray-500 truncate max-w-[150px]">
                                        {typeof formData.jamathLetter === "string"
                                            ? formData.jamathLetter
                                            : formData.jamathLetter.name}
                                    </span>
                                    <button
                                        onClick={() => setFormData({ ...formData, jamathLetter: null })}
                                        className="text-xs text-red-500 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-48 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-white">
                                <span className="text-gray-400 text-sm">No image selected</span>
                            </div>
                        )}
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full px-4 py-2 bg-white text-indigo-600 rounded-lg shadow-sm border border-indigo-600 cursor-pointer hover:bg-indigo-600 hover:text-white transition-colors duration-300">
                                <span className="text-sm font-medium">
                                    {formData.jamathLetter ? "Change Image" : "Upload Image"}
                                </span>
                                <input
                                    type="file"
                                    name="jamathLetter"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg font-semibold bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition">Cancel</button>
                        <button type="submit" className="px-6 py-2.5 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md transition">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
const Input = ({ label, name, type = "text", value, onChange, error, ...props }) => {

    const handleWheel = (e) => {
        if (type === "number") {
            e.target.blur();
        }
    };

    return (
        <div className="space-y-2">
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                {label} : {props.required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onWheel={handleWheel}
                {...props}
                className={`w-full p-2.5 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none transition ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                    }`}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default ApplnEditModal;