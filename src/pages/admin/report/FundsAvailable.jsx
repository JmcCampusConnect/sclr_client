import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Wallet, Users, Database } from "lucide-react";

import StatCard from "../../../components/FundsAvailable/StatCard";
import DonorTable from "../../../components/FundsAvailable/DonorTable";
import DonorSearchBar from "../../../components/FundsAvailable/DonorSearchBar";
import ButtonsBar from "../../../components/FundsAvailable/ButtonsBar";

const primaryButtonClass = "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md";
const secondaryButtonClass = "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 transition";
const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

function FundsAvailable() {

    const [donors, setDonors] = useState([]);
    const [data, setData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [donorResponse, dashboardResponse] = await Promise.all([
                    axios.get(`${apiUrl}/api/report/fetchDonors`),
                    axios.get(`${apiUrl}/api/report/fetchCardsData`),
                ]);
                setDonors(donorResponse.data.donors);
                setData(dashboardResponse.data || {});
            } catch (err) {
                console.error("Error fetching donor and cards data : ", err);
            }
        };
        fetchData();
    }, [apiUrl]);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
        }).format(amount || 0);

    const filteredDonors = donors.filter(
        (d) =>
            d.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.donorId?.toString().includes(searchTerm) ||
            d.donorType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDownloadExcel = () => {
        const ws = XLSX.utils.json_to_sheet(donors);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Donors");
        const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
        saveAs(new Blob([wbout], { type: "application/octet-stream" }), "FundsAvailable.xlsx");
    };

    const openGeneral = data?.generalAmt || 0;
    const openZakat = data?.zakkathAmt || 0;
    const totalGeneral = data?.generalBal || 0;
    const totalZakat = data?.zakkathBal || 0;

    return (
        <div className="relative space-y-6">
            <header className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Funds Available
                </h1>
            </header>

            <ButtonsBar
                primaryButtonClass={primaryButtonClass}
                secondaryButtonClass={secondaryButtonClass}
                handleDownloadExcel={handleDownloadExcel}
            />

            <DonorSearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                donorCount={filteredDonors.length}
                formControlClass={formControlClass}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                <StatCard
                    icon={Wallet}
                    title="Opening Balance"
                    color="text-orange-600"
                    bgColor="bg-orange-50"
                    stats={{
                        mainValue: formatCurrency(openGeneral + openZakat),
                        subLabel: "Opening Balance",
                        details: [
                            { label: "General", value: formatCurrency(openGeneral) },
                            { label: "Zakat", value: formatCurrency(openZakat) },
                        ],
                    }}
                />
                <StatCard
                    icon={Users}
                    title="Students Benefitted"
                    color="text-indigo-600"
                    bgColor="bg-indigo-50"
                    stats={{
                        mainValue: data?.studentsBenefitted || "0",
                        subLabel: "Scholarship Distribution",
                        details: [
                            { label: "Total Students", value: data?.totalStudents || "0" },
                            { label: "Departments", value: data?.totalDepartments || "0" },
                        ],
                    }}
                />
                <StatCard
                    icon={Database}
                    title="Fund Available"
                    color="text-green-600"
                    bgColor="bg-green-50"
                    stats={{
                        mainValue: formatCurrency(totalGeneral + totalZakat),
                        subLabel: "Current Balance",
                        details: [
                            { label: "General", value: formatCurrency(totalGeneral) },
                            { label: "Zakat", value: formatCurrency(totalZakat) },
                        ],
                    }}
                />
            </div>
            <DonorTable donors={filteredDonors} formatCurrency={formatCurrency} />
        </div>
    )
}

export default FundsAvailable;
