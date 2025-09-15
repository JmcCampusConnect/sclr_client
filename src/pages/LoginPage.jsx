import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup'
import LoginHeader from '../components/LoginPage/LoginHeader';
import LoginIllustration from '../components/LoginPage/LoginIllustration';
import LoginForm from '../components/LoginPage/LoginForm';
import { useAuth } from '../hook/useAuth';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const schema = Yup.object().shape({
    userId: Yup.string().required('Username is required'),
    userPassword: Yup.string().required('Password is required'),
})

function LoginPage() {

    const { errorData, authData } = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting, } } = useForm({
        resolver: yupResolver(schema)
    })

    const registerSubmit = async (formData) => {
        console.log(formData)
        const response = await authData(`${apiUrl}/api/user/register`, formData)
        console.log(response)
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <LoginHeader />
            <div className="w-full flex justify-center items-center">
                <div className="bg-orange-500 shadow-xl flex flex-col lg:flex-row rounded-xl w-full max-w-6xl p-6 gap-6">
                    <LoginIllustration />
                    <LoginForm register={register} errors={errors} registerSubmit={registerSubmit} handleSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    )
}

export default LoginPage;