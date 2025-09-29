import React from 'react'
import JmcLogo from '../assets/logos/JmcLogo.png'
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faUndo, faChalkboard, faMapSigns } from '@fortawesome/free-solid-svg-icons';

function StudentLayout() {

    const navigate = useNavigate()

    let menus = [
        {
			icon: faChalkboard,
			name: 'Dashboard',
			path: `/student/status`
		},
		{
			icon: faClipboard,
			name: 'Application',
			path: `/student/application/renewal`
		},
		{
			icon: faMapSigns,
			name: 'Guidelines',
			path: `/student/guidelines`
		}
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
                <nav className="flex-1 space-y-3 overflow-y-auto scrollbar-hide">
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

export default StudentLayout