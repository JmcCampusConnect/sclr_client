import React, { useId } from 'react'
import JmcLogo from '../assets/logos/JmcLogo.png'
import { Outlet, NavLink, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faUndo, faChalkboard, faMapSigns } from '@fortawesome/free-solid-svg-icons';

function StudentLayout() {

    const navigate = useNavigate();
    const { userId } = useParams();

    let menus = [
        {
            icon: faChalkboard,
            name: 'Dashboard',
            path: `/student/${userId}/dashboard`
        },
        {
            icon: faClipboard,
            name: 'Application',
            path: `/student/${userId}/application`
        },
        {
            icon: faMapSigns,
            name: 'Guidelines',
            path: `/student/${userId}/guidelines`
        }
    ]

    return (
        <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <aside className="bg-gradient-to-b from-emerald-800 to-emerald-700 w-72 flex flex-col text-white p-5 shadow-xl">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-6">
                    <img
                        src={JmcLogo}
                        alt="JMC Logo"
                        className="w-28 h-28 mb-2 drop-shadow-md"
                    />
                    <div className="text-center text-sm font-semibold leading-5 tracking-wide">
                        <p className="uppercase">Jamal Mohamed College</p>
                        <p className="text-emerald-200">(Autonomous)</p>
                        <p className="text-emerald-200">Tiruchirappalli - 620020</p>
                    </div>
                    <div className="bg-emerald-600 shadow-md text-white rounded-lg py-1 px-3 mt-5 text-xs font-bold tracking-wide">
                        {userId}
                    </div>
                </div>

                {/* Menu Section */}
                <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
                    {menus.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            className={({ isActive }) =>
                                `group flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-medium
                                    hover:bg-emerald-900 hover:bg-opacity-30 ${isActive
                                    ? "bg-emerald-900 bg-opacity-30 border-l-2 border-white" : ""
                                }`
                            }
                        >
                            <FontAwesomeIcon
                                icon={item.icon}
                                className="text-base w-4"
                            />
                            <span className="text-md">{item.name}</span>
                        </NavLink>
                    ))}

                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/student")}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 hover:bg-emerald-900 hover:bg-opacity-30"
                    >
                        <FontAwesomeIcon
                            icon={faUndo}
                            className="text-base w-4 transition-transform hover:scale-110"
                        />
                        <span className="text-md">Back</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-6 2xl:p-10 overflow-auto">
                <div className="bg-white shadow-md rounded-xl p-6 min-h-full">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default StudentLayout