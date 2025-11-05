import React from "react";
import { Card, TableRow } from "./UI";

const EducationalDetails = ({ student }) => (
    <Card title="Educational Details">
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
                            : student.classAttendancePercentage
                        }
                    </TableRow>

                    <TableRow label="Deeniyath / Moral Percentage">
                        {student.deeniyathMoralAttendancePercentage === -1
                            ? "Pending"
                            : student.deeniyathMoralAttendancePercentage
                        }
                    </TableRow>

                    {student.sclrType === "Renewal" && (
                        <TableRow label="Last Year Credited Amount">
                            {student.lastYearCreditedAmount}
                        </TableRow>
                    )}
                </tbody>
            </table>
        </div>
    </Card>
)

export default EducationalDetails;