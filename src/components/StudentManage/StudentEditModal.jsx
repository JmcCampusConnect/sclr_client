import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from 'react-hook-form';

import InputBox from "../../common/InputBox";
import SearchDropdown from "../../common/SearchDropDown";

function StudentEditModal({ student, onClose, onSave, isLoading, departments }) {

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            registerNo: '',
            name: '',
            password: '',
            religion: '',
            yearOfAdmission: '',
            graduate: 'UG',
            department: '',
            section: '',
            category: '',
            mobileNo: '',
            aadharNo: '',
            address: '',
            district: '',
            state: '',
            pinCode: '',
            parentName: '',
            parentNo: '',
            parentOccupation: '',
            parentAnnualIncome: '',
            siblingsStatus: 'No',
            siblingsCount: '',
            siblingsOccupation: '',
            siblingsIncome: '',
            hostelStatus: 'No',
            governmentScholarship: 0,
            isSemBased: 0,
            totalCreditedAmount: 0,
        }
    });

    // Options for dropdowns
    const categoryOptions = useMemo(() => [
        { value: "Aided", label: "AIDED" },
        { value: "SFM", label: "SFM" },
        { value: "SFW", label: "SFW" },
    ], []);

    const graduateOptions = useMemo(() => [
        { value: "UG", label: "UG" },
        { value: "PG", label: "PG" },
    ], []);

    const sectionOptions = useMemo(() => [
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "C", label: "C" },
    ], []);

    const religionOptions = useMemo(() => [
        { value: "Islam", label: "Islam" },
        { value: "Christianity", label: "Christianity" },
        { value: "Hinduism", label: "Hinduism" },
    ], []);

    const semesterOptions = useMemo(() => {
        const semesters = [];
        for (let i = 1; i <= 8; i++) {
            semesters.push({ value: i.toString(), label: `Semester ${i}` });
        }
        return semesters;
    }, []);

    const departmentOptions = useMemo(() => {
        if (!departments || !Array.isArray(departments)) return [];
        return departments.map(item => ({
            value: item.department,
            label: `${item.department} - ${item.departmentName}`
        }));
    }, [departments]);

    const siblingOptions = useMemo(() => [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" }
    ], []);

    const hostelOptions = useMemo(() => [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" }
    ], []);

    const scholarshipOptions = useMemo(() => [
        { value: "0", label: "None" },
        { value: "1", label: "Partial" },
        { value: "2", label: "Full" }
    ], []);

    const semBasedOptions = useMemo(() => [
        { value: "0", label: "No" },
        { value: "1", label: "Yes" }
    ], []);

    // Initialize form data
    useEffect(() => {
        if (student) {
            Object.keys(student).forEach(key => {
                if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
                    setValue(key, student[key] ?? '');
                }
            });
        }
    }, [student, setValue]);

    // Handle select change
    const handleSelectChange = useCallback((name, option) => {
        setValue(name, option ? option.value : '');
    }, [setValue]);

    // Custom validation
    const validateForm = (data) => {
        const errors = {};

        if (data.mobileNo && !/^[0-9]{10}$/.test(data.mobileNo)) {
            errors.mobileNo = 'Mobile number must be 10 digits';
        }

        if (data.aadharNo && !/^[0-9]{12}$/.test(data.aadharNo)) {
            errors.aadharNo = 'Aadhaar number must be 12 digits';
        }

        return errors;
    };

    // Handle form submit
    const onSubmit = useCallback(async (data) => {
        const validationErrors = validateForm(data);
        if (Object.keys(validationErrors).length > 0) {
            // Set errors manually
            Object.keys(validationErrors).forEach(key => {
                // You might want to use setError from react-hook-form
                // For now, we'll handle it in the component
            });
            return;
        }
        await onSave(data);
    }, [onSave]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full border border-gray-200 dark:border-gray-700 max-w-6xl hide-scrollbar overflow-y-auto max-h-[80vh]">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        ✏️ Edit Student
                    </h1>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold transition"
                        type="button"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 space-y-7">
                    {/* Personal Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            👤 Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputBox
                                name="registerNo"
                                label="Register No"
                                required
                                type="text"
                                register={register}
                                errors={errors}
                                readOnly
                            />
                            <InputBox
                                name="name"
                                label="Name"
                                required
                                type="text"
                                register={register}
                                errors={errors}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                            <SearchDropdown
                                label="Category"
                                name="category"
                                value={watch('category')}
                                options={categoryOptions}
                                onChange={handleSelectChange}
                                required
                                error={errors.category?.message}
                            />
                            <SearchDropdown
                                label="Graduate"
                                name="graduate"
                                value={watch('graduate')}
                                options={graduateOptions}
                                onChange={handleSelectChange}
                                required
                                error={errors.graduate?.message}
                            />
                            <SearchDropdown
                                label="Department"
                                name="department"
                                value={watch('department')}
                                options={departmentOptions}
                                onChange={handleSelectChange}
                                required
                                error={errors.department?.message}
                            />
                            <InputBox
                                name="yearOfAdmission"
                                label="Batch (Year of Admission)"
                                required
                                type="text"
                                register={register}
                                errors={errors}
                                placeholder="e.g., 2023"
                            />
                            <SearchDropdown
                                label="Semester"
                                name="semester"
                                value={watch('semester')}
                                options={semesterOptions}
                                onChange={handleSelectChange}
                                required
                                error={errors.semester?.message}
                            />
                            <SearchDropdown
                                label="Section"
                                name="section"
                                value={watch('section')}
                                options={sectionOptions}
                                onChange={handleSelectChange}
                                required
                                error={errors.section?.message}
                            />
                            <SearchDropdown
                                label="Religion"
                                name="religion"
                                value={watch('religion')}
                                options={religionOptions}
                                onChange={handleSelectChange}
                                required
                                error={errors.religion?.message}
                            />
                            <InputBox
                                name="mobileNo"
                                label="Mobile No"
                                type="text"
                                register={register}
                                errors={errors}
                                placeholder="10 digits only"
                            />
                            <InputBox
                                name="aadharNo"
                                label="Aadhar No"
                                type="text"
                                register={register}
                                errors={errors}
                                placeholder="12 digits only"
                            />
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            📍 Address Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputBox
                                name="address"
                                label="Address"
                                type="text"
                                register={register}
                                errors={errors}
                            />
                            <InputBox
                                name="district"
                                label="District"
                                type="text"
                                register={register}
                                errors={errors}
                            />
                            <InputBox
                                name="state"
                                label="State"
                                type="text"
                                register={register}
                                errors={errors}
                            />
                            <InputBox
                                name="pinCode"
                                label="Pin Code"
                                type="number"
                                register={register}
                                errors={errors}
                            />
                        </div>
                    </div>

                    {/* Family Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            👨‍👩‍👧‍👦 Family Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputBox
                                name="parentName"
                                label="Parent Name"
                                type="text"
                                register={register}
                                errors={errors}
                            />
                            <InputBox
                                name="parentNo"
                                label="Parent Contact No"
                                type="text"
                                register={register}
                                errors={errors}
                            />
                            <InputBox
                                name="parentOccupation"
                                label="Parent Occupation"
                                type="text"
                                register={register}
                                errors={errors}
                            />
                            <InputBox
                                name="parentAnnualIncome"
                                label="Parent Annual Income"
                                type="number"
                                register={register}
                                errors={errors}
                            />
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            📋 Additional Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <SearchDropdown
                                label="Siblings Status"
                                name="siblingsStatus"
                                value={watch('siblingsStatus')}
                                options={siblingOptions}
                                onChange={handleSelectChange}
                            />
                            <InputBox
                                name="siblingsCount"
                                label="Siblings Count"
                                type="number"
                                register={register}
                                errors={errors}
                            />
                            <InputBox
                                name="siblingsOccupation"
                                label="Siblings Occupation"
                                type="text"
                                register={register}
                                errors={errors}
                            />
                            <InputBox
                                name="siblingsIncome"
                                label="Siblings Income"
                                type="number"
                                register={register}
                                errors={errors}
                            />
                            <SearchDropdown
                                label="Hostel Status"
                                name="hostelStatus"
                                value={watch('hostelStatus')}
                                options={hostelOptions}
                                onChange={handleSelectChange}
                            />
                            <SearchDropdown
                                label="Government Scholarship"
                                name="governmentScholarship"
                                value={watch('governmentScholarship')?.toString()}
                                options={scholarshipOptions}
                                onChange={(name, option) => setValue(name, parseInt(option?.value))}
                            />
                            <SearchDropdown
                                label="Semester Based"
                                name="isSemBased"
                                value={watch('isSemBased')?.toString()}
                                options={semBasedOptions}
                                onChange={(name, option) => setValue(name, parseInt(option?.value))}
                            />
                            <InputBox
                                name="totalCreditedAmount"
                                label="Total Credited Amount"
                                type="number"
                                register={register}
                                errors={errors}
                            />
                        </div>
                    </div>

                    {/* Footer */}
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
                            disabled={isLoading}
                            className="px-6 py-2.5 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Updating...' : 'Update Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default StudentEditModal;