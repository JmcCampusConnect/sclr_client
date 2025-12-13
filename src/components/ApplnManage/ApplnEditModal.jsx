import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchDropdown from "../../common/SearchDropDown";
import "../../App.css";
const apiUrl = import.meta.env.VITE_API_URL;

function ApplnEditModal({ application, onClose, onUpdate }) {

    const [formData, setFormData] = useState(null);
    const [errors, setErrors] = useState({});
    const [oldRegNo, setOldRegNo] = useState('');
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
            { value: "VI", label: "VI" }
        ],
        sections: ["A", "B", "C", "D", "E", "F", "G", "H", "I"].map(v => ({
            value: v, label: v
        })),
        religions: ["Muslim", "Hindu", "Christian", "Others"].map(v => ({
            value: v, label: v
        }))
    });

    useEffect(() => {
        setFormData(application ? JSON.parse(JSON.stringify(application)) : null);
        setOldRegNo(formData?.registerNo);
        setErrors({});
    }, [application]);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/common/fetchDropdownData`);
                setDropdownData(prev => ({
                    ...prev,
                    categories: [
                        { value: "All", label: "All" },
                        ...res.data.categories.map(c => ({
                            value: c, label: c.toUpperCase()
                        }))
                    ],
                    departments: [
                        { value: "All", label: "All" },
                        ...res.data.departments.map(d => ({
                            value: d.department,
                            label: `${d.department} - ${d.departmentName}`
                        }))
                    ],
                    batches: [
                        { value: "All", label: "All" },
                        ...res.data.batches.map(b => ({
                            value: b, label: b
                        }))
                    ]
                }));
            } catch (err) {
                console.error("Dropdown fetch error:", err);
            }
        };
        fetchDropdownData();
    }, []);

    const setByPath = (prev, path, value) => {
        if (!path.includes(".")) return { ...prev, [path]: value };
        const parts = path.split(".");
        const key = parts[0];
        const rest = parts.slice(1).join(".");
        return {
            ...prev,
            [key]: setNested(prev[key] ?? {}, rest, value),
        };
    };

    const setNested = (obj, path, value) => {
        const parts = path.split(".");
        if (parts.length === 1) return { ...obj, [parts[0]]: value };
        const [head, ...tail] = parts;
        return { ...obj, [head]: setNested(obj[head] ?? {}, tail.join("."), value) };
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const v = type === "number" ? (value === "" ? "" : Number(value)) : value;
        setFormData((prev) => setByPath(prev, name, v));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (name, option) => {
        setFormData((prev) => setByPath(prev, name, option ? option.value : ""));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData?.registerNo?.toString().trim()) newErrors.registerNo = "Register No is required.";
        if (!formData?.name?.toString().trim()) newErrors.name = "Name is required.";
        if (!formData?.department?.toString().trim()) newErrors.department = "Department is required.";
        if (!formData?.yearOfAdmission?.toString().trim()) newErrors.yearOfAdmission = "Batch is required.";
        setErrors(newErrors);
        return newErrors;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        if (!formData) return;
        const newErrors = validate();
        if (Object.keys(newErrors).length) {
            const first = Object.keys(newErrors)[0];
            const el = document.querySelector(`[name="${first}"]`);
            if (el) el.focus();
            return;
        }
        try {
            const res = await axios.post(`${apiUrl}/api/manage/appln/updateApplication`, formData);
            if (res.status === 200) {
                alert(res.data.message || "Application updated successfully!");
                onUpdate?.(formData);
                onClose();
            }
        } catch (err) {
            console.error("Update application error:", err);
            const status = err?.response?.status;
            const msg = err?.response?.data?.message;
            if (status === 401) alert(msg || "Unauthorized request.");
            else if (status === 404) alert(msg || "Application not found.");
            else alert("Server error while updating application.");
        }
    };

    const graduateOptions = ["UG", "PG"].map((v) => ({ value: v, label: v }));

    const categoryOptions = [
        { value: 'Aided', label: 'AIDED' },
        { value: 'SFM', label: 'SFM' },
        { value: 'SFW', label: 'SFW' }
    ]

    if (!formData) return null;

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
                    {/* Personal Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">👤 Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Register No" name="registerNo" value={formData.registerNo ?? ""} onChange={handleChange} required error={errors.registerNo} />
                            <Input label="Name" name="name" value={formData.name ?? ""} onChange={handleChange} required error={errors.name} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                            <SearchDropdown label="Category" name="category" value={formData.category} options={categoryOptions} onChange={handleSelectChange} />
                            <SearchDropdown label="Graduate" name="graduate" value={formData.graduate} options={graduateOptions} onChange={handleSelectChange} />
                            <SearchDropdown
                                label="Department"
                                name="department"
                                value={formData.department}
                                options={dropdownData.departments}
                                onChange={handleSelectChange}
                            />
                            <Input label="Batch (Year of Admission)" name="yearOfAdmission" value={formData.yearOfAdmission ?? ""} onChange={handleChange} required error={errors.yearOfAdmission} />
                            <SearchDropdown
                                label="Semester"
                                name="semester"
                                value={formData.semester}
                                options={dropdownData.semesters}
                                onChange={handleSelectChange}
                            />
                            <SearchDropdown
                                label="Section"
                                name="section"
                                value={formData.section}
                                options={dropdownData.sections}
                                onChange={handleSelectChange}
                            />
                            <SearchDropdown
                                label="Religion"
                                name="religion"
                                value={formData.religion}
                                options={dropdownData.religions}
                                onChange={handleSelectChange}
                            />
                            <Input label="Mobile No" name="mobileNo" value={formData.mobileNo ?? ""} onChange={handleChange} />
                            <Input label="Aadhar No" name="aadharNo" value={formData.aadharNo ?? ""} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">📊 Performance Metrics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input label="Semester Mark (%)" name="semesterMarkPercentage" type="number" value={formData.semesterMarkPercentage ?? ""} onChange={handleChange} />
                            <Input label="Semester Grade" name="semesterGrade" value={formData.semesterGrade ?? ""} onChange={handleChange} />
                            <Input label="Semester Arrear" name="semesterArrear" type="number" value={formData.semesterArrear ?? ""} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <Input label="Class Attendance (%)" name="classAttendancePercentage" type="number" value={formData.classAttendancePercentage ?? ""} onChange={handleChange} />
                            <Input label="Class Attendance Remark" name="classAttendanceRemark" value={formData.classAttendanceRemark ?? ""} onChange={handleChange} />
                            <Input label="Deeniyath Attendance (%)" name="deeniyathMoralAttendancePercentage" type="number" value={formData.deeniyathMoralAttendancePercentage ?? ""} onChange={handleChange} />
                            <Input label="Deeniyath Remark" name="deeniyathMoralRemark" value={formData.deeniyathMoralRemark ?? ""} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg font-semibold bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition">Cancel</button>
                        <button type="submit" className="px-6 py-2.5 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md transition">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const Input = ({ label, name, type = "text", value, onChange, error, ...props }) => (
    <div className="space-y-2">
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">{label} : {props.required && <span className="text-red-500">*</span>}</label>
        <input type={type} name={name} value={value} onChange={onChange} {...props} className={`w-full p-2.5 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none transition ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`} />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

export default ApplnEditModal;