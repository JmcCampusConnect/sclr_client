import React from 'react';
import { Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';

const DashboardPie = ({ cardData, pieData }) => {

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                color: '#fff',
                formatter: (value) => (value > 0.1 ? value.toFixed(1) + '%' : ''),
                font: { weight: 'bold', size: 13 },
            },
        },
    }

    const charts = [
        {
            title: 'Application Type Split',
            labels: [`Freshers (${cardData.totalFreshers})`, `Renewals (${cardData.totalRenewals})`],
            datasets: [{ data: [cardData.totalFreshers, cardData.totalRenewals], backgroundColor: ['#3B82F6', '#10B981'] }],
        },
        {
            title: 'Student Category Distribution',
            labels: [`Aided (${pieData.aidedCount})`, `SFM (${pieData.sfmCount})`, `SFW (${pieData.sfwCount})`],
            datasets: [{
                data: [
                    ((pieData.aidedCount ?? 0) / (cardData.totalApplicants || 1)) * 100,
                    ((pieData.sfmCount ?? 0) / (cardData.totalApplicants || 1)) * 100,
                    ((pieData.sfwCount ?? 0) / (cardData.totalApplicants || 1)) * 100,
                ],
                backgroundColor: ['#F59E0B', '#EF4444', '#8B5CF6'],
            }],
        },
        {
            title: 'Gender Distribution',
            labels: [
                `Men (${(pieData.aidedCount ?? 0) + (pieData.sfmCount ?? 0)})`,
                `Women (${pieData.sfwCount ?? 0})`,
            ],
            datasets: [{
                data: [
                    ((pieData.aidedCount ?? 0) + (pieData.sfmCount ?? 0)) / (cardData.totalApplicants || 1) * 100,
                    (pieData.sfwCount ?? 0) / (cardData.totalApplicants || 1) * 100,
                ],
                backgroundColor: ['#6366F1', '#EC4899'],
            }],
        },
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
        >
            {charts.map((c, idx) => (
                <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl shadow-md flex flex-col items-center border border-gray-200/40"
                >
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{c.title}</h3>
                    <div className="relative w-full h-[250px]">
                        <Pie data={c} options={pieOptions} />
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        {c.labels.map((label, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: c.datasets[0].backgroundColor[i] }}
                                ></div>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    )
}

export default DashboardPie;