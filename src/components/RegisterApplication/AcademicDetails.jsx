import React, { useEffect } from 'react';
import RadioButton from '../../common/RadioButton';
import InputBox from '../../common/InputBox';
import DropDown from '../../common/DropDown';
import HeaderTag from '../../common/HeaderTag';

function AcademicDetails({ register, errors, watch, setValue, readOnly = false, loginConstraint = false }) {

    const graduate = watch('graduate');
    const registerNo = watch('registerNo');
    const semesterOptions = graduate === 'PG'
        ? ['I', 'II', 'III', 'IV']
        : ['I', 'II', 'III', 'IV', 'V', 'VI'];

    useEffect(() => {
        if (!registerNo || typeof registerNo !== 'string') return;

        const normalizedRegisterNo = registerNo.toUpperCase();
        const match = normalizedRegisterNo.match(/^(\d{2})([A-Z]{3})(\d{3})$/);

        if (!match) {
            setValue('yearOfAdmission', '', { shouldValidate: true, shouldDirty: true });
            setValue('department', '', { shouldValidate: true, shouldDirty: true });
            return;
        }

        const [, yearPrefix, departmentCode] = match;
        setValue('yearOfAdmission', `20${yearPrefix}`, { shouldValidate: true, shouldDirty: true });
        setValue('department', departmentCode, { shouldValidate: true, shouldDirty: true });
    }, [registerNo, setValue]);

    return (
        <>
            <HeaderTag label="Academic Details" />

            {/* Section 1 - Radio  Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-200 p-6 rounded-xl bg-white shadow-md">
                <RadioButton
                    name="graduate"
                    label="UG or PG"
                    options={['UG', 'PG']}
                    required
                    register={register}
                    errors={errors}
                    readOnly={readOnly || loginConstraint}
                />
                <RadioButton
                    name="category"
                    label="Category"
                    options={['Aided', 'SFM', 'SFW']}
                    required
                    register={register}
                    errors={errors}
                    readOnly={readOnly || loginConstraint}
                />
                <RadioButton
                    name="semester"
                    label="Semester"
                    options={semesterOptions}
                    required
                    register={register}
                    errors={errors}
                    readOnly={readOnly}
                />
                <RadioButton
                    name="hostelStatus"
                    label="Hostel"
                    options={['Yes', 'No']}
                    required
                    register={register}
                    errors={errors}
                    readOnly={readOnly}
                />
            </div>

            {/* Section 2 - Input & Dropdowns */}
            <div className="space-y-6 border border-gray-200 p-6 rounded-xl bg-white shadow-md mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputBox
                        label="Register No."
                        type="text"
                        name="registerNo"
                        placeholder="24MCAXYZ"
                        required
                        register={register}
                        errors={errors}
                        readOnly={true}
                    />
                    <InputBox
                        label="Name"
                        type="text"
                        name="name"
                        required
                        register={register}
                        errors={errors}
                        readOnly={readOnly}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputBox
                        label="Year of Admission"
                        type="text"
                        name="yearOfAdmission"
                        placeholder="e.g.: 2024"
                        required
                        register={register}
                        errors={errors}
                        readOnly={true}
                    />

                    <InputBox
                        label="Department"
                        type="text"
                        name="department"
                        placeholder="e.g.: CSE"
                        required
                        register={register}
                        errors={errors}
                        readOnly={true}
                    />

                    {/* Section Dropdown */}
                    <DropDown
                        name="section"
                        label="Section"
                        options={['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']}
                        required
                        errors={errors}
                        readOnly={readOnly || loginConstraint}
                        setValue={setValue}
                        watch={watch}
                    />
                </div>
            </div>
        </>
    );
}

export default AcademicDetails;
