import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApplicationStatus from "../components/StudentDashboard/ApplicationStatus";
import PersonalDetails from "../components/StudentDashboard/PersonalDetails";
import EducationalDetails from "../components/StudentDashboard/EducationalDetails";
import DocumentsSection from "../components/StudentDashboard/DocumentsSection";
import { InfoCard } from "../components/StudentDashboard/UI";

const apiUrl = import.meta.env.VITE_API_URL;

function AdminViewAppln() {

    const location = useLocation();
    const navigate = useNavigate();

    const { student } = location.state || {};

    if (!student) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500 text-lg">No student data available.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
                >
                    ← Back
                </button>
            </div>
        )
    }

    return (
        <div className="rounded-xl">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
            >
                ← Back
            </button>

            <div className="container mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                        <h2 className="text-xl font-bold text-white">{student.name}</h2>
                        <p className="text-indigo-100 text-md mt-2">Register No : {student.registerNo}</p>
                    </div>
                    <div className="p-6 space-y-8">
                        <ApplicationStatus status={student.applicationStatus} />
                        <div className="grid md:grid-cols-2 gap-6">
                            <InfoCard label="Scholarship Type" value={student.sclrType} />
                            <InfoCard label="Special Category" value={student.specialCategory} />
                        </div>
                        <PersonalDetails student={student} />
                        <EducationalDetails student={student} />
                        <DocumentsSection student={student} apiUrl={apiUrl} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminViewAppln;
