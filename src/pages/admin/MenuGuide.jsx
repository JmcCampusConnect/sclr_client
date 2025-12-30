import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChalkboard, faTools, faChartBar, faHandHoldingUsd,
    faHistory, faShieldAlt, faCircleInfo, faUserShield,
    faUserGraduate, faUserTie, faChevronRight, faIdCard,
    faChartLine,
} from '@fortawesome/free-solid-svg-icons';

function MenuGuide() {

    const [activeTab, setActiveTab] = useState('common');

    const menuContent = {
        common: [
            {
                title: 'Dashboard',
                icon: faChalkboard,
                color: 'text-blue-600',
                badge: 'All Roles',
                desc: 'Your central hub for real-time scholarship tracking.',
                details: [
                    'View overall statistics including total applications and benefitted students.',
                    'Analyze distribution through interactive pie charts (Category/Gender).',
                    'Track year-wise application flow for both UG and PG students.',
                    'Monitor scholarship activity specifically for the current academic year.'
                ]
            },
            {
                title: 'Change Password',
                icon: faTools,
                color: 'text-amber-600',
                badge: 'Security',
                desc: 'Update and manage your account access credentials.',
                details: [
                    'Secure password modification with real-time matching validation.',
                    'Instant system-wide update upon successful submission.',
                    'Appropriate feedback messages for errors or success.'
                ]
            }
        ],
        admin: [
            {
                title: 'Check Application Status',
                icon: faIdCard,
                color: 'text-blue-600',
                badge: 'Admin Only',
                desc: 'Check and manage student scholarship application status.',
                details: [
                    'Search student application using register number.',
                    'View application status with complete student and academic details.',
                    'Approve and release scholarship if the student is eligible.'
                ]
            },
            {
                title: 'Work Progress Report',
                icon: faChartLine,
                color: 'text-green-600',
                badge: 'Admin / Staff',
                desc: 'Tracks semester-wise completion status of application verification processes.',
                details: [
                    'Displays finished, pending, and total counts for each verification stage.',
                    'Supports Odd, Even, and All semester filtering.',
                    'Covers COE marks, attendance, Deeniyath/Moral, scholarship, and tutor verification.'
                ]
            },
            {
                title: 'Funds Available (Reports)',
                icon: faHandHoldingUsd,
                color: 'text-emerald-600',
                badge: 'Admin Only',
                desc: 'Real-time financial oversight of General and Zakat funds.',
                details: [
                    'Displays opening balance and current available liquid funds.',
                    'View donor-wise fund details (ID, Type, and individual balances).',
                    'Search and filter donors quickly by name or ID.',
                    'Auto-calculates utilization from real-time distribution records.'
                ]
            },
            {
                title: 'Donor Transactions (Reports)',
                icon: faHistory,
                color: 'text-purple-600',
                badge: 'Admin Only',
                desc: 'Detailed ledger of all financial contributions received.',
                details: [
                    'Comprehensive list of all transactions for the current session.',
                    'Detailed tracking of Donor Name, Type, and specific Zakat/General amounts.',
                    'Filter by donor type or date range for periodic audit reports.'
                ]
            },
        ],
        staff: [
            {
                title: 'Staff Portal Coming Soon',
                icon: faUserTie,
                color: 'text-slate-400',
                badge: 'Pending',
                desc: 'Staff-specific management tools are being prepared.',
                details: ['Application verification tools.', 'Student counseling logs.', 'Departmental report access.']
            }
        ],
        student: [
            {
                title: 'Student Portal Coming Soon',
                icon: faUserGraduate,
                color: 'text-slate-400',
                badge: 'Pending',
                desc: 'Student-specific scholarship tracking.',
                details: ['Application status tracking.', 'Document upload center.', 'History of received benefits.']
            }
        ]
    };

    const TabButton = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-t-lg font-bold transition-all border-b-2 ${activeTab === id
                ? 'bg-white text-emerald-700 border-emerald-600 shadow-sm'
                : 'bg-gray-50 text-gray-400 border-transparent hover:text-gray-600'
                }`}
        >
            <FontAwesomeIcon icon={icon} className="text-sm" />
            <span className="text-sm uppercase tracking-wide">{label}</span>
        </button>
    );

    return (
        <div className="p-6">
            {/* Page Title */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        <FontAwesomeIcon icon={faCircleInfo} className="text-emerald-600 mr-3" />
                        Navigation & Usage Guide
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Select a role to view available menu functionalities.</p>
                </div>
                <div className="hidden md:block">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                        JMC Alumni Scholarship
                    </span>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-8">
                <TabButton id="common" label="Common" icon={faUserShield} />
                <TabButton id="admin" label="Admin" icon={faChartBar} />
                <TabButton id="staff" label="Staff" icon={faUserTie} />
                <TabButton id="student" label="Student" icon={faUserGraduate} />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {menuContent[activeTab].map((item, idx) => (
                    <div key={idx} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all border-l-4" style={{ borderLeftColor: 'currentColor' }}>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gray-50 ${item.color} group-hover:scale-110 transition-transform`}>
                                    <FontAwesomeIcon icon={item.icon} size="lg" />
                                </div>
                                <span className="text-[10px] font-extrabold px-2 py-1 rounded bg-gray-100 text-gray-500 uppercase">
                                    {item.badge}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2 italic mt-4">"{item.desc}"</p>

                            <ul className="space-y-3 border-t border-gray-50 pt-1">
                                {item.details.map((detail, dIdx) => (
                                    <li key={dIdx} className="flex items-start text-sm text-gray-600 group/item">
                                        <FontAwesomeIcon
                                            icon={faChevronRight}
                                            className="mt-1 mr-3 text-[10px] text-emerald-500 opacity-50 group-hover/item:opacity-100 transition-opacity"
                                        />
                                        <span>{detail}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {/* Role Disclaimer */}
            <div className="mt-10 p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                    <FontAwesomeIcon icon={faShieldAlt} />
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                    <strong>Note:</strong> Some menus are restricted based on your assigned permissions. If you are an <strong>Admin</strong>, you have access to both Common and Reporting tabs. Staff and Students are restricted to their respective modules.
                </p>
            </div>
        </div>
    )
}

export default MenuGuide;