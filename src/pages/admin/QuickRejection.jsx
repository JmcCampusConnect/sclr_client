import React from 'react'
import { useEffect } from 'react'
import axios from "axios";
import { useState } from 'react';
import '../../index.css';

function QuickRejection() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [applications, setApplications] = useState([])
    const [filteredApps, setFilteredApps] = useState([]);

    const [attendanceLimit, setAttendanceLimit] = useState("");
    const [deeniyathLimit, setDeeniyathLimit] = useState("");
    const [percentageLimit, setPercentageLimit] = useState("");
    const [arrearLimit, setArrearLimit] = useState("");
    const [incomeLimit, setIncomeLimit] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/admin/application/quickRejection`);
                const normalized = response.data.application.map(app => ({
                    ...app,

                    semesterMarkPercentage:
                        typeof app.semesterMarkPercentage === "number"
                            ? app.semesterMarkPercentage
                            : -1,

                    semesterArrear:
                        typeof app.semesterArrear === "number"
                            ? app.semesterArrear
                            : 0,

                    lastStudiedInstitutionPercentage:
                        typeof app.lastStudiedInstitutionPercentage === "number"
                            ? app.lastStudiedInstitutionPercentage
                            : -1,
                }));
                if (response.status == 200) {
                    setApplications(normalized);
                }
            }
            catch (error) { console.log("Error while fetching applications : ", error) }
        }
        fetchApplication();
    }, [apiUrl])

    const applyFilters = () => {

        const aLimit = attendanceLimit !== "" ? Number(attendanceLimit) : null;
        const dLimit = deeniyathLimit !== "" ? Number(deeniyathLimit) : null;
        const pLimit = percentageLimit !== "" ? Number(percentageLimit) : null;
        const arLimit = arrearLimit !== "" ? Number(arrearLimit) : null;
        const incLimit = incomeLimit !== "" ? Number(incomeLimit) : null;

        if (aLimit === null && dLimit === null && pLimit === null && arLimit === null && incLimit === null) {
            setFilteredApps([]);
            return;
        }

        const filtered = applications.filter((app) => {

            let matched = false;

            // Class attendance <= aLimit
            if (aLimit !== null) {
                const val = Number(app.classAttendancePercentage ?? app.classAttendance ?? -1);
                if (!isNaN(val) && val > -1 && val <= aLimit) matched = true;
            }

            // Deeniyath moral attendance <= dLimit
            if (!matched && dLimit !== null) {
                const val = Number(app.deeniyathMoralAttendancePercentage ?? app.deeniyathMoralAttendance ?? -1);
                if (!isNaN(val) && val > -1 && val <= dLimit) matched = true;
            }

            // Percentage of marks <= pLimit (try semesterMarkPercentage then lastStudiedInstitutionPercentage)
            if (!matched && pLimit !== null) {
                const val =
                    app.semesterMarkPercentage >= 0
                        ? app.semesterMarkPercentage
                        : app.lastStudiedInstitutionPercentage;

                if (val >= 0 && val <= pLimit) matched = true;
            }

            // Arrear subjects >= arLimit
            if (!matched && arLimit !== null) {
                const val = app.semesterArrear ?? 0;
                if (val >= arLimit) matched = true;
            }

            // Income >= incLimit: prefer server-provided combinedIncome, fall back to other fields
            if (!matched && incLimit !== null) {
                const val = Number(app.combinedIncome ?? app.parentAnnualIncome ?? app.siblingsIncome ?? 0);
                if (!isNaN(val) && val >= incLimit) matched = true;
            }

            return matched;
        });

        setFilteredApps(filtered);
    }

    const clearFilters = () => {
        setAttendanceLimit("");
        setDeeniyathLimit("");
        setPercentageLimit("");
        setArrearLimit("");
        setIncomeLimit("");
        setFilteredApps([]);
    }

    const submitAllRejections = async () => {

        if (!filteredApps || filteredApps.length === 0) { return }

        setIsSubmitting(true);

        try {

            const applicationsToReject = [];
            for (const app of filteredApps) {

                const reasons = [];

                if (attendanceLimit !== "") {
                    const val = Number(app.classAttendancePercentage ?? app.classAttendance ?? -1);
                    if (!isNaN(val) && val > -1 && val <= Number(attendanceLimit)) {
                        reasons.push("Shortage of Attendance");
                    }
                }

                if (deeniyathLimit !== "") {
                    const val = Number(app.deeniyathMoralAttendancePercentage ?? app.deeniyathMoralAttendance ?? -1);
                    if (!isNaN(val) && val > -1 && val <= Number(deeniyathLimit)) {
                        reasons.push("Shortage of Deeniyath / Moral Attendance");
                    }
                }

                if (percentageLimit !== "") {
                    const val =
                        app.semesterMarkPercentage >= 0
                            ? app.semesterMarkPercentage
                            : app.lastStudiedInstitutionPercentage;

                    if (val >= 0 && val <= Number(percentageLimit)) {
                        reasons.push("Low Percentage of Marks");
                    }
                }

                if (arrearLimit !== "") {
                    const val = app.semesterArrear ?? 0;
                    if (val >= Number(arrearLimit)) {
                        reasons.push("Re-Appear (Failed in Exam)");
                    }
                }

                if (incomeLimit !== "") {
                    const val = Number(app.combinedIncome ?? app.parentAnnualIncome ?? app.siblingsIncome ?? 0);
                    if (!isNaN(val) && val >= Number(incomeLimit)) reasons.push('High Family Income');
                }

                // Skip if no reason determined
                if (reasons.length === 0) { continue }

                applicationsToReject.push({
                    registerNo: app.registerNo,
                    reasons,
                    applicationId: app._id
                });
            }

            if (applicationsToReject.length === 0) {
                setIsSubmitting(false);
                return;
            }

            const resp = await axios.post(`${apiUrl}/api/admin/application/quickRejectApplications`, {
                applications: applicationsToReject
            });

            if (resp.data.success) {

                const succeeded = resp.data.results.filter(r => r.success).map(r => r.registerNo);

                // Remove successfully rejected from UI
                if (succeeded.length > 0) {
                    setFilteredApps(prev => prev.filter(a => !succeeded.includes(a.registerNo)));
                }
                alert(`Bulk rejection completed! Succeeded : ${succeeded.length} / ${applicationsToReject.length}`);
                window.location.reload();
            }
        } catch (err) {
            alert(`Error during bulk rejection : ${err?.response?.data?.message || err.message}`);
        } finally { setIsSubmitting(false) }
    }

    return (
        <div className="w-full space-y-8">

            {/* Title */}
            <header className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Quick Rejection

                </h1>
            </header>
            <h3 className="text-xl my-5 font-semibold text-gray-700 text-center dark:text-gray-200 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow">
                Students will be rejected if they meet any one of the following conditions
            </h3>

            {/* Filters Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Class Attendance */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                            Class Attendance (≤) :
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={attendanceLimit}
                            onChange={(e) => setAttendanceLimit(e.target.value)}
                            placeholder="e.g. 70"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        />
                    </div>

                    {/* Deeniyath attendance */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                            Deeniyath / Moral Attendance (≤) :
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={deeniyathLimit}
                            onChange={(e) => setDeeniyathLimit(e.target.value)}
                            placeholder="e.g. 70"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        />
                    </div>

                    {/* Percentage */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                            Percentage of Marks (≤) :
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={percentageLimit}
                            onChange={(e) => setPercentageLimit(e.target.value)}
                            placeholder="e.g. 50"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        />
                    </div>

                    {/* Arrear Subjects */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                            Arrear Subjects (≥) :
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={arrearLimit}
                            onChange={(e) => setArrearLimit(e.target.value)}
                            placeholder="e.g. 2"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        />
                    </div>

                    {/* Income */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                            Annual Income (≥) :
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={incomeLimit}
                            onChange={(e) => setIncomeLimit(e.target.value)}
                            placeholder="e.g. 50000"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Apply Button */}
            <div className="flex justify-end gap-3">
                <button onClick={() => applyFilters()} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow transition">
                    Apply Filters
                </button>
                <button onClick={() => clearFilters()} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded-lg">
                    Clear
                </button>
            </div>

            {/* Count */}
            <div className="text-right text-lg font-semibold text-gray-700 dark:text-gray-300">
                No of Students :
                <span className="text-indigo-600 dark:text-indigo-400 ml-1">{filteredApps.length}</span>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="min-w-full text-center divide-y divide-gray-200 dark:divide-gray-700">

                    <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
                        <tr>
                            {["S.No", "Register No", "Name", "Special Categories"].map((head, i) => (
                                <th
                                    key={i}
                                    className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                >
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredApps.length === 0 ? (
                            <tr className="h-[70px]">
                                <td colSpan="4" className="text-gray-500 dark:text-gray-400 font-medium">
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            filteredApps.map((item, index) => (
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition" key={index}>
                                    <td className='px-4 py-4 text-gray-700 dark:text-gray-200 w-40'>{index + 1}</td>
                                    <td className="px-4 py-4 text-gray-700 dark:text-gray-200">{item.registerNo}</td>
                                    <td className="px-4 py-4 text-gray-700 dark:text-gray-200">{item.name}</td>
                                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300 uppercase">{item.specialCategory}</td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
                <button className="px-6 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg font-medium shadow transition">
                    Back
                </button>

                <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow transition" onClick={submitAllRejections}>
                    Submit All Rejections
                </button>
            </div>

        </div>
    )
}

export default QuickRejection