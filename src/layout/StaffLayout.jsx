import React from 'react'
import JmcLogo from '../assets/logos/JmcLogo.png'
import { Outlet, NavLink, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChalkboard, faTools, faBuilding, faBook, faClipboardList, faUndo
} from '@fortawesome/free-solid-svg-icons';
import '../App.css'

function StaffLayout() {

    const navigate = useNavigate();
    const { userId } = useParams();

    const menus = [
        { icon: faChalkboard, name: 'Dashboard', path: `/staff/dashboard`, show: true },
        { icon: faClipboardList, name: `Attendance ${userId}`, path: `/staff/${userId}/attendance`, show: true },
        { icon: faBook, name: 'Deeniyath Men', path: `/staff/deeniyath`, show: true },
        { icon: faBook, name: 'Deeniyath Women', path: `/staff/deeniyathsfw`, show: true },
        { icon: faBook, name: 'Moral Men', path: `/staff/moral`, show: true },
        { icon: faBook, name: 'Moral Women', path: `/staff/moralsfw`, show: true },
        { icon: faBuilding, name: 'COE', path: `/staff/coe`, show: true },
        { icon: faTools, name: 'Settings', path: `/staff/settingstaff`, show: true },
    ]

    return (
        <div className="flex w-screen h-screen overflow-hidden bg-white">
            <aside className="bg-emerald-700 w-72 flex flex-col text-white p-4 gap-3">
                <div className="flex flex-col items-center mb-4">
                    <img src={JmcLogo} alt="JMC Logo" className="w-32 h-32" />
                    <div className="text-center mt-2 text-sm font-semibold leading-5">
                        <p>JAMAL MOHAMED COLLEGE</p>
                        <p>(Autonomous)</p>
                        <p>TIRUCHIRAPPALLI - 620 020</p>
                    </div>
                </div>
                <nav className="flex-1 space-y-3 overflow-y-auto hide-scrollbar">
                    {menus.map((item, index) => (
                        <NavLink
                            key={index} to={item.path}
                            className={({ isActive }) => `flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 hover:bg-emerald-900 hover:bg-opacity-30 ${isActive ? 'bg-emerald-900 bg-opacity-30' : ''}`}
                        >
                            <FontAwesomeIcon icon={item.icon} className="text-base w-4" />
                            <span className='text-md'>{item.name}</span>
                        </NavLink>
                    ))}
                    <button
                        onClick={() => navigate('/student')}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 hover:bg-emerald-900 hover:bg-opacity-30"
                    >
                        <FontAwesomeIcon icon={faUndo} className="text-base w-4" />
                        <span className='text-md'>Back</span>
                    </button>
                </nav>
            </aside>
            <div className="flex-1 p-6 2xl:p-10 overflow-auto"> <Outlet /> </div>
        </div>
    )
}

export default StaffLayout