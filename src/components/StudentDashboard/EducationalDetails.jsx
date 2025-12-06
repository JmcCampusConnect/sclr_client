import React from "react";
import { Card, TableRow } from "./UI";

const EducationalDetails = ({ student }) => (
    <Card title="Scholarship Eligibility & Verification">
        <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-sm">
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

                    {student.semester !== "I" && (
                        <TableRow label="Grade">
                            {student.semesterMarkPercentage === -1
                                ? "Pending"
                                : `${student.semesterGrade} Grade`
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

                    <TableRow label="Eligible for TPS / PPS">
                        {student.governmentScholarship === 0
                            ? "Pending"
                            : student.governmentScholarship === 1 ? "Yes" : "No"}
                    </TableRow>

                    {student.tutorVerification === 0 && (
                        <TableRow label="Tutor Verification Status">
                            Pending
                        </TableRow>
                    )}

                    {student.tutorVerification === 1 && (
                        <>
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
                        </>
                    )}

                </tbody>
            </table>
        </div>
    </Card>
)

export default EducationalDetails;