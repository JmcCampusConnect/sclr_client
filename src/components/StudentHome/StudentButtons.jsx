import React from 'react';
import { useNavigate } from 'react-router-dom';

function StudentButtons() {

    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-items-center w-full max-w-2xl">
            <button
                onClick={() => navigate('/student/register/application')}
                className="uppercase bg-amber-50 text-black font-bold text-xl shadow-2xl w-40 h-14 md:w-40 md:h-14 lg:w-48 lg:h-16 px-4 py-4 hover:shadow-yellow-400 hover:bg-amber-200 rounded-lg"
            >
                Register
            </button>
            <button
                onClick={() => navigate('/login')}
                className="uppercase bg-amber-50 text-black font-bold text-xl shadow-2xl w-40 h-14 md:w-40 md:h-14 lg:w-48 lg:h-16 px-4 py-4 hover:shadow-yellow-400 hover:bg-amber-200 rounded-lg"
            >
                Login
            </button>
        </div>
    )
}

export default StudentButtons