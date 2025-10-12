import React, { useState } from "react";
import JmcLogo from "../assets/logos/JmcLogo.png";
import { Outlet, NavLink, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChalkboard, faHandHoldingHeart, faFileAlt, faIdCard, faTools, faSignOutAlt,
    faChartBar, faSliders, faMapSigns, faClipboard, faChartLine, faCalendarDays
} from '@fortawesome/free-solid-svg-icons';
import { ChevronUp, ChevronDown } from "lucide-react";
import '../App.css';

function RecursiveMenu({ items }) {

    const [openMap, setOpenMap] = useState({});
    const toggle = key => setOpenMap(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <>
            {items.map((item, idx) =>
                item.subItems ? (
                    <div key={item.name + idx}>
                        <button
                            onClick={() => toggle(item.name + idx)}
                            className="group flex items-center space-x-3 px-4 py-2.5 rounded-md font-medium hover:bg-emerald-900 hover:bg-opacity-30 w-full"
                        >
                            {item.icon && <FontAwesomeIcon icon={item.icon} className="text-base w-4" />}
                            <span className="text-sm">{item.name}</span>
                            {openMap[item.name + idx] ? (
                                <ChevronUp className="ml-auto h-4 w-4" />
                            ) : (
                                <ChevronDown className="ml-auto h-4 w-4" />
                            )}
                        </button>
                        {openMap[item.name + idx] && (
                            <div className="ml-6 mt-2 space-y-2 border-l border-white/30 pl-2">
                                <RecursiveMenu items={item.subItems} />
                            </div>
                        )}
                    </div>
                ) : (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `group flex items-center space-x-3 px-4 py-2.5 rounded-md font-medium hover:bg-emerald-900 hover:bg-opacity-30 ${isActive ? "bg-emerald-900 bg-opacity-30 border-l-2 border-white" : ""}`
                        }
                    >
                        {item.icon && <FontAwesomeIcon icon={item.icon} className="text-base w-4" />}
                        <span className="text-sm">{item.name}</span>
                    </NavLink>
                )
            )}
        </>
    )
}

function AdminLayout() {

    const navigate = useNavigate();
    const { userId } = useParams();

    const navItems = [
        { icon: faChalkboard, name: 'Dashboard', path: `/admin/dashboard`, show: true },
        { icon: faHandHoldingHeart, name: 'Donor', path: '/admin/donormenu', show: true },
        { icon: faClipboard, name: 'Application', path: '/admin/application', show: true },
        { icon: faIdCard, name: 'Status', path: '/admin/status', show: true },
        { icon: faTools, name: 'Settings', path: '/admin/action', show: true },
        { icon: faChartLine, name: 'Work Progress Report', path: '/admin/progress_report', show: true },
        { icon: faFileAlt, name: 'Distribution Statement', path: '/admin/distribution_statement', show: true },
        { icon: faChartBar, name: 'Reports', path: '/admin/report', show: true },
        { icon: faMapSigns, name: 'Guidelines', path: '/admin/guidelines', show: true },
        {
            name: "Application Settings",
            icon: faCalendarDays,
            show: true,
            subItems: [
                { name: "Academic Year", path: `/admin/academicYear` },
                { name: "Application Schedule", path: `/admin/applicationDate` },
            ]
        }
    ]

    return (
        <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <aside className="bg-gradient-to-b from-emerald-800 to-emerald-700 w-72 flex flex-col text-white p-5 shadow-xl">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-6">
                    <img src={JmcLogo} alt="JMC Logo" className="w-28 h-28 mb-2 drop-shadow-md" />
                    <div className="text-center text-sm font-semibold leading-5 tracking-wide">
                        <p className="uppercase">Jamal Mohamed College</p>
                        <p className="text-emerald-200">(Autonomous)</p>
                        <p className="text-emerald-200">Tiruchirappalli - 620020</p>
                    </div>
                    <div className="bg-emerald-600 shadow-md text-white rounded-lg py-1 px-3 mt-5 text-xs font-bold tracking-wide">
                        ADMIN
                    </div>
                </div>

                {/* Menu Section with recursive rendering */}
                <nav className="flex-1 space-y-2 overflow-y-auto hide-scrollbar">
                    <RecursiveMenu items={navItems.filter(item => item.show)} />
                    {/* Logout Button */}
                    <button
                        onClick={() => navigate("/")}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-medium hover:bg-emerald-900 hover:bg-opacity-30"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="text-base w-4 transition-transform hover:scale-110" />
                        <span className="text-sm">Logout</span>
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

export default AdminLayout;