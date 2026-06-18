import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faGraduationCap, faMoneyCheckAlt, faHandsHelping } from '@fortawesome/free-solid-svg-icons';

const DASHBOARD_CARDS = [
    {
        icon: faUsers,
        label: 'Total Applications',
        key: 'totalApplicants',
        cardBg: 'bg-blue-100/90 border-blue-200 dark:bg-blue-950/60 dark:border-blue-900/60 hover:bg-blue-200/60 dark:hover:bg-blue-900/40',
        labelColor: 'text-blue-800 dark:text-blue-300/90',
        valueColor: 'text-blue-950 dark:text-blue-50',
        badgeBg: 'bg-blue-600 text-white dark:bg-blue-500',
    },
    {
        icon: faGraduationCap,
        label: 'Students Benefitted',
        key: 'totalBenefitedStudents',
        cardBg: 'bg-emerald-100/90 border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-900/60 hover:bg-emerald-200/60 dark:hover:bg-emerald-900/40',
        labelColor: 'text-emerald-800 dark:text-emerald-300/90',
        valueColor: 'text-emerald-950 dark:text-emerald-50',
        badgeBg: 'bg-emerald-600 text-white dark:bg-emerald-500',
    },
    {
        icon: faMoneyCheckAlt,
        label: 'Scholarship Awarded',
        key: 'totalScholarshipAwarded',
        cardBg: 'bg-amber-100/90 border-amber-200 dark:bg-amber-950/50 dark:border-amber-900/50 hover:bg-amber-200/60 dark:hover:bg-amber-900/40',
        labelColor: 'text-amber-800 dark:text-amber-300/90',
        valueColor: 'text-amber-950 dark:text-amber-50',
        badgeBg: 'bg-amber-600 text-white dark:bg-amber-500',
    },
    {
        icon: faHandsHelping,
        label: 'Generous Donors',
        key: 'totalDonors',
        cardBg: 'bg-indigo-100/90 border-indigo-200 dark:bg-indigo-950/60 dark:border-indigo-900/60 hover:bg-indigo-200/60 dark:hover:bg-indigo-900/40',
        labelColor: 'text-indigo-800 dark:text-indigo-300/90',
        valueColor: 'text-indigo-950 dark:text-indigo-50',
        badgeBg: 'bg-indigo-600 text-white dark:bg-indigo-500',
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
            {DASHBOARD_CARDS.map(({ icon, label, key, cardBg, labelColor, valueColor, badgeBg }, i) => (
                <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className={`group relative border rounded-xl p-4 
                        flex items-center justify-between gap-4 shadow-sm
                        transition-all duration-200 ease-in-out ${cardBg}`}
                >
                    {/* Left Side: Typography Stack */}
                    <div className="flex-1 flex flex-col justify-center gap-1 min-w-0">
                        <p className={`text-[11px] font-bold uppercase tracking-wider truncate select-none ${labelColor}`}>
                            {label}
                        </p>
                        <p className={`text-2xl font-bold tracking-tight font-sans truncate ${valueColor}`}>
                            {key === 'totalScholarshipAwarded'
                                ? formatCurrency(cardData[key])
                                : (cardData[key] ?? 0).toLocaleString('en-IN')}
                        </p>
                    </div>

                    {/* Right Side: Color Badge occupying full height of the text block */}
                    <div className={`flex items-center justify-center w-12 self-stretch rounded-lg shadow-sm
                        transition-transform duration-200 group-hover:scale-[1.02] ${badgeBg}`}
                    >
                        <FontAwesomeIcon icon={icon} className="text-lg" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default DashboardCards;