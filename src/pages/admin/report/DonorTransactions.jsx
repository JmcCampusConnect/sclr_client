import React, { useEffect, useState } from "react";
import axios from "axios";
import DonorActionBar from "../../../components/DonorTransactions/DonorActionBar";
import DonorFilters from "../../../components/DonorTransactions/DonorFilters";
import DonorTable from "../../../components/DonorTransactions/DonorTable";
import Loading from "../../../assets/svg/Pulse.svg";

function DonorTransactions() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        donorId: "all",
        donorType: "all",
        fromDate: "", toDate: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`${apiUrl}/api/report/fetchDonorTransactions`);
                setTransactions(res.data.transactions || []);
            } catch (err) {
                console.error('Error fetching donor transactions : ', err);
                setError("Failed to load transactions. Please try again later.");
            } finally { setLoading(false) }
        };
        fetchData();
    }, [apiUrl]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
                <p className="text-gray-600 font-medium text-lg">Loading transactions...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Donor Transactions
                </h1>
            </header>
            <DonorFilters />
            <DonorActionBar transactions={transactions} setFilters={setFilters} filters={filters} />
            <DonorTable transactions={transactions} />
        </div>
    )
}

export default DonorTransactions;