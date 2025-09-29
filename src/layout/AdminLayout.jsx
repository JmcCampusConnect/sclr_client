import React, { useState } from "react";
import JmcLogo from "../assets/logos/JmcLogo.png";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChalkboard, faHandHoldingHeart, faFileAlt, faIdCard, faTools,
    faRightFromBracket, faChartBar, faUserGear, faMapSigns, faClipboard, faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import { ChevronDown, ChevronUp } from "lucide-react";
import '../App.css'

function AdminLayout() {

    const navigate = useNavigate();
    const [manageOpen, setManageOpen] = useState(false);

    const navItems = [
        { icon: faChalkboard, name: 'Dashboard', path: 'dashboard', show: true },
        { icon: faHandHoldingHeart, name: 'Donor', path: '/admin/donormenu', show: true },
        { icon: faClipboard, name: 'Application', path: '/admin/application', show: true },
        { icon: faIdCard, name: 'Status', path: '/admin/status', show: true },
        { icon: faTools, name: 'Settings', path: '/admin/action', show: true },
        { icon: faChartLine, name: 'Work Progress Report', path: '/admin/progress_report', show: true },
        { icon: faFileAlt, name: 'Distribution Statement', path: '/admin/distribution_statement', show: true },
        { icon: faChartBar, name: 'Reports', path: '/admin/report', show: true },
        { icon: faMapSigns, name: 'Guidelines', path: '/admin/guidelines', show: true },
        {
            name: "Manage",
            icon: faUserGear,
            subItems: [
                { name: "Substitution Management", path: `/layout/admin/substitutionManagement` },
                { name: "User Management", path: `/layout/admin/userManagement` },
                { name: "Leave Management", path: `/layout/admin/leaveManagement` },
                { name: "Academic Management", path: `/layout/admin/academicManagement` },
                { name: "Course Management", path: `/layout/admin/courseManagement` },
                { name: "Attendance Management", path: `/layout/admin/attendanceManagement` },
                { name: "Attendance Report", path: `/layout/admin/attendanceReport` },
            ],
        },
    ]

    return (
        <div className="flex w-screen h-screen overflow-hidden bg-white">
            {/* Sidebar */}
            <aside className="bg-emerald-700 w-72 flex flex-col text-white p-4 gap-3">
                {/* Logo + Header */}
                <div className="flex flex-col items-center mb-4">
                    <img src={JmcLogo} alt="JMC Logo" className="w-32 h-32" />
                    <div className="text-center mt-2 text-sm font-semibold leading-5">
                        <p>JAMAL MOHAMED COLLEGE</p>
                        <p>(Autonomous)</p>
                        <p>TIRUCHIRAPPALLI - 620 020</p>
                    </div>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 space-y-3 overflow-y-auto hide-scrollbar">
                    {navItems.map((item, index) =>
                        item.subItems ? (
                            <div key={index} className="space-y-1">
                                {/* Manage Toggle */}
                                <button
                                    onClick={() => setManageOpen(!manageOpen)}
                                    className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 hover:bg-emerald-900 hover:bg-opacity-30"
                                >
                                    <FontAwesomeIcon icon={item.icon} className="text-base w-4" />
                                    <span className="text-md">{item.name}</span>
                                    {manageOpen ? (
                                        <ChevronUp className="ml-auto h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="ml-auto h-4 w-4" />
                                    )}
                                </button>

                                {/* Submenu */}
                                {manageOpen && (
                                    <div className="ml-6 space-y-1 border-l border-white/30 pl-2">
                                        {item.subItems.map((sub, idx) => (
                                            <NavLink key={idx}
                                                to={sub.path}
                                                className={({ isActive }) =>
                                                    `flex items-center px-3 py-3 rounded-md text-sm font-medium transition-all duration-300 hover:bg-emerald-900 hover:bg-opacity-30 ${isActive ? "bg-emerald-900 bg-opacity-30" : ""}`
                                                }
                                            >
                                                {sub.name}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <NavLink key={index}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 hover:bg-emerald-900 hover:bg-opacity-30 ${isActive ? "bg-emerald-900 bg-opacity-30" : ""}`
                                }
                            >
                                <FontAwesomeIcon icon={item.icon} className="text-base w-4" />
                                <span className="text-md">{item.name}</span>
                            </NavLink>
                        )
                    )}

                    {/* Logout Button at Bottom */}
                    <button
                        onClick={() => navigate("/")}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 hover:bg-emerald-900 hover:bg-opacity-30"
                    >
                        <FontAwesomeIcon icon={faRightFromBracket} className="text-base w-4" />
                        <span className="text-md">Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 p-6 2xl:p-10 overflow-auto"> <Outlet /> </div>
        </div>
    )
}

export default AdminLayout;