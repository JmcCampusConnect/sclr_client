import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import HeaderTag from '../../common/HeaderTag';
import SpecialCategory from '../../components/RegisterApplication/SpecialCategory';
import AcademicDetails from '../../components/RegisterApplication/AcademicDetails';
import StudentSection from '../../components/RegisterApplication/StudentSection';
import ParentSection from '../../components/RegisterApplication/ParentSection';
import AddressSection from '../../components/RegisterApplication/AddressSection';
import LastInstitution from '../../components/RegisterApplication/LastInstitution';
import Button from '../../common/Button';
import { useAdd } from '../../hook/useAdd';
import axios from 'axios';
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
    jamathLetter: Yup
        .mixed()
        .test("required", "Jamath / Self Declaration Letter is required", (value) => value && value.length > 0)
        .test("fileSize", "File size must be between 30KB and 200KB",
            (value) => {
                if (!value || value.length === 0) return true;
                const file = value[0];
                const sizeKB = file.size / 1024;
                return sizeKB >= 30 && sizeKB <= 200;
            }
        )
        .test("fileType", "Only JPEG, JPG, or PNG images are allowed",
            (value) => {
                if (!value || value.length === 0) return true;
                const file = value[0];
                const validTypes = ["image/jpeg", "image/jpg", "image/png"];
                return validTypes.includes(file.type);
            }
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

function AdminRegisterAppln() {

    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm({
        resolver: yupResolver(schema), shouldUnregister: true
    });
    const navigate = useNavigate();
    const { addData, addError } = useAdd();
    const [newStudent, setNewStudent] = useState(false);
    const [registerNo, setRegisterNo] = useState('');

    const checkRegisterNumber = async () => {

        if (registerNo === '') { return alert('Please enter Register Number') }

        try {
            const response = await axios.get(
                `${apiUrl}/api/student/checkRegisterNo?registerNo=${registerNo}`
            )
            // console.log(response)
            if (response.data.message === 'Allow to apply') {
                setValue('registerNo', registerNo);
                setNewStudent(true)
            } else {
                const confirmed = window.confirm('You already registered with this Register Number \nDo you want go to Login Application');
                if (confirmed) { navigate(`/admin/${registerNo}/adminLoginApplication`) }
            }
        } catch (err) {
            console.error('Error checking register number : ', err);
            alert('Something went wrong. Please try again.');
        }
    }

    const registerFormSubmit = async (formData) => {
        const dataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === "jamathLetter" && formData[key] instanceof FileList) {
                dataToSend.append(key, formData[key][0]);
            }
            else if (
                key === "lastStudiedInstitutionPercentage" &&
                (formData[key] === "" || formData[key] === null || formData[key] === undefined)
            ) {
                dataToSend.append(key, -1);
            }
            else {
                dataToSend.append(key, formData[key]);
            }
        });
        try {
            const response = await addData(`${apiUrl}/api/student/registerApplication`, dataToSend);
            if (response.data.status === 201) {
                alert(response.data?.message || 'Application submitted successfully')
                navigate('/admin/applicationManage')
            }
            else { alert('Error in saving Application') }
        } catch (error) {
            console.error('Error in saving Register Application : ', error);
        }
    }

    return (
        <form className='space-y-7' onSubmit={handleSubmit(registerFormSubmit)}>
            {/* Register Number Check */}
            {!newStudent ? (
                <div className="border mb-6 border-gray-200 p-6 rounded-xl bg-white shadow-md">
                    <label className="block text-md font-medium text-gray-700 text-center mb-3">
                        Before applying for scholarship, check whether you are registered or not
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className=''>
                            <label className="block text-md font-medium text-gray-700">
                                Register Number : <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="text" placeholder="Ex : 24MCAXXX"
                                    className="w-full border text-gray-900 transition border-gray-200 p-2 rounded-md bg-white shadow-xs mt-2.5"
                                    value={registerNo}
                                    onChange={(e) => setRegisterNo(e.target.value.toUpperCase())}
                                    required
                                />
                                <button
                                    type="button"
                                    className="bg-blue-600 text-white px-4 py-2.5 mt-2 rounded-md hover:bg-blue-700"
                                    onClick={checkRegisterNumber}
                                >
                                    Check
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <HeaderTag label="New Application" />
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

                    <LastInstitution
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
                </>
            )}
        </form>
    )
}

export default AdminRegisterAppln