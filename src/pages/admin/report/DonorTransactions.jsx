import React, { useEffect, useState } from "react";
import axios from "axios";

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

            <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                <div className="max-h-[700px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
                        <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
                            <tr>
                                {[
                                    "Donor ID",
                                    "Donor Name",
                                    "Type",
                                    "General",
                                    "Zakkath",
                                    "Date",
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-4 py-4 text-gray-600 dark:text-gray-300"
                                    >
                                        Loading transactions...
                                    </td>
                                </tr>
                            ) : transactions.length > 0 ? (
                                transactions.map((txn) => (
                                    <tr
                                        key={txn._id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
                                    >
                                        <td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
                                            {txn.donorId}
                                        </td>

                                        <td className="text-nowrap px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                            {txn.donorName}
                                        </td>

                                        <td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300 capitalize">
                                            {txn.donorType}
                                        </td>

                                        <td className="px-4 py-4 text-sm lg:text-base text-green-600 dark:text-green-400 font-semibold">
                                            ₹{txn.generalAmt}
                                        </td>

                                        <td className="px-4 py-4 text-sm lg:text-base text-indigo-600 dark:text-indigo-400 font-semibold">
                                            ₹{txn.zakkathAmt}
                                        </td>

                                        <td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
                                            {new Date(txn.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300"
                                    >
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DonorTransactions;