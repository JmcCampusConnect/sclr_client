import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const legendSpacingPlugin = {
    id: "legendSpacing",
    afterFit(legend) {
        legend.legendItems.forEach(item => {
            item.textAlign = "left";
            item.pointStyleWidth = 12;
            item.textWidth += 12; 
        });
    },
};

const DashboardBar = ({ barData }) => {

    if (!barData?.ug || !barData?.pg) return null;

    const data = {
        labels: ["UG 1st", "UG 2nd", "UG 3rd", "PG 1st", "PG 2nd"],
        datasets: [
            {
                label: "Men",
                data: [
                    barData.ug.men[0],
                    barData.ug.men[1],
                    barData.ug.men[2],
                    barData.pg.men[0],
                    barData.pg.men[1],
                ],
                backgroundColor: "#2563eb",
                borderRadius: 8,
                barThickness: 38,
                hoverBackgroundColor: "#1e3a8a",
            },
            {
                label: "Women",
                data: [
                    barData.ug.women[0],
                    barData.ug.women[1],
                    barData.ug.women[2],
                    barData.pg.women[0],
                    barData.pg.women[1],
                ],
                backgroundColor: "#db2777",
                borderRadius: 8,
                barThickness: 38,
                hoverBackgroundColor: "#9d174d",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
            legend: {
                position: "bottom",
                align: "center",
                labels: {
                    color: "#374151",
                    usePointStyle: true,
                    pointStyle: "circle",
                    boxWidth: 10,
                    boxHeight: 10,
                    padding: 25,
                    textAlign: "left",
                    font: { size: 14, weight: 500 },
                },
            },
            title: {
                display: true,
                text: "Student Distribution by Year & Gender",
                color: "#111827",
                font: { size: 18, weight: "600" },
                padding: { bottom: 25 },
            },
            tooltip: {
                backgroundColor: "#111827",
                padding: 10,
                bodyFont: { size: 13 },
                titleFont: { size: 13 },
                cornerRadius: 6,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: "#6b7280", font: { size: 13 } },
            },
            y: {
                beginAtZero: true,
                grid: { color: "rgba(209,213,219,0.25)" },
                ticks: { color: "#9ca3af", font: { size: 13 } },
            },
        },
    };

    return (
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* Bar Chart Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="p-6 h-[480px]">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-10">
                        <span className="inline-block w-2 h-6 bg-blue-600 rounded-full"></span>
                        Yearly Breakdown
                    </h2>
                    <Bar data={data} options={options} plugins={[legendSpacingPlugin]} />
                </div>
            </div>

            {/* Summary Card */}
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="inline-block w-2 h-6 bg-pink-600 rounded-full"></span>
                    Yearwise Breakdown
                </h2>
                <div className="flex flex-col justify-between gap-4">
                    {data.labels.map((label, i) => {
                        const men = data.datasets[0].data[i];
                        const women = data.datasets[1].data[i];
                        const total = men + women;
                        const menPercent = total ? (men / total) * 100 : 0;
                        const womenPercent = total ? (women / total) * 100 : 0;
                        return (
                            <div key={i} className="flex flex-col gap-1.5">
                                <div className="flex justify-between text-gray-700 text-md font-medium">
                                    <span>{label}</span>
                                    <span className="text-gray-500">{total} Students</span>
                                </div>
                                <div className="relative w-full h-5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="absolute h-full bg-blue-600 rounded-l-full transition-all"
                                        style={{ width: `${menPercent}%` }}
                                    ></div>
                                    <div
                                        className="absolute h-full bg-pink-600 rounded-r-full transition-all"
                                        style={{ width: `${menPercent + womenPercent}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-md text-gray-500">
                                    <span>Men: {men}</span>
                                    <span>Women: {women}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}

export default DashboardBar;