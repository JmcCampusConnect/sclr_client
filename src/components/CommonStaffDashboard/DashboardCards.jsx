import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faGraduationCap, faMoneyCheckAlt, faHandsHelping } from '@fortawesome/free-solid-svg-icons';

const DASHBOARD_CARDS = [
    { icon: faUsers, label: 'Total Applications', key: 'totalApplicants', iconColor: 'text-blue-700', gradient: 'from-blue-200 to-blue-100' },
    { icon: faGraduationCap, label: 'Students Benefitted', key: 'totalBenefitedStudents', iconColor: 'text-emerald-700', gradient: 'from-emerald-200 to-emerald-100' },
    { icon: faMoneyCheckAlt, label: 'Scholarship Awarded', key: 'totalScholarshipAwarded', iconColor: 'text-amber-700', gradient: 'from-amber-200 to-amber-100' },
    { icon: faHandsHelping, label: 'Generous Donors', key: 'totalDonors', iconColor: 'text-indigo-700', gradient: 'from-indigo-200 to-indigo-100' },
];

const DashboardCards = ({ cardData }) => {

    const formatCurrency = (amount) =>
        typeof amount === 'number'
            ? new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount)
            : 'N/A';

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            {DASHBOARD_CARDS.map(({ icon, label, key, iconColor, gradient }, i) => (
                <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className={`relative overflow-hidden rounded-2xl shadow-md bg-gradient-to-br ${gradient} 
                    backdrop-blur-md border border-gray-200/40 p-6 flex flex-col gap-5
                    hover:shadow-lg hover:scale-[1.02] transition-transform`}
                >
                    <div className={`flex items-center justify-center w-14 h-14 rounded-xl bg-white/60 backdrop-blur-sm shadow-inner`}>
                        <FontAwesomeIcon icon={icon} className={`text-2xl ${iconColor}`} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className="text-md text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider">{label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {key === 'totalScholarshipAwarded'
                                ? formatCurrency(cardData[key])
                                : (cardData[key] ?? 0).toLocaleString()}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

export default DashboardCards;