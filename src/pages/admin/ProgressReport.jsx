import React, { useState, useEffect } from "react";
import axios from "axios";
import ProgressReportTable from "../../components/ProgressReport/ProgressReportTable";
import Loading from "../../assets/svg/Pulse.svg";

function ProgressReport() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [semesterFilter, setSemesterFilter] = useState("all");

    const fetchCounts = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/progressReport/fetchCounts`);
            setData(response.data);
        } catch (err) {
            console.error("Error fetching report : ", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCounts();
    }, [apiUrl]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
                <p className="text-gray-600 font-medium text-lg">Loading progress report...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center">
                <p className="text-red-600 font-semibold">Failed to load progress report.</p>
            </div>
        );
    }

    const deeniyathLabelMap = {
        aidedSfmMuslim: "Deeniyath Men",
        sfwMuslim: "Deeniyath Women",
        aidedSfmNonMuslim: "Moral Men",
        sfwNonMuslim: "Moral Women",
    };

    const flattenReport = (report, name, isNested = false) => {

        const rows = [];

        if (isNested) {

            const keys = Object.keys(report.odd);
            keys.forEach(key => {
                const odd = report.odd[key] ?? { finished: 0, total: 0, pending: 0 };
                const even = report.even[key] ?? { finished: 0, total: 0, pending: 0 };
                let finished, total, pending;

                if (semesterFilter === "all") {
                    finished = (odd.finished || 0) + (even.finished || 0);
                    total = (odd.total || 0) + (even.total || 0);
                    pending = (odd.pending || 0) + (even.pending || 0);
                } else {
                    const val = report[semesterFilter][key] ?? { finished: 0, total: 0, pending: 0 };
                    finished = val.finished ?? 0;
                    total = val.total ?? 0;
                    pending = val.pending ?? 0;
                }

                const rowType = name === "Deeniyath & Moral" ? deeniyathLabelMap[key] : `${name} - ${key}`;

                rows.push({
                    type: rowType,
                    finished: finished || "0",
                    total: total || "0",
                    pending: pending || "0",
                });
            });
        } else {

            const odd = report.odd ?? { finished: 0, total: 0, pending: 0 };
            const even = report.even ?? { finished: 0, total: 0, pending: 0 };
            let finished, total, pending;

            if (semesterFilter === "all") {
                finished = (odd.finished || 0) + (even.finished || 0);
                total = (odd.total || 0) + (even.total || 0);
                pending = (odd.pending || 0) + (even.pending || 0);
            } else {
                const val = report[semesterFilter] ?? { finished: 0, total: 0, pending: 0 };
                finished = val.finished ?? 0;
                total = val.total ?? 0;
                pending = val.pending ?? 0;
            }

            rows.push({
                type: name,
                finished: finished || "0",
                total: total || "0",
                pending: pending || "0",
            });
        }

        return rows;
    };

    const rows = [
        ...flattenReport(data.coe, "COE Report", false),
        ...flattenReport(data.attendance, "Class Attendance", true),
        ...flattenReport(data.deeniyath, "Deeniyath & Moral", true),
        ...flattenReport(data.sclr, "Govt. Scholarship", true),
        ...flattenReport(data.tutor, "Tutor Verification", false),
    ];

    return (
        <div className="p-4">
            <header className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Work Progress Report
                </h1>
            </header>

            <div className="mt-4 flex justify-center gap-4 mb-6">
                {["all", "odd", "even"].map((value) => {
                    const label = value === "all" ? "All Semesters" : value === "odd" ? "Odd Semesters" : "Even Semesters";
                    const isActive = semesterFilter === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setSemesterFilter(value)}
                            className={`px-6 py-2 rounded-full font-semibold transition duration-200
                                ${isActive
                                    ? "bg-blue-600 text-white shadow-lg hover:scale-[1.03]"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-[1.02]"
                                }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            <ProgressReportTable rows={rows} />
        </div>
    )
}

export default ProgressReport;