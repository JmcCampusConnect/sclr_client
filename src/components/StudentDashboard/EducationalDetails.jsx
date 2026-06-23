import React from "react";
import { Card, TableRow } from "./UI";
import { FiClock } from 'react-icons/fi';

const EducationalDetails = ({ student }) => (
    <>
        {/* Main Educational Details Card */}
        <Card title="Scholarship Eligibility & Verification">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden text-sm">
                    <tbody>
                        <TableRow label="Percentage of Mark">
                            {student.semester === "I"
                                ? `${student.lastStudiedInstitutionPercentage}% ( I SEM )` || "N/A"
                                : student.semesterMarkPercentage === -1
                                    ? "Pending"
                                    : `${student.semesterMarkPercentage}% ( ${student.semester} SEM )`
                            }
                        </TableRow>

                        {student.semester !== "I" && (
                            <TableRow label="No. of Arrear">
                                {student.semesterMarkPercentage === -1
                                    ? "Pending"
                                    : `${student.semesterArrear} Arrear`
                                }
                            </TableRow>
                        )}

                        <TableRow label="Class Attendance Percentage">
                            {student.classAttendancePercentage === -1
                                ? "Pending"
                                : `${student.classAttendancePercentage}%`
                            }
                        </TableRow>

                        <TableRow label="Deeniyath / Moral Percentage">
                            {student.deeniyathMoralAttendancePercentage === -1
                                ? "Pending"
                                : `${student.deeniyathMoralAttendancePercentage}%`
                            }
                        </TableRow>

                        {student.sclrType === "Renewal" && (
                            <TableRow label="Last Year Credited Amount">
                                Rs. {student.lastYearCreditedAmount ?? 0}
                            </TableRow>
                        )}

                        <TableRow label="TPS / PPS Beneficiary">
                            {student.governmentScholarship === 0
                                ? "Pending"
                                : student.governmentScholarship === 1 ? "Yes" : "No"}
                        </TableRow>
                    </tbody>
                </table>
            </div>
        </Card>

        {/* Tutor Verification Details Card - Only show if tutor verification exists */}
        {student.tutorVerification === 1 && student.tutorVerificationDetails && (
            <Card title="Tutor Verification Details">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden text-sm">
                        <tbody>
                            <TableRow label="Orphan / Single Parent">
                                {student.tutorVerificationDetails?.orphanOrSingleParent ? "Yes" : "No"}
                            </TableRow>

                            <TableRow label="Hazrath / Muaddin">
                                {student.tutorVerificationDetails?.hazrathOrMuaddin ? "Yes" : "No"}
                            </TableRow>

                            <TableRow label="Eligible for Zakkath">
                                {student.tutorVerificationDetails?.eligibleForZakkath ? "Yes" : "No"}
                            </TableRow>

                            <TableRow label="Needy but not Zakkath">
                                {student.tutorVerificationDetails?.needyButNotZakkath ? "Yes" : "No"}
                            </TableRow>

                            <TableRow label="Tutor Remarks">
                                {student.tutorVerificationDetails?.remarks || "—"}
                            </TableRow>

                            <TableRow label="Verified By">
                                {student.tutorVerificationDetails?.verifiedBy || "—"}
                            </TableRow>

                            <TableRow label="Verified At">
                                {student.tutorVerificationDetails?.verifiedAt
                                    ? new Date(student.tutorVerificationDetails.verifiedAt).toLocaleDateString()
                                    : "—"}
                            </TableRow>
                        </tbody>
                    </table>
                </div>
            </Card>
        )}

        {/* Show pending status if tutor verification is pending */}
        {student.tutorVerification === 0 && (
            <Card title="Tutor Verification Status">
                <div className="p-6 text-center mx-auto flex flex-col items-center">
                    {/* Animated Icon Container */}
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-600 ring-4 ring-amber-50/50 mb-4">
                        <FiClock className="text-xl animate-pulse" />
                    </div>

                    {/* Status Badge */}
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 tracking-wide uppercase">
                        Pending Verification
                    </span>

                    {/* Informative Subtext */}
                    <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                        Tutor verification is currently pending. Please check back later.
                    </p>
                </div>
            </Card>
        )}
    </>
);

export default EducationalDetails;