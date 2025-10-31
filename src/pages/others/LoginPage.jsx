import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import LoginHeader from '../../components/LoginPage/LoginHeader';
import LoginIllustration from '../../components/LoginPage/LoginIllustration';
import LoginForm from '../../components/LoginPage/LoginForm';
import { AuthContext } from '../../context/AuthContext'

const schema = Yup.object().shape({
    userId: Yup.string().required('Username is required'),
    userPassword: Yup.string().required('Password is required'),
});

function LoginPage({ setIsAuthenticated }) {

    const { handleLogin } = useContext(AuthContext)
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (formData) => {
        try {
            const response = await handleLogin(formData);
            if (response?.status === 200) {
                const userId = response.data.user.userId;
                if (response.data.user.role === 0)
                    navigate(`/student/${userId}/dashboard`);
                else if (response.data.user.role === 1)
                    navigate(`/admin/dashboard`);
                else if (response.data.user.role === 2)
                    navigate(`/staff/${userId}/dashboard`);
                else
                    navigate('/');
            }
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message || "Error during login";
                alert(message);
            } else { alert("Network error or server not reachable") }
            console.error("Login error : ", error);
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
                    />
                </div>
            </div>
        </div>
    )
}

export default LoginPage;