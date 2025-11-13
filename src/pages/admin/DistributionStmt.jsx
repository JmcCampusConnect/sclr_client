import React, { useState, useEffect } from "react";
import axios from "axios";
import DistributionTable from "../../components/DistributionStmt/DistributionTable";
import FilterSection from "../../components/DistributionStmt/FilterSection";
import ActionBar from "../../components/DistributionStmt/ActionBar";
import StatusCard from "../../components/DistributionStmt/StatusCard";
import Loading from "../../assets/svg/Pulse.svg";

const apiUrl = import.meta.env.VITE_API_URL;

function DistributionStmt() {
    const [distribution, setDistribution] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDistribution = async () => {

            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${apiUrl}/api/distribution/fetchDistribution`);
                setDistribution(response.data.distributions);
            } catch (error) {
                console.error("Error fetching distribution data:", error);
                setError("Failed to load distribution data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDistribution();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
                <p className="text-gray-600 font-medium text-lg">Loading distribution statement...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
        )
    }

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
    );
}

export default DistributionStmt;