import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from 'react-hook-form';
import InputBox from "../../common/InputBox";
import SearchDropdown from "../../common/SearchDropDown";

function StudentEditModal({ student, onClose, onSave, isLoading, departments, existingRegisterNos }) {

    const [registerNoChanged, setRegisterNoChanged] = useState(false);

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
        }
    });

    const watchRegisterNo = watch('registerNo');
    const siblingsStatus = watch('siblingsStatus');

    useEffect(() => {
        if (student && watchRegisterNo) {
            setRegisterNoChanged(student.registerNo !== watchRegisterNo);
        }
    }, [student, watchRegisterNo]);

    const validateRegisterNo = useCallback((value) => {
        if (!value) return 'Register number is required';
        if (registerNoChanged && existingRegisterNos?.includes(value) && value !== student?.registerNo) {
            return 'Register number already exists';
        }
        return true;
    }, [registerNoChanged, existingRegisterNos, student]);


    // Mapped Options matching your section configurations
    const categoryOptions = useMemo(() => [
        { value: "Aided", label: "Aided" },
        { value: "SFM", label: "SFM" },
        { value: "SFW", label: "SFW" },
    ], []);

    const graduateOptions = useMemo(() => [
        { value: "UG", label: "UG" },
        { value: "PG", label: "PG" },
    ], []);

    const sectionOptions = useMemo(() => [
        { value: "A", label: "A" }, { value: "B", label: "B" },
        { value: "C", label: "C" }, { value: "D", label: "D" },
        { value: "E", label: "E" }, { value: "F", label: "F" },
        { value: "G", label: "G" }, { value: "H", label: "H" },
        { value: "I", label: "I" }
    ], []);

    const religionOptions = useMemo(() => [
        { value: "Muslim", label: "Muslim" },
        { value: "Hindu", label: "Hindu" },
        { value: "Christian", label: "Christian" },
        { value: "Others", label: "Others" },
    ], []);

    const departmentOptions = useMemo(() => {
        if (!departments || !Array.isArray(departments)) return [];
        return departments.map(item => ({
            value: item.department,
            label: `${item.department} - ${item.departmentName}`
        }));
    }, [departments]);

    const stateOptions = useMemo(() => [
        'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
        'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
        'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh',
        'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim',
        'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Others'
    ].map(state => ({ value: state, label: state })), []);

    const districtOptions = useMemo(() => [
        'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
        'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur',
        'Krishnagiri', 'Madurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur',
        'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi',
        'Thanjavur', 'Theni', 'Thoothukuidi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur',
        'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram',
        'Virudhunagar', 'Others'
    ].map(district => ({ value: district, label: district })), []);

    const siblingOptions = useMemo(() => [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" }
    ], []);

    const hostelOptions = useMemo(() => [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" }
    ], []);

    // Form Initialization
    useEffect(() => {
        if (student) {
            Object.keys(student).forEach(key => {
                if (!['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) {
                    setValue(key, student[key] ?? '');
                }
            });
        }
    }, [student, setValue]);

    const handleSelectChange = useCallback((name, option) => {
        setValue(name, option ? option.value : '');
    }, [setValue]);

    const onSubmit = useCallback(async (data) => {
        await onSave(data);
    }, [onSave]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full border border-gray-200 dark:border-gray-700 max-w-6xl hide-scrollbar overflow-y-auto max-h-[80vh]">

                {/* Modal Header */}
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

                    {/* Academic & Personal Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-880/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            👤 Personal & Academic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputBox
                                name="registerNo"
                                label="Register No"
                                required
                                type="text"
                                register={register}
                                errors={errors}
                                readOnly={false}
                                validation={{
                                    validate: validateRegisterNo
                                }}
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
                                label="Year of Admission"
                                required
                                type="text"
                                register={register}
                                errors={errors}
                                placeholder="e.g., 2024"
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
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            📍 Address Information
                        </h2>
                        <div className="space-y-4">
                            <InputBox
                                name="address"
                                label="Address"
                                type="text"
                                register={register}
                                errors={errors}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <SearchDropdown
                                    label="State"
                                    name="state"
                                    value={watch('state')}
                                    options={stateOptions}
                                    onChange={handleSelectChange}
                                    error={errors.state?.message}
                                />
                                <SearchDropdown
                                    label="District"
                                    name="district"
                                    value={watch('district')}
                                    options={districtOptions}
                                    onChange={handleSelectChange}
                                    error={errors.district?.message}
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
                    </div>

                    {/* Family Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            👨‍👩‍👧‍👦 Family Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputBox name="parentName" label="Parent Name" type="text" register={register} errors={errors} />
                            <InputBox name="parentNo" label="Parent Contact No" type="text" register={register} errors={errors} />
                            <InputBox name="parentOccupation" label="Parent Occupation" type="text" register={register} errors={errors} />
                            <InputBox name="parentAnnualIncome" label="Parent Annual Income" type="number" register={register} errors={errors} />
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

                            {siblingsStatus === 'Yes' && (
                                <>
                                    <InputBox name="siblingsCount" label="Siblings Count" type="number" register={register} errors={errors} />
                                    <InputBox name="siblingsOccupation" label="Siblings Occupation" type="text" register={register} errors={errors} />
                                    <InputBox name="siblingsIncome" label="Siblings Income" type="number" register={register} errors={errors} />
                                </>
                            )}

                            <SearchDropdown
                                label="Hostel Status"
                                name="hostelStatus"
                                value={watch('hostelStatus')}
                                options={hostelOptions}
                                onChange={handleSelectChange}
                            />
                        </div>
                    </div>

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