import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchDropdown from "../../common/SearchDropDown";
import "../../App.css";

const apiUrl = import.meta.env.VITE_API_URL;

function ApplnEditModal({ application, onClose, onUpdate }) {

    const [formData, setFormData] = useState({ ...application });
    const [errors, setErrors] = useState({});
    
    useEffect(() => {
        setFormData({ ...application });
    }, [application]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (name, option) => {
        setFormData(prev => ({ ...prev, [name]: option ? option.value : "" }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.registerNo?.trim()) newErrors.registerNo = "Register No required";
        if (!formData.name?.trim()) newErrors.name = "Name required";
        if (!formData.department) newErrors.department = "Department required";
        if (!formData.yearOfAdmission) newErrors.yearOfAdmission = "Batch required";
        setErrors(newErrors);
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                alert(res.data.message || "Application updated");
                onUpdate?.(formData);
                onClose();
            }
        } catch (err) {
            console.error("Update application error:", err);
            alert(err?.response?.data?.message || "Server error updating application");
        }
    };

    const graduateOptions = ["UG", "PG"].map(v => ({ value: v, label: v }));
    const sclrTypeOptions = ["Fresher", "Renewal"].map(v => ({ value: v, label: v }));
    const categoryOptions = ["General", "OBC", "SC", "ST"].map(v => ({ value: v, label: v }));
    const statusOptions = [
        { value: 0, label: "Pending" },
        { value: 1, label: "Approved" },
        { value: 2, label: "Rejected" },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full border border-gray-200 dark:border-gray-700 max-w-6xl hide-scrollbar overflow-y-auto max-h-[80vh]">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">✏️ Edit Application</h1>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 text-xl font-bold">×</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input label="Register No" name="registerNo" value={formData.registerNo || ""} onChange={handleChange} error={errors.registerNo} required />
                        <Input label="Name" name="name" value={formData.name || ""} onChange={handleChange} error={errors.name} required />
                        <Input label="Religion" name="religion" value={formData.religion || ""} onChange={handleChange} />
                        <SearchDropdown label="Graduate" name="graduate" value={formData.graduate || ""} options={graduateOptions} onChange={handleSelectChange} />
                        <Input label="Department" name="department" value={formData.department || ""} onChange={handleChange} error={errors.department} required />
                        <Input label="Batch (Year of Admission)" name="yearOfAdmission" value={formData.yearOfAdmission || ""} onChange={handleChange} error={errors.yearOfAdmission} required />
                        <Input label="Semester" name="semester" value={formData.semester || ""} onChange={handleChange} />
                        <SearchDropdown label="Scholarship Type" name="sclrType" value={formData.sclrType || ""} options={sclrTypeOptions} onChange={handleSelectChange} />
                        <Input label="Category" name="category" value={formData.category || ""} onChange={handleChange} />
                        <Input label="Special Category" name="specialCategory" value={formData.specialCategory || ""} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input label="Class Attendance (%)" name="classAttendancePercentage" type="number" value={formData.classAttendancePercentage ?? ""} onChange={handleChange} />
                        <Input label="Deeniyath Attendance (%)" name="deeniyathMoralAttendancePercentage" type="number" value={formData.deeniyathMoralAttendancePercentage ?? ""} onChange={handleChange} />
                        <Input label="Semester Mark (%)" name="semesterMarkPercentage" type="number" value={formData.semesterMarkPercentage ?? ""} onChange={handleChange} />
                        <Input label="Semester Arrear" name="semesterArrear" type="number" value={formData.semesterArrear ?? ""} onChange={handleChange} />
                        <Input label="Semester Grade" name="semesterGrade" value={formData.semesterGrade || ""} onChange={handleChange} />
                        <SearchDropdown label="Application Status" name="applicationStatus" value={formData.applicationStatus ?? 0} options={statusOptions} onChange={handleSelectChange} />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <label className="font-semibold text-gray-700 dark:text-gray-200">Rejection Reasons</label>
                        <textarea name="rejectionReasons" value={(formData.rejectionReasons && formData.rejectionReasons.join?.(", ")) || (Array.isArray(formData.rejectionReasons) ? formData.rejectionReasons.join(", ") : formData.rejectionReasons || "")} onChange={(e) => setFormData(prev => ({ ...prev, rejectionReasons: e.target.value.split(",").map(s => s.trim()) }))} className="w-full p-2.5 border rounded-lg" />
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg font-semibold bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition">Cancel</button>
                        <button type="submit" className="px-6 py-2.5 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const Input = ({ label, name, type = "text", value, onChange, error, ...props }) => (
    <div className="space-y-2">
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            {label} {props.required && <span className="text-red-500">*</span>}
        </label>
        <input name={name} type={type} value={value} onChange={onChange} {...props} className={`w-full p-2.5 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none transition ${error ? "border-red-500" : "border-gray-300"}`} />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

export default ApplnEditModal;