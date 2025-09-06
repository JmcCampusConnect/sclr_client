import React from 'react'
import { useNavigate } from 'react-router-dom'

function UserButtons() {

    const navigate = useNavigate();

    const buttons = [
        { label: 'STUDENT', path: '/student' },
        { label: 'ADMIN', path: '/login' },
        { label: 'DEENIYATH', path: '/login' },
        { label: 'MORAL', path: '/login' },
        { label: 'COE', path: '/login' },
        { label: 'ATTENDANCE', path: '/login' },
    ]

    return (
        <div className="grid grid-cols-2 py-12 place-items-center w-full h-[80%]">
            {buttons.map(({ label, path }) => (
                <button
                    key={label} onClick={() => navigate(path)}
                    className="bg-amber-50 text-black font-bold text-xl shadow-2xl w-40 h-14 md:w-40 md:h-14 lg:w-48 lg:h-16 px-4 py-4 hover:shadow-yellow-400 hover:bg-amber-200 rounded-lg"
                >
                    {label}
                </button>
            ))}
        </div>
    )
}

export default UserButtons