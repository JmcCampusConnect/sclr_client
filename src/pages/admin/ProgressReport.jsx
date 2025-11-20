import React, { useState, useEffect } from "react";
import axios from "axios";
import ProgressReportTable from "../../components/ProgressReport/ProgressReportTable";
import Loading from "../../assets/svg/Pulse.svg";

function ProgressReport() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCounts = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/progressReport/fetchCounts`);
            setData(response.data);
        } catch (err) {
            console.error("Error fetching report : ", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCounts();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
                <p className="text-gray-600 font-medium text-lg">Loading distribution statement...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-600 font-semibold">Failed to load progress report.</p>
            </div>
        )
    }

    const rows = [
        { type: "COE Report", ...data.coe },
        { type: "Class Attendance", ...data.attendance },
        { type: "Deeniyath & Moral", ...data.deeniyath },
        { type: "Govt. Scholarship", ...data.sclr },
        { type: "Tutor Verification", ...data.tutor },
    ];

    return (
        <div className="">
            <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Progress Report Overview
                </h1>
            </header>
            <ProgressReportTable rows={rows} />
        </div>
    )
}

export default ProgressReport;
