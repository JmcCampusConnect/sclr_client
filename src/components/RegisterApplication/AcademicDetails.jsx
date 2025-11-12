import React, { useState, useEffect } from 'react';
import RadioButton from '../../common/RadioButton';
import InputBox from '../../common/InputBox';
import DropDown from '../../common/DropDown';
import HeaderTag from '../../common/HeaderTag';
import axios from 'axios';

function AcademicDetails({ register, errors, watch, setValue, readOnly = false, loginConstraint = false }) {

    const apiUrl = import.meta.env.VITE_API_URL;
    const graduate = watch('graduate');
    const [departments, setDepartments] = useState([]);
    const semesterOptions = graduate === 'PG'
        ? ['I', 'II', 'III', 'IV']
        : ['I', 'II', 'III', 'IV', 'V', 'VI'];

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/tutor/departments`);
                setDepartments(response.data?.departments);
                console.log(response.data.departments)
            } catch (error) {
                console.error("Error fetching departments : ", error);
            }
        };
        fetchDepartments();
    }, []);

    const depts = Object.values(departments).map((item) => ({
        value: item.department,
        label: `${item.department} - ${item.departmentName}`,
    }));


    return (
        <>
            <HeaderTag label="Academic Details" />

            {/* Section 1 - Radio Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-200 p-6 rounded-xl bg-white shadow-md">
                <RadioButton
                    name="graduate"
                    label="UG or PG"
                    options={['UG', 'PG']}
                    required
                    register={register}
                    errors={errors}
                    readOnly={readOnly}
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
                        readOnly={readOnly}
                    />

                    {/* Department Dropdown */}
                    <DropDown
                        name="department"
                        label="Department"
                        options={depts}
                        required
                        errors={errors}
                        readOnly={readOnly || loginConstraint}
                        setValue={setValue}
                        watch={watch}
                    />

                    {/* Section Dropdown */}
                    <DropDown
                        name="section"
                        label="Section"
                        options={['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']}
                        required
                        errors={errors}
                        readOnly={readOnly}
                        setValue={setValue}
                        watch={watch}
                    />
                </div>
            </div>
        </>
    );
}

export default AcademicDetails;
