import React, { useEffect, useState } from "react";
import axios from "axios";
import DonorActionBar from "../../../components/DonorTransactions/DonorActionBar";
import DonorFilters from "../../../components/DonorTransactions/DonorFilters";
import DonorTable from "../../../components/DonorTransactions/DonorTable";
import DonorDeleteModal from "../../../components/DonorTransactions/DonorDeleteModal";

function DonorTransactions() {

    const apiUrl = import.meta.env.VITE_API_URL;

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/report/fetchDonorTransactions`);
                setTransactions(res.data.transactions || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [apiUrl]);

    const handleDeleteClick = (donor) => {
        setSelectedDonor(donor);
        setShowDeleteModal(true);
    };

    const handleDeleted = (donorId) => {
        setTransactions(prev =>
            prev.filter(t => t.donorId !== donorId)
        );
    };

    return (
        <div className="space-y-6">

            <header className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Donor Transactions
                </h1>
            </header>

            <DonorFilters />
            <DonorActionBar transactions={transactions} />

            <DonorTable
                transactions={transactions}
                loading={loading}
                onDelete={handleDeleteClick}
            />

            {showDeleteModal && (
                <DonorDeleteModal
                    donor={selectedDonor}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedDonor(null);
                    }}
                    onDeleted={handleDeleted}
                />
            )}

        </div>
    )
}

export default DonorTransactions;