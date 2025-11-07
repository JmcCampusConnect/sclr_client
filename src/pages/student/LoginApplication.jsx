import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import InstructionModal from '../../components/RegisterApplication/InstructionModal';
import SpecialCategory from '../../components/RegisterApplication/SpecialCategory';
import AcademicDetails from '../../components/RegisterApplication/AcademicDetails';
import StudentSection from '../../components/RegisterApplication/StudentSection';
import ParentSection from '../../components/RegisterApplication/ParentSection';
import AddressSection from '../../components/RegisterApplication/AddressSection';
import LastInstitution from '../../components/RegisterApplication/LastInstitution';
import Button from '../../common/Button';
import { useAdd } from '../../hook/useAdd';
const apiUrl = import.meta.env.VITE_API_URL;

const schema = Yup.object().shape({
    specialCategory: Yup.string().required('Special Category is required'),
    hasAppliedOtherScholarships: Yup.string().required('Applied Scholarship is required'),
    graduate: Yup.string().required('Graduate is required'),
    category: Yup.string().required('Category is required'),
    semester: Yup.string().required('Semester is required'),
    hostelStatus: Yup.string().required('Hostel Status is required'),
    registerNo: Yup.string().required('Register Number is required'),
    name: Yup.string().required('Name is required'),
    yearOfAdmission: Yup.number().required('Year of Admission is required').typeError('Must be a number'),
    department: Yup.string().required('Department is required'),
    section: Yup.string().required('Section is required'),
    religion: Yup.string().required('Religion is required'),
    mobileNo: Yup.string().required('Mobile Number is required').matches(/^[0-9]{10}$/, 'Mobile Number must contain 10 digits'),
    aadharNo: Yup.string().required('Aadhar Number is required').matches(/^[0-9]{12}$/, 'Aadhar Number must contain 12 digits'),
    parentName: Yup.string().required("Parent / Guardian Name is required"),
    parentNo: Yup.string().required("Parent / Guardian No. is required"),
    parentOccupation: Yup.string().required("Parent Occupation is required"),
    parentAnnualIncome: Yup.number().required("Parent Annual Income is required").typeError("Must be a number"),
    siblingsStatus: Yup.string().required("Siblings status is required"),
    siblingsCount: Yup.number().when("siblingsStatus", {
        is: "Yes",
        then: (schema) => schema.required("Number of Siblings is required").typeError("Must be a number"),
        otherwise: (schema) => schema.notRequired(),
    }),
    siblingsOccupation: Yup.string().when('siblingsStatus', {
        is: 'Yes', then: (schema) => schema.required('Siblings Occupation is required'),
        otherwise: (schema) => schema.notRequired()
    }),
    siblingsIncome: Yup.number().when('siblingsStatus', {
        is: 'Yes',
        then: (schema) => schema.required('Siblings Income is required').typeError('Must be a number'),
        otherwise: (schema) => schema.notRequired()
    }),
    address: Yup.string().required("Permanent Address is required"),
    state: Yup.string().required("State is required"),
    district: Yup.string().required("District is required"),
    pinCode: Yup.string().required('Pincode is required').matches(/^[0-9]{6}$/, 'Pincode must contain 6 digits'),
    jamathLetter: Yup.mixed().test(
        "required", "Jamath / Self Declaration Letter is required",
        (value) => { return value && value.length > 0 }
    ),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string().required("Confirm Password is required").oneOf([Yup.ref('password')], 'Password must match'),
    lastStudiedInstitution: Yup.string().when("semester", {
        is: "I",
        then: (schema) => schema.required("Last Institution Name is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    yearOfPassing: Yup.number().when("semester", {
        is: "I",
        then: (schema) => schema.required("Year of Passing is required").typeError("Must be a number"),
        otherwise: (schema) => schema.notRequired(),
    }),
    marksSecured: Yup.number().when("semester", {
        is: "I",
        then: (schema) => schema.required("Marks Secured is required").typeError("Must be a number"),
        otherwise: (schema) => schema.notRequired(),
    }),
    maxMarks: Yup.number().when("semester", {
        is: "I",
        then: (schema) => schema.required("Maximum Marks is required").typeError("Must be a number"),
        otherwise: (schema) => schema.notRequired(),
    }),
    lastStudiedInstitutionPercentage: Yup.string().when("semester", {
        is: "I",
        then: (schema) => schema.required("Percentage is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
})

function LoginApplication() {

    const { userId } = useParams();

    useEffect(() => {
        const fetchData = async () => {

            if (!userId) return;

            try {
                const response = await axios.get(`${apiUrl}/api/student/fetchStudentData`, { params: { registerNo: userId?.toUpperCase() } });


            } catch (error) {
                console.error('Error:', error.response ? error.response.data : error);
                alert('Failed to load data.');
            }
        }
        fetchData();
    }, [userId, apiUrl]);

    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate();
    const { addData, addError } = useAdd();

    const registerFormSubmit = async (formData) => {
        const dataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === "jamathLetter" && formData[key] instanceof FileList) {
                dataToSend.append(key, formData[key][0]);
            } else { dataToSend.append(key, formData[key]) }
        })
        try {
            const response = await addData(`${apiUrl}/api/register/application`, dataToSend);
            if (response.data.status === 201) {
                alert(response.data?.message || 'Application submitted successfully')
                window.location.reload();
                navigate('/student')
            }
            else { alert('Error in saving Application') }
        } catch (error) {
            console.log('Error in saving Register Application : ', error);
        }
    }

    return (
        <form className='space-y-7' onSubmit={handleSubmit(registerFormSubmit)}>
            <SpecialCategory
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
            />

            <AcademicDetails
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
            />

            <StudentSection
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
            />

            <ParentSection
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
            />

            <AddressSection
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
            />

            <div className='flex justify-end'>
                <Button
                    type="submit" label={isSubmitting ? "Submitting..." : "Submit"}
                    customBtnStyle={`bg-blue-500 hover:bg-blue-700 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                />
            </div>
        </form >
    )
}

export default LoginApplication