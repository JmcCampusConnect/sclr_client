
import React, { useEffect, useState } from "react";
import axios from "axios";
import DonorActionBar from "../../../components/DonorTransactions/DonorActionBar";
import DonorFilters from "../../../components/DonorTransactions/DonorFilters";
import DonorTable from "../../../components/DonorTransactions/DonorTable";
import Loading from "../../../assets/svg/Pulse.svg";

function DonorTransactions() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        donorTypes: { all: true, wellWishers: true, alumni: true, others: true },
        donorId: "all", fromDate: "", toDate: "",
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

    // Apply filters whenever filters, transactions, or searchTerm change

    useEffect(() => {

        let result = [...transactions];

        // Filter by donor type
        const selectedTypes = [];
        if (filters.donorTypes.wellWishers) selectedTypes.push("Well Wishers");
        if (filters.donorTypes.alumni) selectedTypes.push("Alumini");
        if (filters.donorTypes.others) selectedTypes.push("Others");

        const allSelected = filters.donorTypes.wellWishers && filters.donorTypes.alumni && filters.donorTypes.others;

        // If none selected -> no results
        if (selectedTypes.length === 0) {
            result = [];
        } else if (!allSelected) {
            // Filter by selected types
            result = result.filter(txn => selectedTypes.includes(txn.donorType));
        }

        // Filter by donor ID
        if (filters.donorId !== "all") {
            result = result.filter(txn => txn.donorId === filters.donorId);
        }

        // Filter by date range
        if (filters.fromDate) {
            const fromDate = new Date(filters.fromDate);
            result = result.filter(txn => new Date(txn.createdAt) >= fromDate);
        }
        if (filters.toDate) {
            const toDate = new Date(filters.toDate);
            toDate.setHours(23, 59, 59, 999);
            result = result.filter(txn => new Date(txn.createdAt) <= toDate);
        }

        // Search filter (searches in displayed filtered data)
        if (searchTerm.trim()) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            result = result.filter(txn =>
                txn.donorId.toLowerCase().includes(lowerSearchTerm) ||
                txn.donorName.toLowerCase().includes(lowerSearchTerm) ||
                txn.donorType.toLowerCase().includes(lowerSearchTerm)
            );
        }

        setFilteredTransactions(result);
    }, [filters, transactions, searchTerm]);

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
            <DonorFilters filters={filters} setFilters={setFilters} />
            <DonorActionBar
                transactions={filteredTransactions}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
            <DonorTable transactions={filteredTransactions} />
        </div>
    )
}

export default DonorTransactions;