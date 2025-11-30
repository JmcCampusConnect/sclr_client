import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeroSection from '../../components/LandingPage/HeroSection'
import StudentButtons from '../../components/StudentHome/StudentButtons'
const apiUrl = import.meta.env.VITE_API_URL;

function StudentHome() {

    const [dates, setDates] = useState(null);

    useEffect(() => {
        const fetchDates = async () => {
            const response = await axios.get(`${apiUrl}/api/application/settings/fetchDates`);
            setDates(response.data.dateRange);
        }
        fetchDates();
    }, [])

    return (
        <div className="w-screen h-screen p-6 pr-16 flex flex-col lg:flex-row items-center bg-blue-500 overflow-hidden 2xl:p-24 2xl:pr-40">            <div className="w-[65%] h-full relative flex flex-col justify-between items-center">
            <HeroSection />
        </div>
            <div className="w-[40%] flex flex-col justify-center items-center rounded-lg h-full">
                <StudentButtons applnEndDate={dates?.applnEndDate} />
            </div>
        </div>
    )
}

export default StudentHome;