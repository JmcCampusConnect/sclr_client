import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChalkboard, faTools, faHandHoldingUsd, faHistory,
    faTrashAlt, faCircleInfo, faUserGraduate, faUserTie,
    faIdCard, faChartLine, faHandHoldingHeart, faCalendarAlt,
    faCalendarCheck, faUsers, faUserShield, faChartBar,
    faChalkboardTeacher, faBuilding, faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

function MenuGuide() {

    const [activeTab, setActiveTab] = useState('common');

    const menuContent = {
        common: [
            {
                title: 'Dashboard',
                icon: faChalkboard,
                gradient: 'from-blue-500 to-indigo-600',
                badge: 'Unified Access',
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
                gradient: 'from-amber-400 to-orange-500',
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
                title: 'Scholarship Administration',
                icon: faGraduationCap,
                gradient: 'from-pink-500 to-pink-700',
                badge: 'Admin',
                desc: 'Review, filter, approve, reject, and distribute scholarships for the active academic year.',
                details: [
                    'View all scholarship applications for the current academic year.',
                    'Advanced filtering by status, type, tutor verification, and special categories.',
                    'Search applications by register number, name, or department.',
                    'View complete student and application details.',
                    'Approve applications and distribute scholarships with donor allocation.',
                    'Automatically update donor balances and credited amounts.',
                    'Reject individual applications with recorded reasons.',
                    'Quick rejection for bulk rejection of pending applications.',
                    'Track last-year and current-year credited scholarship amounts.',
                    'All actions are academic-year scoped and permanent.'
                ]
            },
            {
                title: 'Check Status',
                icon: faIdCard,
                gradient: 'from-purple-400 to-purple-700',
                badge: 'Verification',
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
                gradient: 'from-yellow-400 to-yellow-600',
                badge: 'Analytics',
                desc: 'Tracks semester-wise completion status of application verification processes.',
                details: [
                    'Displays finished, pending, and total counts for each verification stage.',
                    'Supports Odd, Even, and All semester filtering.',
                    'Covers COE marks, attendance, Deeniyath/Moral, scholarship, and tutor verification.'
                ]
            },
            {
                title: 'Distribution Statement',
                icon: faHandHoldingHeart,
                gradient: 'from-red-400 to-red-600',
                badge: 'Funds',
                desc: 'Scholarship distribution tracking for students.',
                details: [
                    'View and manage scholarship amounts distributed to students for the academic year.',
                    'Tracks donor-wise General/Zakat allocations with automatic balance adjustments.',
                    'Provides summary cards for applicants, beneficiaries, awarded funds, and total distribution.'
                ]
            },
            {
                title: 'Donor Manage (Manage)',
                icon: faUsers,
                gradient: 'from-teal-400 to-teal-600',
                badge: 'Donor Relations',
                desc: 'Complete management of donors, funds, and transactions.',
                details: [
                    'Create, update, and remove donor profiles with full contact and identity details.',
                    'Manage donor funds including adding, editing, and deleting General and Zakkath transactions.',
                    'Automatically updates donor balances and syncs changes across transactions and distributions.',
                    'View detailed transaction history with date-wise records for each donor.',
                    'Ensures academic year–based data separation and accurate financial tracking.'
                ]
            },
            {
                title: 'Application Manage (Manage)',
                icon: faIdCard,
                gradient: 'from-indigo-400 to-indigo-700',
                badge: 'Admin / Office',
                desc: 'View, filter, edit, and manage student scholarship applications for the active academic year.',
                details: [
                    'View all applications for the current academic year.',
                    'Filter by category, department, batch, and semester.',
                    'Search applications by register number or name.',
                    'Edit application, student, and academic details.',
                    'Delete individual applications when required.'
                ]
            },
            {
                title: 'Student Manage (Manage)',
                icon: faUserGraduate,
                gradient: 'from-cyan-400 to-cyan-700',
                badge: 'Admin / Office',
                desc: 'Manage student records, access control, and semester-based eligibility.',
                details: [
                    'View and manage all student records in a centralized table.',
                    'Filter students by category, department, and semester-based status.',
                    'Search students quickly using register number or name.',
                    'Update student passwords securely.',
                    'Enable or disable semester-based eligibility for students.'
                ]
            },
            {
                title: 'Tutor Manage (Manage)',
                icon: faChalkboardTeacher,
                gradient: 'from-green-400 to-green-700',
                badge: 'Admin',
                desc: 'Manage tutor profiles, assignments, and academic responsibilities.',
                details: [
                    'View and manage all tutor records in a centralized system.',
                    'Filter tutors by category, department, and batch.',
                    'Search tutors quickly using staff ID or name.',
                    'Add, edit, and update tutor details as required.',
                    'Remove tutor records securely when no longer needed.'
                ]
            },
            {
                title: 'Staff Manage (Manage)',
                icon: faUserTie,
                gradient: 'from-orange-400 to-orange-700',
                badge: 'Admin',
                desc: 'Manage staff login details and basic profile information.',
                details: [
                    'View all registered staff members in a centralized list.',
                    'Search staff quickly using Staff ID or Staff Name.',
                    'Edit and update staff name and password securely.',
                    'Maintain controlled access by managing staff credentials.',
                    'Ensure staff records stay updated and consistent.'
                ]
            },
            {
                title: 'Department Management',
                icon: faBuilding,
                gradient: 'from-fuchsia-400 to-fuchsia-700',
                badge: 'Admin',
                desc: 'Centralized management of academic departments.',
                details: [
                    'View and manage the complete list of departments.',
                    'Add new departments with unique code and name.',
                    'Edit existing department details when required.',
                    'Delete departments securely with confirmation.',
                    'Search departments quickly by code or name.'
                ]
            },
            {
                title: 'Application Date (Settings)',
                icon: faCalendarAlt,
                gradient: 'from-lime-400 to-lime-700',
                badge: 'Lifecycle',
                desc: 'Control application open and close dates.',
                details: [
                    'Set the start and end dates for student applications.',
                    'Automatically applies dates to the current academic year.',
                    'Prevents applications outside the configured date range.'
                ]
            },
            {
                title: 'Academic Year (Settings)',
                icon: faCalendarCheck,
                gradient: 'from-pink-300 to-pink-600',
                badge: 'Core Config',
                desc: 'Manage academic years and activation status.',
                details: [
                    'Create, edit, and delete academic years with application date ranges.',
                    'Set one academic year as active while automatically deactivating others.',
                    'Controls application availability and resets student semester-based settings.'
                ]
            },
            {
                title: 'Funds Available (Reports)',
                icon: faHandHoldingUsd,
                gradient: 'from-indigo-300 to-indigo-600',
                badge: 'Financials',
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
                gradient: 'from-red-300 to-red-600',
                badge: 'Audit Trail',
                desc: 'Detailed ledger of all financial contributions received.',
                details: [
                    'Comprehensive list of all transactions for the current session.',
                    'Detailed tracking of Donor Name, Type, and specific Zakat/General amounts.',
                    'Filter by donor type or date range for periodic audit reports.'
                ]
            },
            {
                title: 'Data Deletion',
                icon: faTrashAlt,
                gradient: 'from-gray-500 to-gray-800',
                badge: 'Critical Admin Action',
                desc: 'Permanently delete academic-year–based records across system modules with admin verification.',
                details: [
                    'Delete records by academic year across multiple modules.',
                    'Supports purge of non-admin staff assignments.',
                    'Admin password confirmation required.',
                    'Shows selection count and deletion summary.',
                    'Permanent and irreversible action.'
                ]
            }
        ],
        staff: [
            {
                title: 'Staff Portal Coming Soon',
                icon: faUserTie,
                gradient: 'from-slate-400 to-slate-600',
                badge: 'Upcoming',
                desc: 'Staff-specific management tools are being prepared.',
                details: ['Application verification tools.', 'Student counseling logs.', 'Departmental report access.']
            }
        ],
        student: [
            {
                title: 'Student Portal Coming Soon',
                icon: faUserGraduate,
                gradient: 'from-slate-400 to-slate-600',
                badge: 'Upcoming',
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
        <div className="text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">

            {/* Minimalist Top Nav */}
            <div className="p-2">
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
                <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-12">
                    <TabButton id="common" label="Common" icon={faUserShield} />
                    <TabButton id="admin" label="Admin" icon={faChartBar} />
                    <TabButton id="staff" label="Staff" icon={faUserTie} />
                    <TabButton id="student" label="Student" icon={faUserGraduate} />
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {menuContent[activeTab].map((item, idx) => (
                        <div
                            key={idx}
                            className="group relative bg-white rounded-[2rem] border border-slate-200 p-8 transition-all duration-500 hover:border-emerald-200 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]"
                        >
                            {/* Decorative Icon Hook */}
                            <div className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-2xl shadow-lg flex items-center justify-center text-white transition-transform duration-500`}>
                                <FontAwesomeIcon icon={item.icon} size="lg" />
                            </div>

                            <div className="mb-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 transition-colors">
                                    {item.badge}
                                </span>
                                <h3 className="text-2xl font-bold mt-1 text-slate-800 tracking-tight">
                                    {item.title}
                                </h3>
                            </div>

                            <p className="text-slate-500 text-sm leading-relaxed mb-8 min-h-[40px]">
                                {item.desc}
                            </p>

                            <div className="space-y-4">
                                {item.details.map((detail, dIdx) => (
                                    <div key={dIdx} className="flex gap-4 group/line">
                                        <div className="mt-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/line:bg-emerald-500 transition-colors" />
                                        </div>
                                        <p className="text-[13.5px] text-slate-600 leading-snug font-medium group-hover/line:text-slate-900 transition-colors">
                                            {detail}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Subtle background number */}
                            <div className="absolute bottom-4 right-8 text-slate-50 text-6xl font-black pointer-events-none select-none">
                                0{idx + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MenuGuide;