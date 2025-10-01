import React from "react";
import { Card, TableRow } from "./UI";

const EducationalDetails = ({ student }) => (

    <Card title="Educational Details">
        <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-sm">
                <tbody>
                    <TableRow label="Percentage of Mark">
                        {student.semester === "I"
                            ? student.lastStudiedInstitutionPercentage || "N/A"
                            : student.semesterMarkPercentage === -1
                                ? "Pending"
                                : student.semesterMarkPercentage}
                    </TableRow>
                    <TableRow label="Class Attendance Percentage">
                        {student.classAttendancePercentage === -1 ? "Pending" : student.classAttendancePercentage}
                    </TableRow>
                    <TableRow label="Deeniyath / Moral Percentage">
                        {student.deeniyatMoralAttendancePercentage === -1
                            ? "Pending"
                            : student.deeniyatMoralAttendancePercentage}
                    </TableRow>
                    {student.semesterArrear !== -1 && student.semesterArrear !== 0 && (
                        <TableRow label="No. of Arrear">{student.semesterArrear}</TableRow>
                    )}
                    {student.sclrType === "Renewal" && (
                        <TableRow label="Last Year Credited Amount">{student.lastYearCreditedAmount}</TableRow>
                    )}
                </tbody>
            </table>
        </div>
    </Card>
)

export default EducationalDetails;