import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Wallet, Users, Database } from "lucide-react";

import StatCard from "../../../components/FundsAvailable/StatCard";
import DonorTable from "../../../components/FundsAvailable/DonorTable";
import DonorSearchBar from "../../../components/FundsAvailable/DonorSearchBar";
import ButtonsBar from "../../../components/FundsAvailable/ButtonsBar";
import Loading from "../../../assets/svg/Pulse.svg";

const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

function FundsAvailable() {

    const [donors, setDonors] = useState([]);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("");
    const [showOnlyWithFunds, setShowOnlyWithFunds] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [donorResponse, dashboardResponse] = await Promise.all([
                    axios.get(`${apiUrl}/api/report/fetchDonors`),
                    axios.get(`${apiUrl}/api/report/fetchCardsData`),
                ]);
                const sortedDonors = [...donorResponse.data.donors].sort(
                    (a, b) => Number(a.donorId) - Number(b.donorId)
                );
                setDonors(sortedDonors);
                setData(dashboardResponse.data || {});
            } catch (err) {
                console.error("Error fetching donor and cards data:", err);
                setError("Failed to load funds data. Please try again later.");
            } finally {
                setIsLoading(false);
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

    // First filter by search term
    const searchFilteredDonors = donors.filter(
        (d) =>
            d.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.donorId?.toString().includes(searchTerm) ||
            d.donorType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Then filter by funds availability if checkbox is checked
    const filteredDonors = showOnlyWithFunds
        ? searchFilteredDonors.filter(
            (d) =>
                (Number(d.generalBal) !== 0 || Number(d.zakkathBal) !== 0)
        )
        : searchFilteredDonors;

    const openGeneral = data?.generalAmt || 0;
    const openZakat = data?.zakkathAmt || 0;
    const totalGeneral = data?.generalBal || 0;
    const totalZakat = data?.zakkathBal || 0;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
                <p className="text-gray-600 font-medium text-lg">Loading funds status...</p>
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
        <div className="relative space-y-6">

            <header className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Funds Available
                </h1>
            </header>

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
                    title="Scholarship Awarded"
                    color="text-indigo-600"
                    bgColor="bg-indigo-50"
                    stats={{
                        mainValue: formatCurrency(data?.totalDistributed || 0),
                        subLabel: "Scholarship Distribution",
                        details: [
                            { label: "Total Students", value: data?.totalStudents || "0" },
                            { label: "Students Benefitted", value: data?.studentsBenefitted || "0" },
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

            <ButtonsBar
                primaryButtonClass={"h-10 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150 ease-in-out flex items-center justify-center whitespace-nowrap"}
                handleDownloadExcel={() => {
                    if (!filteredDonors || filteredDonors.length === 0) {
                        alert("No fund records to download");
                        return;
                    }

                    const excelData = filteredDonors.map((donor) => ({
                        "Donor ID": donor.donorId,
                        "Donor Name": donor.donorName,
                        "Donor Type": donor.donorType,
                        "Academic Year": donor.academicYear,
                        "General Balance": donor.generalBal,
                        "Zakat Balance": donor.zakkathBal,
                    }));

                    const worksheet = XLSX.utils.json_to_sheet(excelData);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, "Funds Available");
                    const excelBuffer = XLSX.write(workbook, {
                        bookType: "xlsx",
                        type: "array",
                    });
                    const file = new Blob([excelBuffer], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    });
                    saveAs(file, "Funds Available.xlsx");
                }}
            />

            {/* Pass checkbox props to DonorSearchBar */}
            <DonorSearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                donorCount={filteredDonors.length}
                formControlClass={formControlClass}
                showOnlyWithFunds={showOnlyWithFunds}
                setShowOnlyWithFunds={setShowOnlyWithFunds}
            />

            <DonorTable donors={filteredDonors} formatCurrency={formatCurrency} />
        </div>
    )
}

export default FundsAvailable;