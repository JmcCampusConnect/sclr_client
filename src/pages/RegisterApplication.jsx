import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import InstructionModal from '../components/RegisterApplication/InstructionModal';
import SpecialCategory from '../components/RegisterApplication/SpecialCategory';
import AcademicDetails from '../components/RegisterApplication/AcademicDetails';
import StudentSection from '../components/RegisterApplication/StudentSection';
import ParentSection from '../components/RegisterApplication/ParentSection';
import AddressSection from '../components/RegisterApplication/AddressSection';
import LastInstitution from '../components/RegisterApplication/LastInstitution';
import Button from '../common/Button';
import { useAdd } from '../hook/useAdd';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const schema = Yup.object().shape({
    specialCategory: Yup.string().required('Special Category is required'),
    hasAppliedOtherScholarships: Yup.string().required('Applied Scholarship is required'),
    graduate: Yup.string().required('Graduate is required'),
    programCategory: Yup.string().required('Program Category is required'),
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

function RegisterApplication() {

    const [instructionModal, setInstructionModal] = useState(true);
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate();
    const { addData, addError } = useAdd();
    const [newStudent, setNewStudent] = useState(false);
    const [registerNo, setRegisterNo] = useState('');

    const checkRegisterNumber = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/register/checkRegisterNo?registerNo=${registerNo}`
            )
            // console.log(response)
            if (response.data.message === 'Allow to apply') {
                setValue('registerNo', registerNo);
                setNewStudent(true)
            } else {
                const confirmed = window.confirm('You already registered with this Register Number \nDo you want go to Login Page');
                if (confirmed) { navigate('/student') }
            }
        } catch (err) {
            console.error('Error checking register number : ', err);
            alert('Something went wrong. Please try again.');
        }
    }

    const registerFormSubmit = async (formData) => {
        // console.log('Data to send : ', formData);
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
                window.location.reload()
            }
            else { alert('Error in saving Application') }
        } catch (error) {
            console.log('Error in saving Register Application : ', error);
        }
    }

    return (
        <form className='space-y-7' onSubmit={handleSubmit(registerFormSubmit)}>
            {/* Instruction Modal */}
            {instructionModal && <InstructionModal instructionModal={instructionModal} onClose={() => setInstructionModal(false)} />}
            {/* Register Number Check */}
            {!newStudent ? (
                <div className="border border-black p-6 rounded-lg bg-gray-50 shadow-md mb-6">
                    <label className="block mb-2 text-center font-semibold text-slate-700">
                        Before applying for scholarship, check whether you are registered or not
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 font-semibold text-slate-700">
                                Register Number : <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    placeholder="Ex: 24MCAXXX"
                                    className="w-full p-2 border border-black rounded-md text-slate-950"
                                    value={registerNo}
                                    onChange={(e) => setRegisterNo(e.target.value.toUpperCase())}
                                    required
                                />
                                <button
                                    type="button"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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
                    <SpecialCategory register={register} errors={errors} />
                    <AcademicDetails register={register} errors={errors} watch={watch} />
                    <StudentSection register={register} errors={errors} />
                    <ParentSection register={register} errors={errors} watch={watch} />
                    <AddressSection register={register} errors={errors} />
                    <LastInstitution register={register} errors={errors} watch={watch} setValue={setValue} />
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

export default RegisterApplication