import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import DashboardCards from '../../components/CommonStaffDashboard/DashboardCards';
import DashboardPie from '../../components/CommonStaffDashboard/DashboardPie';
import DashboardError from '../../components/CommonStaffDashboard/DashboardError';
import { Bar } from 'react-chartjs-2';
import DashboardBar from '../../components/CommonStaffDashboard/DashboardBar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, ChartDataLabels);

const CommonStaffDashboard = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [cardData, setCardData] = useState(null);
    const [pieData, setPieData] = useState(null);
    const [enrollmentData, setEnrollmentData] = useState(null);
    const [distributedData, setDistributedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cardRes, pieRes, barRes] = await Promise.all([
                    axios.get(`${apiUrl}/api/dashboard/fetchCardData`),
                    axios.get(`${apiUrl}/api/dashboard/fetchPieData`),
                    axios.get(`${apiUrl}/api/dashboard/fetchBarData`)
                ]);
                const c = cardRes.data;
                setCardData({
                    totalApplicants: (c?.totalFreshers ?? 0) + (c?.totalRenewals ?? 0),
                    totalFreshers: c?.totalFreshers ?? 0,
                    totalRenewals: c?.totalRenewals ?? 0,
                    totalBenefitedStudents: c?.totalBenefitedStudents ?? 0,
                    totalScholarshipAwarded: c?.totalScholarshipAwarded ?? 0,
                    totalDonors: c?.totalDonors ?? 0,
                });
                setPieData(pieRes.data);
                setEnrollmentData(barRes.data.enrollment);
                setDistributedData(barRes.data.distributed)
            } catch (err) {
                console.error('Error fetching dashboard data : ', err);
                setError('Unable to load dashboard data.');
            } finally { setLoading(false) }
        };
        fetchData();
    }, [apiUrl]);


    if (loading) return <DashboardError type="loading" />;
    if (error) return <DashboardError type="error" message={error} />;
    if (!pieData || !cardData || !enrollmentData || !distributedData) return null;

    return (
        <section className="transition-colors">
            <DashboardCards cardData={cardData} />
            <DashboardPie cardData={cardData} pieData={pieData} />
            <DashboardBar enrollmentData={enrollmentData} distributedData={distributedData} />
        </section>
    )
}

export default CommonStaffDashboard;