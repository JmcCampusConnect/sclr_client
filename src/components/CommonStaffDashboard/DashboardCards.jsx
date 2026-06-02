import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faGraduationCap, faMoneyCheckAlt, faHandsHelping } from '@fortawesome/free-solid-svg-icons';

const DASHBOARD_CARDS = [
    {
        icon: faUsers,
        label: 'Total Applications',
        key: 'totalApplicants',
        iconColor: 'text-blue-600 dark:text-blue-400',
        badgeBg: 'bg-blue-50 dark:bg-blue-950/50',
    },
    {
        icon: faGraduationCap,
        label: 'Students Benefitted',
        key: 'totalBenefitedStudents',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
        icon: faMoneyCheckAlt,
        label: 'Scholarship Awarded',
        key: 'totalScholarshipAwarded',
        iconColor: 'text-amber-600 dark:text-amber-400',
        badgeBg: 'bg-amber-50 dark:bg-amber-950/50',
    },
    {
        icon: faHandsHelping,
        label: 'Generous Donors',
        key: 'totalDonors',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        badgeBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    },
];

const DashboardCards = ({ cardData = {} }) => {

    const formatCurrency = (amount) =>
        typeof amount === 'number'
            ? new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount)
            : 'N/A';

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            {DASHBOARD_CARDS.map(({ icon, label, key, iconColor, badgeBg, colorStyles }, i) => (
                <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className={`group relative bg-white dark:bg-slate-900 bg-gradient-to-br via-transparent to-100%
                    border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 
                    flex flex-col gap-5 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.03)]
                    hover:shadow-[0_12px_24px_-6px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.02)]
                    transition-all duration-300 ease-out`}
                >
                    {/* Icon Box with Smooth Scale effect on card hover */}
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${badgeBg} 
                    border border-slate-100 dark:border-slate-800/40 shadow-sm
                    transition-transform duration-300 group-hover:scale-105`}>
                        <FontAwesomeIcon icon={icon} className={`text-lg ${iconColor}`} />
                    </div>

                    {/* Typography Stack */}
                    <div className="flex flex-col gap-1">
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            {label}
                        </p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                            {key === 'totalScholarshipAwarded'
                                ? formatCurrency(cardData[key])
                                : (cardData[key] ?? 0).toLocaleString()}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default DashboardCards;