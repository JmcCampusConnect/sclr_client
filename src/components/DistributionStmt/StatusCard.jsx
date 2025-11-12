import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, Activity, ChevronRight, IndianRupee } from "lucide-react";

function StatusCard() {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const [cardData, setCardData] = useState([]);

    const formatCurrency = (amount = 0) =>
        `₹${Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/distribution/fetchCardsData`);
                const data = response.data;
                const cards = [
                    {
                        title: "Application Funnel",
                        metric: data.totalApplicants?.toLocaleString("en-IN") || "0",
                        unit: "Total Applicants",
                        icon: Users,
                        color: "text-indigo-600",
                        bgColor: "bg-indigo-50",
                        details: [
                            { label: "Benefitted", value: data.totalBenefitted?.toLocaleString("en-IN") || "0" },
                            {
                                label: "Others",
                                value: (data.totalApplicants - data.totalBenefitted) > 0
                                    ? (data.totalApplicants - data.totalBenefitted).toLocaleString("en-IN")
                                    : "0",
                            },
                        ],
                        secondaryStat: {
                            label: "Approval Rate",
                            value:
                                data.totalApplicants > 0
                                    ? `${((data.totalBenefitted / data.totalApplicants) * 100).toFixed(1)}%`
                                    : "0%",
                            trend: true,
                        },
                    },
                    {
                        title: "Financial Allocation",
                        metric: formatCurrency(data.totalSclrshipAwarded),
                        unit: "Total Funds Awarded",
                        icon: IndianRupee,
                        color: "text-green-600",
                        bgColor: "bg-green-50",
                        details: [
                            {
                                label: "Distributed",
                                value: formatCurrency(data.totalDistributed),
                            },
                            {
                                label: "Remaining",
                                value: formatCurrency(
                                    (data.totalSclrshipAwarded || 0) - (data.totalDistributed || 0)
                                ),
                            },
                        ],
                        secondaryStat: {
                            label: "Budget Used",
                            value:
                                data.totalSclrshipAwarded > 0
                                    ? `${((data.totalDistributed / data.totalSclrshipAwarded) * 100).toFixed(1)}%`
                                    : "0%",
                            trend:
                                data.totalDistributed <= data.totalSclrshipAwarded * 0.9
                                    ? true : false,
                        },
                    },
                ];
                setCardData(cards);
            } catch (error) {
                console.error("Error fetching card data for distribution statement : ", error);
            }
        };

        fetchData();
    }, [apiUrl]);

    const ProfessionalCard = ({ card }) => (
        <div className="flex flex-col bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition duration-300 hover:shadow-3xl">

            {/* 1️⃣ Header Section */}
            <div className={`p-6 flex items-start justify-between ${card.bgColor}`}>
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-600">
                        {card.title}
                    </p>
                    <p className="mt-1 text-4xl font-extrabold text-gray-900">{card.metric}</p>
                    <p className="mt-2.5 text-sm font-medium text-gray-500">{card.unit}</p>
                </div>
                <card.icon className={`w-8 h-8 ${card.color} opacity-80`} />
            </div>

            {/* 2️⃣ Details Section */}
            <div className="flex-grow p-6">
                <div className="grid grid-cols-2 gap-4">
                    {card.details.map((detail, index) => (
                        <div key={index}>
                            <p className="text-xs font-medium text-gray-500 uppercase">{detail.label}</p>
                            <p className="mt-0.5 text-lg font-bold text-gray-800">{detail.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3️⃣ Footer Section */}
            <div className="p-4 border-t border-gray-200 cursor-pointer hover:bg-gray-50 transition duration-150 flex items-center justify-between">
                <div className="flex items-center">
                    <Activity className={`w-4 h-4 mr-2 ${card.color}`} />
                    <span className="text-sm font-medium text-gray-600">
                        {card.secondaryStat.label} :
                        <span className={`ml-1 font-bold ${card.secondaryStat.trend ? "text-green-600" : "text-red-600"}`}>
                            {card.secondaryStat.value}
                        </span>
                    </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
        </div>
    )

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {cardData.map((card, index) => (
                <ProfessionalCard key={index} card={card} />
            ))}
        </div>
    )
}

export default StatusCard;