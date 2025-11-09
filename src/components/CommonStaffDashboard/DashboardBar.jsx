import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const legendSpacingPlugin = { id: "legendSpacing" }

const DashboardBar = ({ barData }) => {

    if (!barData?.ug || !barData?.pg) return null;

    const secondaryColor = "#ff6b81";
    const primaryColor = "#4c7cff";
    const hoverPrimaryColor = "#3c66cc";
    const hoverSecondaryColor = "#e65a71";
    const neutralText = "#374151";

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
                backgroundColor: primaryColor,
                borderRadius: 6,
                barThickness: 30,
                hoverBackgroundColor: hoverPrimaryColor,
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
                backgroundColor: secondaryColor,
                borderRadius: 6,
                barThickness: 30,
                hoverBackgroundColor: hoverSecondaryColor,
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
                align: "start",
                labels: {
                    color: neutralText,
                    usePointStyle: true,
                    pointStyle: "rect",
                    boxWidth: 10,
                    boxHeight: 10,
                    padding: 20,
                    font: { size: 13, weight: 400 },
                },
            },
            title: {
                display: true,
                text: "Student Distribution by Year & Gender",
                color: neutralText,
                font: { size: 16, weight: "600" },
                padding: { bottom: 20 },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                padding: 12,
                bodyFont: { size: 13 },
                titleFont: { size: 13, weight: '600' },
                cornerRadius: 4,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: "#6b7280", font: { size: 12 } },
                border: { display: false }
            },
            y: {
                beginAtZero: true,
                grid: { color: "rgba(209,213,219,0.4)", drawBorder: false },
                ticks: { color: "#9ca3af", font: { size: 12 } },
                border: { display: false }
            },
        },
    };

    return (
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* Bar Chart Card (Left Side) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg transition-all duration-300">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-3">
                        Enrollment Trend
                    </h2>
                    <div className="h-[400px]">
                        <Bar data={data} options={options} plugins={[legendSpacingPlugin]} />
                    </div>
                </div>
            </div>

            {/* Summary Card (Right Side) */}
            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-lg transition-all duration-300">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-3">
                    Detailed Year-wise Breakdown
                </h2>
                <div className="flex flex-col gap-6">
                    {data.labels.map((label, i) => {
                        const men = data.datasets[0].data[i];
                        const women = data.datasets[1].data[i];
                        const total = men + women;
                        const menPercent = total ? (men / total) * 100 : 0;
                        const womenPercent = total ? (women / total) * 100 : 0;
                        return (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="flex justify-between text-gray-700 text-sm font-medium">
                                    <span className="font-semibold">{label}</span>
                                    <span className="text-gray-500 font-normal">{total} Students</span>
                                </div>
                                <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="absolute h-full left-0 transition-all"
                                        style={{ width: `${menPercent}%`, backgroundColor: primaryColor }}
                                    >
                                    </div>
                                    <div
                                        className="absolute h-full transition-all"
                                        style={{
                                            width: `${womenPercent}%`,
                                            backgroundColor: secondaryColor,
                                            left: `${menPercent}%`
                                        }}
                                    ></div>
                                </div>

                                {/* Percentage and Count Breakdown */}
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <div className="flex items-center gap-1">
                                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
                                        <span className="font-medium">Men : {men} ({menPercent.toFixed(1)}%)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: secondaryColor }}></span>
                                        <span className="font-medium">Women : {women} ({womenPercent.toFixed(1)}%)</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default DashboardBar;