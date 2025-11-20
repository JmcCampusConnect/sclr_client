import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputBox from '../../common/InputBox';

function LoginForm({ register, errors, registerSubmit, handleSubmit }) {

    const navigate = useNavigate();
    const usernameRef = useRef(null);

    useEffect(() => { usernameRef.current?.focus(); }, []);

    return (
        <form
            onSubmit={handleSubmit(registerSubmit)}
            className="flex flex-col items-center lg:w-1/2 gap-6 px-4"
        >
            <h2 className="text-xl md:text-2xl font-bold text-white">
                Show Us The Right Path
            </h2>
            <div className="w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
                <h1 className="text-2xl font-extrabold text-center text-orange-600">Login</h1>
                <InputBox
                    register={register}
                    errors={errors}
                    type="text"
                    name="userId"
                    placeholder="Username"
                />
                <InputBox
                    register={register}
                    errors={errors}
                    type="password"
                    name="userPassword"
                    placeholder="Password"
                />
                <div className="text-right">
                    <button
                        type="button"
                        onClick={() => navigate('/forgotPassword')}
                        className="text-sm text-blue-800 hover:text-blue-600"
                    >
                        Forgot Password?
                    </button>
                </div>
                <div className="flex gap-5">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-1/2 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 transition font-bold text-white"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="w-1/2 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold transition"
                    >
                        Login
                    </button>
                </div>
            </div>
        </form>
    );
}

export default LoginForm;
