import React from 'react'
import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import InputBox from '../../common/InputBox';

function LoginForm({ register, errors, registerSubmit, handleSubmit }) {

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => { usernameRef.current?.focus() }, []);

    return (
        <form onSubmit={handleSubmit(registerSubmit)} className="flex flex-col items-center justify-between lg:w-1/3 gap-4">
            <div className="text-lg lg:text-2xl font-bold text-white text-center">
                Show Us The Right Path
            </div>
            <div className="w-full bg-white rounded-2xl shadow-lg p-6 space-y-5">
                <h1 className="text-lg lg:text-2xl font-bold text-center text-orange-600">LOGIN</h1>
                {/* <p className="text-red-500 text-md">{props.errorData}</p> */}
                <InputBox
                    register={register}
                    errors={errors}
                    type='text'
                    name='userId'
                    placeholder='Username'
                />
                <InputBox
                    register={register}
                    errors={errors}
                    type='password'
                    name='userPassword'
                    placeholder='Password'
                />
                <div className='flex justify-end'>
                    <button
                        type='button'
                        onClick={() => navigate('/forgotPassword')}
                        className="block text-sm text-right text-blue-800 hover:text-blue-500 cursor-pointer"
                    >
                        Forgot Password ?
                    </button>
                </div>
                <div className="flex justify-between gap-8">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-1/2 rounded-lg px-3 py-2 bg-orange-500 hover:bg-orange-600 transition-colors duration-300 text-white font-bold"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="w-1/2 rounded-lg px-3 py-2 bg-orange-500 hover:bg-orange-600 transition-colors duration-300 text-white font-bold"
                    >
                        Log In
                    </button>
                </div>
            </div>
        </form>
    )
}

export default LoginForm