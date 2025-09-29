import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import LoginHeader from '../components/LoginPage/LoginHeader';
import LoginIllustration from '../components/LoginPage/LoginIllustration';
import LoginForm from '../components/LoginPage/LoginForm';
import { useAuth } from '../hook/useAuth';

const schema = Yup.object().shape({
    userId: Yup.string().required('Username is required'),
    userPassword: Yup.string().required('Password is required'),
});

function LoginPage({ setIsAuthenticated }) {

    const { errorData, login } = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (formData) => {
        try {
            const response = await login(formData);
            // console.log(response)
            if (response?.status === 200) {
                const userId = response.user.userId
                setIsAuthenticated(true);
                if (response.user.role === 0) navigate(`/student/${userId}`);
                else if (response.user.role === 1) navigate(`/admin/${userId}`);
                else if (response.user.role === 2) navigate(`/staff/${userId}/attendance`); 
                else navigate('/');
            }
        } catch (error) {
            console.error('Erron during login : ', error);
            alert('Error during login')
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <LoginHeader />
            <div className="w-full flex justify-center items-center">
                <div className="bg-orange-500 shadow-xl flex flex-col lg:flex-row rounded-xl w-full max-w-6xl p-6 gap-6">
                    <LoginIllustration />
                    <LoginForm
                        register={register}
                        errors={errors}
                        handleSubmit={handleSubmit}
                        registerSubmit={onSubmit}
                        isSubmitting={isSubmitting}
                        errorMessage={errorData}
                    />
                </div>
            </div>
        </div>
    )
}

export default LoginPage;