import React from 'react'
import { Hammer, ArrowRight, FileText, CheckCircle2, AlertCircle } from "lucide-react";

function GuideLines() {
    return (
        <div className="min-h-screen font-sans antialiased">
            <div className="mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

                {/* Header Banner */}
                <div className="bg-slate-900 px-8 py-6 flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
                        <Hammer className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-white tracking-wide">System Guidelines</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Standard operating procedures and workflow execution</p>
                    </div>
                </div>

                <div className="p-8 space-y-8">

                    {/* Section 1: Configuration */}
                    <div className="space-y-6">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-2">
                            Configuration & Setup
                        </h2>

                        {/* Step A */}
                        <div className="group relative pl-6 border-l-2 border-slate-200 focus-within:border-emerald-500 transition-colors">
                            <p className="text-lg font-medium text-slate-800 leading-relaxed">
                                Go to <span className="font-semibold text-slate-900">Academic Settings → Academic Year</span>, click <span className="font-semibold text-slate-900">Add Academic</span> and enter the academic year, application start date, and end date, then check <span className="font-semibold text-slate-900">"Set as Active Academic Year"</span> and click <span className="font-semibold text-slate-900">Submit</span>.
                            </p>
                            <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200/60 rounded-lg p-3 text-sm text-amber-800">
                                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                                <p>
                                    <strong className="font-semibold">Note :</strong> Ensure the dashboard is empty for the academic year that has been changed. If you forget to check "Set as Active Academic Year," you can change it from the dropdown in the academic list.
                                </p>
                            </div>
                        </div>

                        {/* Step B */}
                        <div className="pl-6 border-l-2 border-slate-200">
                            <p className="text-lg text-slate-800 leading-relaxed">
                                Go to <span className="font-semibold text-slate-900">Donor Management</span> and download the sample fund Excel file.
                            </p>
                        </div>

                        {/* Step C */}
                        <div className="pl-6 border-l-2 border-slate-200">
                            <p className="text-lg text-slate-800 leading-relaxed">
                                Fill in the donor balances – if you don't have balances, leave them empty or put 0.
                            </p>
                            <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200/60 rounded-lg p-3 text-sm text-amber-800">
                                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                                <p>
                                    <strong className="font-semibold">Note :</strong> Do not edit any donor ID, name, etc., and do not add new donors in that Excel file. Only enter the amount. If you want to add a donor, add them through the Donor Add menu.
                                </p>
                            </div>
                        </div>

                        {/* Step D */}
                        <div className="pl-6 border-l-2 border-slate-200">
                            <p className="text-lg text-slate-800 leading-relaxed">
                                Choose the Excel file in <span className="font-semibold text-slate-900">Donor Management</span> and click the <span className="font-semibold text-slate-900">Upload</span> button. After successful uploading, verify the fund availability and transaction in the <span className="font-semibold text-slate-900">Report</span> menu.
                            </p>
                        </div>
                    </div>

                    {/* Section 2: Workflow */}
                    <div className="space-y-6 pt-4">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-2">
                            Scholarship Workflow
                        </h2>
                        <div className="relative border-l-2 border-emerald-100 ml-3 pl-6 space-y-8">

                            {/* Workflow Step 1 */}
                            <div className="relative">
                                <span className="absolute -left-[35px] top-1 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold ring-4 ring-white">1</span>
                                <p className="text-lg text-slate-800 leading-relaxed">
                                    Wait until the application end date for students has passed.
                                </p>
                            </div>

                            {/* Workflow Step 2 */}
                            <div className="relative">
                                <span className="absolute -left-[35px] top-1 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold ring-4 ring-white">2</span>
                                <p className="text-lg text-slate-800 leading-relaxed">
                                    Request the following evaluators to submit their records for all applied students:
                                </p>
                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
                                    {['COE', 'Attendance', 'Moral / Deeniyath Department', 'TPS', 'PPS', 'Tutor'].map((evaluator) => (
                                        <div key={evaluator} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{evaluator}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Workflow Step 3 */}
                            <div className="relative">
                                <span className="absolute -left-[35px] top-1 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold ring-4 ring-white">3</span>
                                <p className="text-lg text-slate-800 leading-relaxed">
                                    Use the <span className="font-semibold text-slate-900">Quick Rejection</span> feature to automatically reject students who fail to meet certain constraints. This step helps eliminate a large number of ineligible students efficiently.
                                </p>
                            </div>

                            {/* Workflow Step 4 */}
                            <div className="relative">
                                <span className="absolute -left-[35px] top-1 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold ring-4 ring-white">4</span>
                                <p className="text-lg text-slate-800 leading-relaxed">
                                    Award scholarships to the remaining eligible students based on their performance records and evaluation logs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GuideLines