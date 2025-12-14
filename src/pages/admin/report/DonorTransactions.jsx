import React, { useEffect, useState } from "react";
import axios from "axios";
import DonorFilters from "../../../components/DonorTransactions/DonorFilters";
import DonorActionBar from "../../../components/DonorTransactions/DonorActionBar";
import DonorTable from "../../../components/DonorTransactions/DonorTable";

function DonorTransactions() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/report/fetchDonorTransactions`);
                setTransactions(response.data.transactions || []);
            } catch (error) {
                console.error("Error fetching transactions : ", error);
            } finally { setLoading(false) }
        };
        fetchData();
    }, [apiUrl]);

    return (
        <div className="relative space-y-6">

            <header className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Donor Transactions
                </h1>
            </header>

            <DonorFilters />
            <DonorActionBar transactions={transactions} />

            <DonorTable
                loading={loading}
                transactions={transactions}
            />

        </div>
    );
}

export default DonorTransactions;