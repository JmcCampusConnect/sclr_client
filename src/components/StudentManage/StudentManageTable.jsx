import React, { useState, useEffect, useCallback, useMemo } from "react";
import Loading from "../../assets/svg/Pulse.svg";

function StudentManageTable({
    students: initialStudents,
    isLoading,
    onQuickSave,
    onEditStudent,
    pagination,
    totalCount,
    onPageChange,
    onLimitChange
}) {

    const [students, setStudents] = useState([]);
    const [editingFields, setEditingFields] = useState({});
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        setStudents(initialStudents || []);
    }, [initialStudents]);

    // Pagination options
    const pageSizeOptions = useMemo(() => [25, 50, 75, 100], []);

    // Calculate page numbers
    const totalPages = useMemo(() => {
        return Math.ceil(totalCount / pagination.limit);
    }, [totalCount, pagination.limit]);

    const handleFieldChange = useCallback((registerNo, field, value) => {
        setStudents(prevStudents =>
            prevStudents.map(student =>
                student.registerNo === registerNo
                    ? { ...student, [field]: value, isEdited: true }
                    : student
            )
        );
        setEditingFields(prev => ({
            ...prev,
            [registerNo]: true
        }));

        // Clear validation error when user types
        if (validationErrors[`${registerNo}-${field}`]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[`${registerNo}-${field}`];
                return newErrors;
            });
        }
    }, [validationErrors]);

    const handleQuickSave = useCallback(async (student) => {

        const errors = {};
        const mobileNo = student.mobileNo || '';
        const aadharNo = student.aadharNo || '';

        if (mobileNo && !/^[0-9]{10}$/.test(mobileNo)) {
            errors[`${student.registerNo}-mobileNo`] = 'Mobile must be 10 digits';
        }
        if (aadharNo && !/^[0-9]{12}$/.test(aadharNo)) {
            errors[`${student.registerNo}-aadharNo`] = 'Aadhar must be 12 digits';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(prev => ({ ...prev, ...errors }));
            return;
        }

        if (!student.isEdited) return;

        const data = {
            password: student.password,
            isSemBased: student.isSemBased,
            mobileNo: student.mobileNo,
            aadharNo: student.aadharNo,
        };

        await onQuickSave(student.registerNo, data);

        setStudents(prevStudents =>
            prevStudents.map(s =>
                s.registerNo === student.registerNo
                    ? { ...s, isEdited: false }
                    : s
            )
        );
        setEditingFields(prev => ({
            ...prev,
            [student.registerNo]: false
        }));
    }, [onQuickSave]);

    const handleSemBasedToggle = useCallback((registerNo) => {
        setStudents(prevStudents =>
            prevStudents.map(student =>
                student.registerNo === registerNo
                    ? {
                        ...student,
                        isSemBased: student.isSemBased === 1 ? 0 : 1,
                        isEdited: true
                    }
                    : student
            )
        );
        setEditingFields(prev => ({
            ...prev,
            [registerNo]: true
        }));
    }, []);

    const handlePageClick = useCallback((page) => {
        onPageChange(page);
    }, [onPageChange]);

    const handleLimitSelect = useCallback((e) => {
        onLimitChange(parseInt(e.target.value));
    }, [onLimitChange]);

    const handleInputChange = useCallback((e, registerNo, field) => {
        const value = e.target.value;
        handleFieldChange(registerNo, field, value);
    }, [handleFieldChange]);

    if (isLoading && students.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
                <p className="text-gray-600 font-medium">Loading students...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                <div className="max-h-[700px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
                        <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
                            <tr>
                                {["S.No", "Register No", "Name", "Department", "Category", "Mobile No", "Aadhar No", "Password", "Sem Based", "Actions"].map(
                                    (header) => (
                                        <th
                                            key={header}
                                            className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                        >
                                            {header}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {students.length > 0 ? (

                                students.map((student, index) => {

                                    const startIndex = (pagination.page - 1) * pagination.limit;
                                    const serialNumber = startIndex + index + 1;
                                    const isFieldEdited = editingFields[student.registerNo] || student.isEdited;
                                    const mobileError = validationErrors[`${student.registerNo}-mobileNo`];
                                    const aadharError = validationErrors[`${student.registerNo}-aadharNo`];

                                    return (
                                        <tr
                                            key={student._id}
                                            className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200 ${isFieldEdited ? 'bg-blue-50/50 dark:bg-blue-900/50' : ''}`}
                                        >
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
                                                {serialNumber}
                                            </td>
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                {student.registerNo}
                                            </td>
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                {student.name}
                                            </td>
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                {student.department}
                                            </td>
                                            <td className="uppercase px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                {student.category}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div>
                                                    <input
                                                        type="tel"
                                                        value={student.mobileNo || ""}
                                                        onChange={(e) => handleInputChange(e, student.registerNo, 'mobileNo')}
                                                        className={`w-28 sm:w-40 px-3 py-1.5 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition dark:bg-gray-900 dark:text-gray-100 ${mobileError
                                                            ? 'border-red-500 focus:ring-red-500'
                                                            : 'border-gray-300'
                                                            }`}
                                                        placeholder="Mobile No"
                                                        maxLength={10}
                                                    />
                                                    {mobileError && (
                                                        <p className="text-red-500 text-xs mt-1">{mobileError}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={student.aadharNo || ""}
                                                        onChange={(e) => handleInputChange(e, student.registerNo, 'aadharNo')}
                                                        className={`w-28 sm:w-40 px-3 py-1.5 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition dark:bg-gray-900 dark:text-gray-100 ${aadharError
                                                            ? 'border-red-500 focus:ring-red-500'
                                                            : 'border-gray-300'
                                                            }`}
                                                        placeholder="Aadhar No"
                                                        maxLength={12}
                                                    />
                                                    {aadharError && (
                                                        <p className="text-red-500 text-xs mt-1">{aadharError}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <input
                                                    type="text"
                                                    value={student.password || ""}
                                                    onChange={(e) => handleInputChange(e, student.registerNo, 'password')}
                                                    className="w-28 sm:w-40 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition dark:bg-gray-900 dark:text-gray-100"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={student.isSemBased === 1}
                                                        onChange={() => handleSemBasedToggle(student.registerNo)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                                </label>
                                            </td>
                                            <td className="px-4 py-4 text-sm lg:text-base whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleQuickSave(student)}
                                                        disabled={!isFieldEdited}
                                                        className={`px-3 py-1.5 rounded-lg font-medium transition text-xs sm:text-sm ${isFieldEdited
                                                            ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                                                            : "bg-gray-300 text-gray-700 cursor-not-allowed"
                                                            }`}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => onEditStudent(student)}
                                                        // onClick={() => alert('Work under progress')}
                                                        className="px-3 py-1.5 rounded-lg font-medium transition text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="10" className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                                        No students found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalCount > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>Show</span>
                        <select
                            value={pagination.limit}
                            onChange={handleLimitSelect}
                            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {pageSizeOptions.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                        <span>entries</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, totalCount)} of {totalCount} entries
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handlePageClick(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Previous
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (pagination.page <= 3) {
                                pageNum = i + 1;
                            } else if (pagination.page >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = pagination.page - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageClick(pageNum)}
                                    className={`px-3 py-1 rounded-lg border transition ${pagination.page === pageNum
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        {totalPages > 5 && pagination.page < totalPages - 2 && (
                            <>
                                <span className="px-2 text-gray-400">...</span>
                                <button
                                    onClick={() => handlePageClick(totalPages)}
                                    className={`px-3 py-1 rounded-lg border transition ${pagination.page === totalPages
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => handlePageClick(pagination.page + 1)}
                            disabled={pagination.page === totalPages}
                            className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentManageTable;