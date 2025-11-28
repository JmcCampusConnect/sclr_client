import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import LoginHeader from '../../components/LoginPage/LoginHeader';
import LoginIllustration from '../../components/LoginPage/LoginIllustration';
import LoginForm from '../../components/LoginPage/LoginForm';

import { AuthContext } from '../../context/AuthContext';

const schema = Yup.object({
    userId: Yup.string().required('Username is required'),
    userPassword: Yup.string().required('Password is required'),
});

function LoginPage() {

    const { handleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {

        try {

            const res = await handleLogin(data);

            if (res?.status === 200) {
                const { userId, role } = res.data.user;
                if (role === 0) navigate(`/student/${userId}/dashboard`);
                else if (role === 1) navigate('/admin/dashboard');
                else if (role === 2) navigate(`/staff/${userId}/dashboard`);
                else navigate('/');
            }
        } catch (error) {
            const msg =
                error.response?.data?.message ||
                'Network error or server not reachable';
            alert(msg);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <LoginHeader />
            <div className="w-full flex justify-center mt-4">
                <div className="bg-white/10 backdrop-blur-sm bg-gradient-to-br from-orange-600 to-orange-400 rounded-2xl w-full max-w-6xl px-3 py-6 shadow-2xl flex flex-col lg:flex-row border border-white/20">
                    <LoginIllustration />
                    <LoginForm
                        register={register}
                        errors={errors}
                        handleSubmit={handleSubmit}
                        registerSubmit={onSubmit}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </div>
    )
}

export default LoginPage;
