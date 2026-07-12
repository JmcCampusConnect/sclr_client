import React, { useState, useEffect, useMemo, useCallback } from "react";
import SearchDropdown from "../../common/SearchDropDown";
import axios from 'axios';

function ApplnEditModal({ application, onClose, onUpdate, isLoading: externalLoading }) {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [formData, setFormData] = useState({
        semester: '',
        specialCategory: '',
        jamathLetter: '',
        classAttendancePercentage: '',
        classAttendanceRemark: '',
        deeniyathMoralAttendancePercentage: '',
        deeniyathMoralRemark: '',
        semesterMarkPercentage: '',
        semesterArrear: '',
        tutorVerification: '',
        applicationStatus: '',
        orphanOrSingleParent: false,
        hazrathOrMuaddin: false,
        eligibleForZakkath: false,
        needyButNotZakkath: false,
        remarks: '',
        verifiedBy: '',
        verifiedAt: '',
    });
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showTutorVerification, setShowTutorVerification] = useState(false);

    // Options for dropdowns
    const semesterOptions = useMemo(() => [
        { value: "I", label: "I" },
        { value: "II", label: "II" },
        { value: "III", label: "III" },
        { value: "IV", label: "IV" },
        { value: "V", label: "V" },
        { value: "VI", label: "VI" }
    ], []);

    const verificationOptions = useMemo(() => [
        { value: "0", label: "Not Verified" },
        { value: "1", label: "Verified" }
    ], []);

    const statusOptions = useMemo(() => [
        { value: "0", label: "Pending" },
        { value: "1", label: "Accepted" },
        { value: "2", label: "Rejected" }
    ], []);

    const specialCategoryOptions = useMemo(() => [
        { value: "General", label: "General" },
        { value: "Mu-addin", label: "Mu-addin" },
        { value: "Hazrath", label: "Hazrath" },
        { value: "Father Mother Separated", label: "Father Mother Separated" },
        { value: "Father Expired", label: "Father Expired" },
        { value: "Single Parent", label: "Single Parent" },
        { value: "Orphan", label: "Orphan" }
    ], []);

    // Custom Input Component (mimics InputBox without react-hook-form)
    const CustomInput = ({ name, label, required = false, type = 'text', placeholder, value, onChange, readOnly = false, error, step, min, max }) => {

        const [showPassword, setShowPassword] = useState(false);

        const handleUppercase = (e) => {
            if (type !== 'password') {
                e.target.value = e.target.value.toUpperCase();
                onChange(e);
            }
        };

        const handleWheel = (e) => {
            e.preventDefault();
            e.target.blur();
        };

        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                        {label} : {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <div className="relative">
                    <input
                        name={name}
                        type={type === 'password' && showPassword ? 'text' : type}
                        placeholder={placeholder}
                        value={value || ''}
                        onChange={onChange}
                        onInput={handleUppercase}
                        onWheel={type === 'number' ? handleWheel : undefined}
                        readOnly={readOnly}
                        step={step}
                        min={min}
                        max={max}
                        className={`w-full p-2 pr-10 border rounded-md transition
                        ${readOnly ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
                        ${error
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-300'
                                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-300'}
                        focus:outline-none focus:ring-1 text-gray-900 dark:text-white`
                        }
                    />

                    {type === 'password' && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            tabIndex={-1}
                        >
                            {showPassword ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            }
                        </button>
                    )}
                </div>

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}
            </div>
        );
    };

    // Radio Button Component for Yes/No questions
    const RadioGroup = ({ name, label, value, onChange, disabled = false }) => {
        return (
            <div className="space-y-2">
                <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
                <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name={name}
                            value="yes"
                            checked={value === true}
                            onChange={() => onChange({ target: { name, value: true } })}
                            disabled={disabled}
                            className={`w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
                        />
                        <span className={`text-sm ${disabled ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            Yes
                        </span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name={name}
                            value="no"
                            checked={value === false}
                            onChange={() => onChange({ target: { name, value: false } })}
                            disabled={disabled}
                            className={`w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
                        />
                        <span className={`text-sm ${disabled ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            No
                        </span>
                    </label>
                </div>
            </div>
        );
    };

    // Read-only display component for status fields
    const ReadOnlyField = ({ label, value }) => (
        <div className="space-y-2">
            <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <div className="relative">
                <div className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 cursor-not-allowed text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                    {value || '-'}
                </div>
            </div>
        </div>
    );

    // Helper function to safely convert values to strings
    const safeString = (value) => {
        if (value === null || value === undefined) return '';
        return String(value);
    };

    // Helper function to get status label
    const getStatusLabel = (value, options) => {
        const option = options.find(opt => opt.value === safeString(value));
        return option ? option.label : value || '-';
    };

    // Initialize form with application data
    useEffect(() => {
        if (application) {
            const newFormData = {
                semester: safeString(application.semester),
                specialCategory: safeString(application.specialCategory),
                jamathLetter: safeString(application.jamathLetter),
                classAttendancePercentage: safeString(application.classAttendancePercentage),
                classAttendanceRemark: safeString(application.classAttendanceRemark),
                deeniyathMoralAttendancePercentage: safeString(application.deeniyathMoralAttendancePercentage),
                deeniyathMoralRemark: safeString(application.deeniyathMoralRemark),
                semesterMarkPercentage: safeString(application.semesterMarkPercentage),
                semesterArrear: safeString(application.semesterArrear),
                tutorVerification: safeString(application.tutorVerification),
                applicationStatus: safeString(application.applicationStatus),
                orphanOrSingleParent: false,
                hazrathOrMuaddin: false,
                eligibleForZakkath: false,
                needyButNotZakkath: false,
                remarks: '',
                verifiedBy: '',
                verifiedAt: '',
            };

            // Set tutor verification details
            if (application.tutorVerificationDetails) {
                const tv = application.tutorVerificationDetails;
                newFormData.orphanOrSingleParent = tv.orphanOrSingleParent || false;
                newFormData.hazrathOrMuaddin = tv.hazrathOrMuaddin || false;
                newFormData.eligibleForZakkath = tv.eligibleForZakkath || false;
                newFormData.needyButNotZakkath = tv.needyButNotZakkath || false;
                newFormData.remarks = tv.remarks || '';
                newFormData.verifiedBy = tv.verifiedBy || '';
                newFormData.verifiedAt = tv.verifiedAt || '';
            }

            setFormData(newFormData);

            // Set show tutor verification based on tutorVerification value
            setShowTutorVerification(newFormData.tutorVerification === '1');

            // Set file name
            if (application.jamathLetter) {
                const fileName = application.jamathLetter.split('/').pop().split('\\').pop();
                setFileName(fileName);
            }
        }
    }, [application]);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }, []);

    const handleSelectChange = useCallback((name, option) => {
        if (option) {
            setFormData(prev => ({
                ...prev,
                [name]: option.value
            }));

            if (name === 'tutorVerification') {
                setShowTutorVerification(option.value === '1');
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: ''
            }));

            if (name === 'tutorVerification') {
                setShowTutorVerification(false);
            }
        }
    }, []);

    const handleFileChange = useCallback((e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setFormData(prev => ({
                ...prev,
                jamathLetter: selectedFile.name
            }));
        }
    }, []);

    const handleSubmit = useCallback(async (e) => {

        e.preventDefault();
        setLoading(true);
        setError(null);

        try {

            const formDataToSend = new FormData();
            formDataToSend.append('applicationId', application.applicationId);
            formDataToSend.append('oldRegNo', application.registerNo);

            const fields = [
                'semester', 'specialCategory',
                'classAttendancePercentage', 'classAttendanceRemark',
                'deeniyathMoralAttendancePercentage', 'deeniyathMoralRemark',
                'semesterMarkPercentage', 'semesterArrear',
                'tutorVerification', 'applicationStatus'
            ];

            fields.forEach(field => {
                if (formData[field] !== undefined && formData[field] !== null && formData[field] !== '') {
                    formDataToSend.append(field, formData[field]);
                }
            });

            const tutorVerificationDetails = {
                orphanOrSingleParent: formData.orphanOrSingleParent || false,
                hazrathOrMuaddin: formData.hazrathOrMuaddin || false,
                eligibleForZakkath: formData.eligibleForZakkath || false,
                needyButNotZakkath: formData.needyButNotZakkath || false,
                remarks: formData.remarks || '',
                verifiedBy: formData.verifiedBy || '',
                verifiedAt: formData.verifiedAt || '',
            };

            formDataToSend.append('tutorVerificationDetails', JSON.stringify(tutorVerificationDetails));

            if (file) {
                formDataToSend.append('jamathLetterFile', file);
            }

            const response = await axios.put(
                `${apiUrl}/api/manage/appln/updateApplication`,
                formDataToSend
            );

            if (response.status === 200) {
                const updatedApplication = response.data.updatedApplication;
                const updatedData = {
                    ...application,
                    ...updatedApplication,
                    applicationId: application.applicationId,
                    tutorVerificationDetails: tutorVerificationDetails,
                };

                onUpdate(updatedData);
                onClose();
            }
        } catch (err) {
            console.error('Update error:', err);
            setError(err.response?.data?.message || 'Failed to update application');
        } finally {
            setLoading(false);
        }
    }, [apiUrl, application, file, formData, onUpdate, onClose]);

    // Read-only student information display
    const StudentInfoRow = ({ label, value }) => (
        <div className="space-y-2">
            {label && (
                <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <div className="relative">
                <div
                    className={`w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 cursor-not-allowed text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none`}
                >
                    {value || '-'}
                </div>
            </div>
        </div>
    );

    if (!application) return null;

    // Get the full URL for the jamath letter
    const getJamathLetterUrl = () => {
        if (application.jamathLetter) {
            if (application.jamathLetter.startsWith('http')) {
                return application.jamathLetter;
            }
            const fileName = application.jamathLetter.split('/').pop().split('\\').pop();
            return `${apiUrl}/zamathfiles/${fileName}`;
        }
        return null;
    };

    const jamathLetterUrl = getJamathLetterUrl();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full border border-gray-200 dark:border-gray-700 max-w-6xl hide-scrollbar overflow-y-auto max-h-[80vh]">

                {/* Modal Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        ✏️ Edit Application
                    </h1>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold transition"
                        type="button"
                    >
                        ×
                    </button>
                </div>

                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="p-6 space-y-7">

                    {/* Student Information - Read-only */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            👤 Student Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StudentInfoRow label="Register No" value={application.registerNo} />
                            <StudentInfoRow label="Name" value={application.name} />
                            <StudentInfoRow label="Graduate" value={application.graduate} />
                            <StudentInfoRow label="Category" value={application.category} />
                            <StudentInfoRow label="Department" value={application.department} />
                            <StudentInfoRow label="Section" value={application.section} />
                        </div>
                    </div>

                    {/* Application Details - Editable */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            📋 Application Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SearchDropdown
                                label="Semester"
                                name="semester"
                                value={formData.semester || ''}
                                options={semesterOptions}
                                onChange={handleSelectChange}
                            />
                            <SearchDropdown
                                label="Special Category"
                                name="specialCategory"
                                value={formData.specialCategory || ''}
                                options={specialCategoryOptions}
                                onChange={handleSelectChange}
                            />
                            <CustomInput
                                name="classAttendancePercentage"
                                label="Class Attendance %"
                                type="number"
                                value={formData.classAttendancePercentage || ''}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                max="100"
                                placeholder="0-100"
                            />
                            <CustomInput
                                name="classAttendanceRemark"
                                label="Class Attendance Remark"
                                type="text"
                                value={formData.classAttendanceRemark || ''}
                                onChange={handleChange}
                                placeholder="Enter remark"
                            />
                            <CustomInput
                                name="deeniyathMoralAttendancePercentage"
                                label="Deeniyath/Moral Attendance %"
                                type="number"
                                value={formData.deeniyathMoralAttendancePercentage || ''}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                max="100"
                                placeholder="0-100"
                            />
                            <CustomInput
                                name="deeniyathMoralRemark"
                                label="Deeniyath/Moral Remark"
                                type="text"
                                value={formData.deeniyathMoralRemark || ''}
                                onChange={handleChange}
                                placeholder="Enter remark"
                            />
                            <CustomInput
                                name="semesterMarkPercentage"
                                label="Semester Mark %"
                                type="number"
                                value={formData.semesterMarkPercentage || ''}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                max="100"
                                placeholder="0-100"
                            />
                            <CustomInput
                                name="semesterArrear"
                                label="Semester Arrear"
                                type="number"
                                value={formData.semesterArrear || ''}
                                onChange={handleChange}
                                placeholder="Number of arrears"
                            />

                            {/* Read-only status fields */}
                            <ReadOnlyField
                                label="Tutor Verification"
                                value={getStatusLabel(formData.tutorVerification, verificationOptions)}
                            />
                            <ReadOnlyField
                                label="Application Status"
                                value={getStatusLabel(formData.applicationStatus, statusOptions)}
                            />
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            🗂️ Document Upload
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Jamath Letter
                                </label>

                                {/* Display current file with view link */}
                                {jamathLetterUrl && (
                                    <div className="mb-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Current file :
                                            <span className="font-medium ml-1">{fileName}</span>
                                        </p>
                                        <a
                                            href={jamathLetterUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View Current Document
                                        </a>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="flex-1 p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-200"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <p className="text-xs text-gray-400">
                                    Upload PDF, DOC, DOCX, JPG, or PNG (max 5MB). Leave empty to keep existing file.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tutor Verification Details - Show only if tutorVerification is Yes/Verified */}
                    {showTutorVerification && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                                🛡️ Tutor Verification Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Radio buttons for verification questions */}
                                <RadioGroup
                                    name="orphanOrSingleParent"
                                    label="Is the student an orphan or from a single parent family?"
                                    value={formData.orphanOrSingleParent}
                                    onChange={handleChange}
                                />
                                <RadioGroup
                                    name="hazrathOrMuaddin"
                                    label="Is the student a Hazrath or Muaddin?"
                                    value={formData.hazrathOrMuaddin}
                                    onChange={handleChange}
                                />
                                <RadioGroup
                                    name="eligibleForZakkath"
                                    label="Is the student eligible for Zakkath?"
                                    value={formData.eligibleForZakkath}
                                    onChange={handleChange}
                                />
                                <RadioGroup
                                    name="needyButNotZakkath"
                                    label="Is the student needy but not eligible for Zakkath?"
                                    value={formData.needyButNotZakkath}
                                    onChange={handleChange}
                                />

                                {/* Remarks field - full width */}
                                <div className="md:col-span-2">
                                    <CustomInput
                                        name="remarks"
                                        label="Remarks"
                                        type="text"
                                        value={formData.remarks || ''}
                                        onChange={handleChange}
                                        placeholder="Enter remarks"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal Actions Footer */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-900 p-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg font-semibold bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || externalLoading}
                            className="px-6 py-2.5 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {(loading || externalLoading) ? 'Updating...' : 'Update Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ApplnEditModal;