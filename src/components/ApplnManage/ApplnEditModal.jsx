// ...existing code...
import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchDropdown from "../../common/SearchDropDown";
import "../../App.css";

const apiUrl = import.meta.env.VITE_API_URL;

function ApplnEditModal({ application, onClose, onUpdate }) {

    const [formData, setFormData] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData(application ? JSON.parse(JSON.stringify(application)) : null);
        setErrors({});
    }, [application]);

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

    const handleCheckboxChange = (path, checked) => {
        setFormData((prev) => setByPath(prev, path, checked));
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
    const sclrTypeOptions = ["Fresher", "Renewal"].map((v) => ({ value: v, label: v }));

    const yesNoOptions = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ];
    const tutorVerificationOptions = [
        { value: 0, label: "Not Verified" },
        { value: 1, label: "Verified" },
    ];
    const govScholarshipOptions = [
        { value: 0, label: "No" },
        { value: 1, label: "Yes" },
    ];

    const getSelectValue = (name, options) => {
        if (!formData) return null;
        const v = formData[name];
        if (v === null || v === undefined || v === "") return null;
        // THIS RETURNS THE FULL OPTION OBJECT { value: 'UG', label: 'UG' }
        return options.find((o) => {
            // ... comparison logic
            return String(o.value) === String(v);
        }) || null;
    };

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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input label="Register No" name="registerNo" value={formData.registerNo ?? ""} onChange={handleChange} required error={errors.registerNo} />
                            <Input label="Name" name="name" value={formData.name ?? ""} onChange={handleChange} required error={errors.name} />
                            <Input label="Religion" name="religion" value={formData.religion ?? ""} onChange={handleChange} />
                            <SearchDropdown label="Graduate" name="graduate" value={getSelectValue("graduate", graduateOptions)} options={graduateOptions} onChange={handleSelectChange} />
                            <SearchDropdown label="Scholarship Type" name="sclrType" value={getSelectValue("sclrType", sclrTypeOptions)} options={sclrTypeOptions} onChange={handleSelectChange} />
                            <Input label="Category" name="category" value={formData.category ?? ""} onChange={handleChange} />
                            <Input label="Special Category" name="specialCategory" value={formData.specialCategory ?? ""} onChange={handleChange} />
                            <Input label="Mobile No" name="mobileNo" value={formData.mobileNo ?? ""} onChange={handleChange} />
                            <Input label="Aadhar No" name="aadharNo" value={formData.aadharNo ?? ""} onChange={handleChange} />
                            <Input label="Section" name="section" value={formData.section ?? ""} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">📚 Academic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input label="Department" name="department" value={formData.department ?? ""} onChange={handleChange} required error={errors.department} />
                            <Input label="Batch (Year of Admission)" name="yearOfAdmission" value={formData.yearOfAdmission ?? ""} onChange={handleChange} required error={errors.yearOfAdmission} />
                            <Input label="Semester" name="semester" value={formData.semester ?? ""} onChange={handleChange} />
                            <Input label="Semester Grade" name="semesterGrade" value={formData.semesterGrade ?? ""} onChange={handleChange} />
                            <Input label="Semester Arrear" name="semesterArrear" type="number" value={formData.semesterArrear ?? ""} onChange={handleChange} />
                            <Input label="Semester Mark (%)" name="semesterMarkPercentage" type="number" value={formData.semesterMarkPercentage ?? ""} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">📊 Performance Metrics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input label="Last Studied Institution (%)" name="lastStudiedInstitutionPercentage" type="number" value={formData.lastStudiedInstitutionPercentage ?? ""} onChange={handleChange} />
                            <Input label="Class Attendance (%)" name="classAttendancePercentage" type="number" value={formData.classAttendancePercentage ?? ""} onChange={handleChange} />
                            <Input label="Class Attendance Remark" name="classAttendanceRemark" value={formData.classAttendanceRemark ?? ""} onChange={handleChange} />
                            <Input label="Deeniyath Attendance (%)" name="deeniyathMoralAttendancePercentage" type="number" value={formData.deeniyathMoralAttendancePercentage ?? ""} onChange={handleChange} />
                            <Input label="Deeniyath Remark" name="deeniyathMoralRemark" value={formData.deeniyathMoralRemark ?? ""} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Address & Contact - single-row address */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">🏠 Address & Contact</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                            <Input label="Address" name="address" value={formData.address ?? ""} onChange={handleChange} />
                            <Input label="District" name="district" value={formData.district ?? ""} onChange={handleChange} />
                            <Input label="State" name="state" value={formData.state ?? ""} onChange={handleChange} />
                            <Input label="Pin Code" name="pinCode" value={formData.pinCode ?? ""} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Parent / Financial */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">💳 Parent / Financial</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input label="Parent Name" name="parentName" value={formData.parentName ?? ""} onChange={handleChange} />
                            <Input label="Parent No" name="parentNo" value={formData.parentNo ?? ""} onChange={handleChange} />
                            <Input label="Parent Occupation" name="parentOccupation" value={formData.parentOccupation ?? ""} onChange={handleChange} />
                            <Input label="Parent Annual Income" name="parentAnnualIncome" type="number" value={formData.parentAnnualIncome ?? ""} onChange={handleChange} />
                            <SearchDropdown label="Government Scholarship" name="governmentScholarship" value={getSelectValue("governmentScholarship", govScholarshipOptions)} options={govScholarshipOptions} onChange={handleSelectChange} />
                        </div>
                    </div>

                    {/* Siblings / Hostel */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">👨‍👩‍👧‍👦 Siblings & Hostel</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <SearchDropdown label="Siblings Status" name="siblingsStatus" value={getSelectValue("siblingsStatus", yesNoOptions)} options={yesNoOptions} onChange={handleSelectChange} />
                            <Input label="Siblings Count" name="siblingsCount" type="number" value={formData.siblingsCount ?? ""} onChange={handleChange} />
                            <Input label="Siblings Occupation" name="siblingsOccupation" value={formData.siblingsOccupation ?? ""} onChange={handleChange} />
                            <Input label="Siblings Income" name="siblingsIncome" type="number" value={formData.siblingsIncome ?? ""} onChange={handleChange} />
                            <SearchDropdown label="Hostel Status" name="hostelStatus" value={getSelectValue("hostelStatus", yesNoOptions)} options={yesNoOptions} onChange={handleSelectChange} />
                            <Input label="Is Semester Based" name="isSemBased" type="number" value={formData.isSemBased ?? ""} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Tutor Verification */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">🧾 Tutor Verification</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <SearchDropdown label="Tutor Verification Status" name="tutorVerification" value={getSelectValue("tutorVerification", tutorVerificationOptions)} options={tutorVerificationOptions} onChange={handleSelectChange} />
                            <Input label="Verified By" name="tutorVerificationDetails.verifiedBy" value={formData.tutorVerificationDetails?.verifiedBy ?? ""} onChange={handleChange} />
                            <Input
                                label="Verified At"
                                name="tutorVerificationDetails.verifiedAt"
                                type="datetime-local"
                                value={formData.tutorVerificationDetails?.verifiedAt ? new Date(formData.tutorVerificationDetails.verifiedAt).toISOString().slice(0, 16) : ""}
                                onChange={(e) => {
                                    const v = e.target.value ? new Date(e.target.value).toISOString() : null;
                                    setFormData((prev) => setByPath(prev, "tutorVerificationDetails.verifiedAt", v));
                                }}
                            />
                            <Input label="Tutor Remarks" name="tutorVerificationDetails.remarks" value={formData.tutorVerificationDetails?.remarks ?? ""} onChange={handleChange} />
                            <div className="col-span-1 md:col-span-3">
                                <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">Verification Flags</label>
                                <div className="flex gap-4 flex-wrap">
                                    <label className="inline-flex items-center gap-2">
                                        <input type="checkbox" checked={!!formData.tutorVerificationDetails?.orphanOrSingleParent} onChange={(e) => handleCheckboxChange("tutorVerificationDetails.orphanOrSingleParent", e.target.checked)} />
                                        Orphan / Single Parent
                                    </label>
                                    <label className="inline-flex items-center gap-2">
                                        <input type="checkbox" checked={!!formData.tutorVerificationDetails?.hazrathOrMuaddin} onChange={(e) => handleCheckboxChange("tutorVerificationDetails.hazrathOrMuaddin", e.target.checked)} />
                                        Hazrath / Muaddin
                                    </label>
                                    <label className="inline-flex items-center gap-2">
                                        <input type="checkbox" checked={!!formData.tutorVerificationDetails?.eligibleForZakkath} onChange={(e) => handleCheckboxChange("tutorVerificationDetails.eligibleForZakkath", e.target.checked)} />
                                        Eligible for Zakkath
                                    </label>
                                    <label className="inline-flex items-center gap-2">
                                        <input type="checkbox" checked={!!formData.tutorVerificationDetails?.needyButNotZakkath} onChange={(e) => handleCheckboxChange("tutorVerificationDetails.needyButNotZakkath", e.target.checked)} />
                                        Needy but not Zakkath
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rejection Reasons & Attachments */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">📝 Rejection Reasons & Attachments</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <Input label="Rejection Reasons (comma separated)" name="rejectionReasons" value={Array.isArray(formData.rejectionReasons) ? formData.rejectionReasons.join(", ") : formData.rejectionReasons ?? ""} onChange={(e) => { const v = e.target.value ? e.target.value.split(",").map(s => s.trim()) : []; setFormData(prev => ({ ...prev, rejectionReasons: v })); }} />
                            {formData.jamathLetter ? (
                                <div>
                                    <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">Jamath Letter</label>
                                    <a href={`${apiUrl}/${formData.jamathLetter}`} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline">View attachment</a>
                                </div>
                            ) : null}
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
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">{label} {props.required && <span className="text-red-500">*</span>}</label>
        <input type={type} name={name} value={value} onChange={onChange} {...props} className={`w-full p-2.5 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none transition ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`} />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

export default ApplnEditModal;