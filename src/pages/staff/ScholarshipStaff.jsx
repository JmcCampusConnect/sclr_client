import React, { useEffect, useState } from "react";
import StaffStatus from "../../components/Others/StaffStatus";
import { useParams } from 'react-router-dom';
import Button from "../../common/Button";
import HeaderTag from "../../common/HeaderTag";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../assets/svg/Pulse.svg";

const PaginationButtonStyles = `
    flex items-center justify-center h-10 w-10 text-sm font-medium 
    text-gray-700 bg-white border border-gray-300 rounded-lg 
    hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
    dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 
    transition duration-150
`;

function ScholarshipStaff() {

    const { userId } = useParams();
    const apiUrl = import.meta.env.VITE_API_URL;

    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pending, setPending] = useState(0);
    const [complete, setComplete] = useState(0);

    const [formData, setFormData] = useState({});
    const [initialFormData, setInitialFormData] = useState({});

    useEffect(() => {

        const fetchStudents = async () => {

            try {

                setLoading(true);
                setError(null);
                const response = await axios.get(`${apiUrl}/api/staff/sclr/students?page=${page}&limit=${limit}&staffId=${userId}`)
                const fetchedStudents = response.data.data || [];
                setPending(response.data.pending || 0);
                setStudents(fetchedStudents);
                setTotalPages(response.data.pages || 1);
                setComplete(response.data.complete || 0);
                setPending(response.data.pending || 0);
                setTotalStudents(response.data.total || 0);
                const initialState = {};
                fetchedStudents.forEach(student => {
                    initialState[student._id] = student.governmentScholarship || "";
                });
                setFormData(initialState);
                setInitialFormData(initialState);
            } catch (err) {
                setError("Failed to fetch student data. Please try again.");
                setStudents([]);
            } finally { setLoading(false) }
        };
        fetchStudents();
    }, [page, apiUrl, limit]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleSelection = (studentId, value) => {
        setFormData(prev => ({
            ...prev,
            [studentId]: value
        }));
    };

    const handleSubmit = async () => {

        const changedEntries = Object.keys(formData).reduce((acc, key) => {
            if (formData[key] !== initialFormData[key]) {
                acc[key] = formData[key];
            }
            return acc;
        }, {});

        if (Object.keys(changedEntries).length === 0) {
            alert("No changes found.");
            return;
        }

        const convertedEntries = {};
        Object.keys(changedEntries).forEach(id => {
            convertedEntries[id] = changedEntries[id] === "yes" ? 2 : 1;
        });

        try {
            await axios.post(`${apiUrl}/api/staff/sclr/submit`, {
                staffId: userId,
                appliedList: convertedEntries
            });
            alert("Data submitted successfully!");
        } catch (err) {
            alert("Submit failed!");
        }
    }

    const startIndex = (page - 1) * limit + 1;
    const endIndex = Math.min(page * limit, totalStudents);

    const headers = [
        { key: "sno", label: "S.No" },
        { key: "registerNo", label: "Reg No" },
        { key: "name", label: "Name" },
        { key: "category", label: "Category" },
        { key: "department", label: "Department" },
        { key: "applied", label: `Applied for ${userId === 'JMCTPS' ? 'TPS' : 'PPS'}` },
    ]

    if (loading && students.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center">
                <img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
                <p className="text-gray-600 font-medium text-lg">Loading students...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <HeaderTag label={`${userId === 'JMCTPS' ? 'Tamil Pudalvan Scheme' : 'Penmai Pudalvan Scheme'}`} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-lg font-semibold">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded shadow-md">
                    Total Applicants : <span className="float-right">{complete + pending}</span>
                </div>
                <div className="bg-white border-l-4 border-green-600 p-4 rounded shadow-md">
                    Completed : <span className="float-right">{complete}</span>
                </div>
                <div className="bg-white border-l-4 border-red-600 p-4 rounded shadow-md">
                    Pending : <span className="float-right">{pending}</span>
                </div>
            </div>
            <div className="text-right font-semibold mb-4 text-lg dark:text-gray-200">
                No of Students : {totalStudents}
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                <div className="max-h-[700px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
                        <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
                            <tr>
                                {headers.map((header) => (
                                    <th
                                        key={header.key}
                                        className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {header.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {students.length > 0 ? (
                                students.map((student, index) => (
                                    <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200">
                                        <td className="px-4 py-4">{(page - 1) * limit + index + 1}</td>
                                        <td className="px-4 py-4 uppercase">{student.registerNo}</td>
                                        <td className="px-4 py-4">{student.name}</td>
                                        <td className="px-4 py-4 uppercase">{student.category}</td>
                                        <td className="px-4 py-4">{student.department}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`applied-${student._id}`}
                                                        checked={formData[student._id] === "yes"}
                                                        onChange={() => handleSelection(student._id, "yes")}
                                                    />
                                                    YES
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`applied-${student._id}`}
                                                        checked={formData[student._id] === "no"}
                                                        onChange={() => handleSelection(student._id, "no")}
                                                    />
                                                    NO
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={headers.length} className="p-4 text-center text-gray-500 dark:text-gray-400">
                                        No students found for this page.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 0 && totalStudents > 0 && (
                <div className="flex justify-between items-center mt-6 p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Showing {startIndex} to {endIndex} of {totalStudents} entries
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className={PaginationButtonStyles}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                        </button>

                        <div className="px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Page {page} of {totalPages}
                        </div>

                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className={PaginationButtonStyles}
                        >
                            <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="text-right">
                <Button
                    label="Submit"
                    customBtnStyle="bg-blue-600 mt-6 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold"
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}

export default ScholarshipStaff;
