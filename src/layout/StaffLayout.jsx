import React, { useContext } from 'react'
import JmcLogo from '../assets/logos/JmcLogo.png'
import { Outlet, NavLink, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboard, faTools, faBuilding, faBook, faClipboardList, faSignOutAlt, faFilePen, faUpload } from '@fortawesome/free-solid-svg-icons';
import '../App.css';
import { AuthContext } from '../context/AuthContext';

function StaffLayout() {

    const navigate = useNavigate();
    const { userId } = useParams();
    const { handleLogout } = useContext(AuthContext);

    const attendanceMap = {
        JMCRAA: 'Attendance Aided',
        JMCRAS: 'Attendance SFM',
        JMCRAW: 'Attendance SFW',
    }

    const subjectMap = {
        JMCDM: 'Deeniyath Men',
        JMCDW: 'Deeniyath Women',
        JMCMM: 'Moral Men',
        JMCMW: 'Moral Women',
    }

    const sclrMap = {
        JMCTPS: 'Tamil Puthalvan Scheme',
        JMCPPS: 'Pudhumai Penn Scheme',
    }

    const restrictedUsers = [
        ...Object.keys(attendanceMap),
        ...Object.keys(subjectMap),
        ...Object.keys(sclrMap)
    ]

    const attendanceName = attendanceMap[userId] || null;
    const subjectName = subjectMap[userId] || null;
    const sclrName = sclrMap[userId] || null;

    const menus = [
        { icon: faChalkboard, name: 'Dashboard', path: `/staff/${userId}/dashboard`, show: true },
        { icon: faClipboardList, name: attendanceName, path: `/staff/${userId}/classAttendance`, show: Object.keys(attendanceMap).includes(userId) },
        { icon: faBook, name: subjectName, path: `/staff/${userId}/dmAttendance`, show: Object.keys(subjectMap).includes(userId) },
        { icon: faBuilding, name: 'COE', path: `/staff/${userId}/markEntry`, show: userId === 'JMCCOE' },
        { icon: faFilePen, name: sclrName, path: `/staff/${userId}/scholarshipStaff`, show: Object.keys(sclrMap).includes(userId) },
        { icon: faFilePen, name: 'Student Verification', path: `/staff/${userId}/tutorVerification`, show: !restrictedUsers.includes(userId), },
        { icon: faUpload, name: 'Upload Center', path: `/staff/${userId}/uploadCenter`, show: userId === 'JMCCOE' || userId === 'JMCTPS' || userId === 'JMCPPS' },
        { icon: faTools, name: 'Change Password', path: `/staff/${userId}/changePassword`, show: true },
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
                    {menus.filter(item => item.show).map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            className={({ isActive }) =>
                                `group flex items-center space-x-3 px-4 py-2.5 rounded-md font-medium
                                     hover:bg-emerald-900 hover:bg-opacity-30 ${isActive
                                    ? "bg-emerald-900 bg-opacity-30 border-l-2 border-white" : ""
                                }`
                            }
                        >
                            <FontAwesomeIcon
                                icon={item.icon}
                                className="text-base w-4"
                            />
                            <span className="text-sm">{item.name}</span>
                        </NavLink>
                    ))}

                    {/* Back Button */}
                    <button
                        onClick={() => {
                            handleLogout();
                            navigate("/");
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 hover:bg-emerald-900 hover:bg-opacity-30"
                    >
                        <FontAwesomeIcon
                            icon={faSignOutAlt}
                            className="text-base w-4 transition-transform hover:scale-110"
                        />
                        <span className="text-sm">Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-6 overflow-auto">
                <div className="bg-white shadow-md rounded-xl p-6 min-h-full">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default StaffLayout