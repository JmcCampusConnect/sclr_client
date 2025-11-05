import React, { useState, useEffect } from 'react'
import axios from "axios";
import DistributionTable from '../../components/DistributionStmt/DistributionTable';
import FilterSection from '../../components/DistributionStmt/FilterSection';
import ActionBar from '../../components/DistributionStmt/ActionBar';
import StatusCard from '../../components/DistributionStmt/StatusCard';
const apiUrl = import.meta.env.VITE_API_URL;

function DistributionStmt() {

    const [distribution, setDistribution] = useState([]);

    useEffect(() => {
        const fetchDistribution = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/distribution/fetchDistribution`);
                setDistribution(response.data.distributions);
            } catch (error) {
                console.error(error);
            }
        }
        fetchDistribution();
    }, []);

    return (
        <>
            {/* Header */}
            <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Distribution Statement
                </h1>
            </header>
            <FilterSection />
            <ActionBar />
            <DistributionTable distribution={distribution} />
            <StatusCard />
        </>
    )
}

export default DistributionStmt;