import React, { useEffect, useState } from "react";
import axios from "axios";
import { Download } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import FilterSection from "../../components/SclrAdministration/FilterSection";
import ActionBar from "../../components/SclrAdministration/ActionBar";
import ApplicationTable from "../../components/SclrAdministration/ApplicationTable";
import AcceptModal from "../../components/Others/AcceptModal";
import RejectModal from "../../components/Others/RejectModal";
import Loading from "../../assets/svg/Pulse.svg";

const primaryButtonClass = "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 shadow-md";

const apiUrl = import.meta.env.VITE_API_URL;

function SclrAdministration() {

    const location = useLocation();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [donors, setDonors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [filters, setFilters] = useState({
        applicationStatus: "0",
        sclrType: "all",
        tutorVerification: "all",
        courseType: "all",
        year: "all",
        gender: "all",
        stream: "all",
        specialCategories: ["All", "General", "Mu-addin", "Hazrath", "Father Mother Separated", "Father Expired", "Single Parent", "Orphan"]
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedStudents, setSearchedStudents] = useState([]);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(100);
    const [paginatedStudents, setPaginatedStudents] = useState([]);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [studentsRes, donorsRes] = await Promise.all([
                axios.get(`${apiUrl}/api/admin/application/fetchStudents`),
                axios.get(`${apiUrl}/api/admin/application/fetchDonors`),
            ]);
            const sortedStudents = studentsRes.data.data.sort(
                (a, b) => a.applicationStatus - b.applicationStatus
            );
            setStudents(sortedStudents);
            setDonors(donorsRes.data.donors);
        } catch (err) {
            console.error("Error fetching data for admin application:", err);
            setError("Failed to load data. Please try again later.");
        } finally { setIsLoading(false) }
    }

    useEffect(() => { fetchData() }, []);

    // Apply filters with AND gate logic - UPDATED with all filters
    useEffect(() => {

        let filtered = [...students];

        // Filter by application status (AND gate)
        if (filters.applicationStatus !== "all") {
            filtered = filtered.filter(student =>
                String(student.applicationStatus) === filters.applicationStatus
            );
        }

        // Filter by scholarship type (AND gate)
        if (filters.sclrType !== "all") {
            filtered = filtered.filter(student =>
                student.sclrType === filters.sclrType
            );
        }

        // Filter by tutor verification (AND gate)
        if (filters.tutorVerification !== "all") {
            filtered = filtered.filter(student =>
                String(student.tutorVerification) === filters.tutorVerification
            );
        }

        // Filter by course type (AND gate)
        if (filters.courseType !== "all") {
            filtered = filtered.filter(student =>
                student.graduate?.toLowerCase() === filters.courseType.toLowerCase()
            );
        }

        // Filter by year (AND gate)
        if (filters.year !== "all") {
            filtered = filtered.filter(student => {
                // Map semester to year
                const semesterMap = {
                    'I': 'I',
                    'II': 'I',
                    'III': 'II',
                    'IV': 'II',
                    'V': 'III',
                    'VI': 'III'
                };
                const studentYear = semesterMap[student.semester];
                return studentYear === filters.year;
            });
        }

        // Filter by gender (AND gate)
        if (filters.gender !== "all") {
            filtered = filtered.filter(student => {
                // Map category to gender
                const genderMap = {
                    'Aided': 'Men',
                    'SFM': 'Men',
                    'SFW': 'Women'
                };
                const studentGender = genderMap[student.category];
                return studentGender === filters.gender;
            });
        }

        // Filter by stream (AND gate)
        if (filters.stream !== "all") {
            filtered = filtered.filter(student =>
                student.category === filters.stream
            );
        }

        // Filter by special categories
        if (filters.specialCategories && filters.specialCategories.length > 0) {
            const categoriesToFilter = filters.specialCategories.filter(cat => cat !== "All");
            if (categoriesToFilter.length === 0) {
                // If "All" is selected or no specific categories, show all
            } else {
                filtered = filtered.filter(student => {
                    return categoriesToFilter.includes(student.specialCategory);
                });
            }
        }

        setFilteredStudents(filtered);
        setCurrentPage(1);
    }, [filters, students]);

    // Apply search to filtered students only
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setSearchedStudents(filteredStudents);
        } else {
            const lower = searchTerm.toLowerCase();
            const searched = filteredStudents.filter(student =>
                student.name?.toLowerCase().includes(lower) ||
                student.registerNo?.toLowerCase().includes(lower) ||
                student.department?.toLowerCase().includes(lower)
            );
            setSearchedStudents(searched);
        }
        setCurrentPage(1);
    }, [searchTerm, filteredStudents]);

    // Apply pagination
    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginated = searchedStudents.slice(startIndex, endIndex);
        setPaginatedStudents(paginated);
    }, [searchedStudents, currentPage, itemsPerPage]);

    // Calculate total pages
    const totalPages = Math.ceil(searchedStudents.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            const tableElement = document.querySelector('.table-container');
            if (tableElement) {
                tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    // Download Excel function
    const handleDownloadExcel = () => {

        if (!searchedStudents || searchedStudents.length === 0) {
            alert("No data available to download.");
            return;
        }

        try {
            const excelData = searchedStudents.map((student, index) => ({
                "S.No": index + 1,
                "Register No": student.registerNo || "N/A",
                "Name": student.name || "N/A",
                "Semester": student.semester || "N/A",
                "Department": student.department || "N/A",
                "Last Year (₹)": student.lastYearCreditedAmount
                    ? `₹ ${student.lastYearCreditedAmount.toLocaleString("en-IN")}`
                    : "N/A",
                "Current Year (₹)": student.currentYearCreditedAmount
                    ? `₹ ${student.currentYearCreditedAmount.toLocaleString("en-IN")}`
                    : "N/A",
                "Application Status": ["In Progress", "Accepted", "Rejected"][student.applicationStatus] || "N/A",
                "Application Type": student.sclrType || "N/A",
                "Tutor Verification": student.tutorVerification === 1 ? "Verified" : "Pending",
                "Course Type": student.graduate || "N/A",
                "Year": (() => {
                    const semesterMap = {
                        'I': 'I', 'II': 'I', 'III': 'II', 'IV': 'II', 'V': 'III', 'VI': 'III'
                    };
                    return semesterMap[student.semester] || "N/A";
                })(),
                "Gender": (() => {
                    const genderMap = {
                        'Aided': 'Men',
                        'SFM': 'Men',
                        'SFW': 'Women'
                    };
                    return genderMap[student.category] || "N/A";
                })(),
                "Stream": student.category || "N/A",
                "Special Categories": student.specialCategory || "N/A",
            }));

            const ws = XLSX.utils.json_to_sheet(excelData);

            // Set column widths
            const colWidths = [
                { wch: 6 },   // S.No
                { wch: 15 },  // Register No
                { wch: 25 },  // Name
                { wch: 10 },  // Semester
                { wch: 20 },  // Department
                { wch: 15 },  // Last Year
                { wch: 15 },  // Current Year
                { wch: 18 },  // Application Status
                { wch: 18 },  // Application Type
                { wch: 18 },  // Tutor Verification
                { wch: 15 },  // Course Type
                { wch: 10 },  // Year
                { wch: 10 },  // Gender
                { wch: 15 },  // Stream
                { wch: 25 },  // Special Categories
            ];
            ws['!cols'] = colWidths;

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Applications");

            // Add filter information sheet
            const filterInfo = [
                ["Filter Information"],
                ["Generated on:", new Date().toLocaleString()],
                ["Total Applications:", searchedStudents.length],
                ["Applied Filters:"],
                ["Application Status:", filters.applicationStatus !== "all" ? ["In Progress", "Accepted", "Rejected"][parseInt(filters.applicationStatus)] : "All"],
                ["Application Type:", filters.sclrType !== "all" ? filters.sclrType : "All"],
                ["Tutor Verification:", filters.tutorVerification !== "all" ? (filters.tutorVerification === "1" ? "Verified" : "Pending") : "All"],
                ["Course Type:", filters.courseType !== "all" ? filters.courseType : "All"],
                ["Year:", filters.year !== "all" ? filters.year : "All"],
                ["Gender:", filters.gender !== "all" ? filters.gender : "All"],
                ["Stream:", filters.stream !== "all" ? filters.stream : "All"],
                ["Search Term:", searchTerm || "None"],
                ["Special Categories:", filters.specialCategories.filter(cat => cat !== "All").join(", ") || "All"],
            ];

            const wsFilter = XLSX.utils.aoa_to_sheet(filterInfo);
            XLSX.utils.book_append_sheet(wb, wsFilter, "Filter Info");

            // Format: Scholarship_Applications_YYYY-MM-DD.xlsx
            const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const filename = `Scholarship_Applications_${date}.xlsx`;

            XLSX.writeFile(wb, filename);
        } catch (error) {
            console.error("Error downloading Excel file:", error);
            alert("Failed to download Excel file. Please try again.");
        }
    };

    const isViewPage = location.pathname.endsWith("/view");

    const openAcceptModal = (student) => {
        setSelectedStudent(student);
        setShowAcceptModal(true);
        setShowRejectModal(false);
    };

    const openRejectModal = (student) => {
        setSelectedStudent(student);
        setShowRejectModal(true);
        setShowAcceptModal(false);
    };

    const closeModal = () => {
        setShowAcceptModal(false);
        setShowRejectModal(false);
        setSelectedStudent(null);
    };

    const handleSubmissionSuccess = () => {
        closeModal();
        navigate("/admin/sclrAdministration");
        fetchData();
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
                <p className="text-gray-600 font-medium text-lg">Loading scholarship applications...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {isViewPage ? (
                <Outlet context={{ fetchData }} />
            ) : (
                <>
                    {/* Header */}
                    <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                            Scholarship Administration
                        </h1>
                    </header>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                            <div className="flex justify-end gap-4 w-full">
                                <button
                                    onClick={handleDownloadExcel}
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Excel
                                </button>
                                <button
                                    className={primaryButtonClass}
                                    onClick={() => navigate(`/admin/rejectApplications`)}
                                >
                                    Reject Ineligible Applications
                                </button>
                            </div>
                        </div>
                    </div>

                    <FilterSection
                        filters={filters}
                        setFilters={setFilters}
                    />

                    <ActionBar
                        totalStudents={searchedStudents.length}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />

                    <ApplicationTable
                        students={paginatedStudents}
                        openAcceptModal={openAcceptModal}
                        openRejectModal={openRejectModal}
                        currentPage={currentPage}
                        pageSize={itemsPerPage}
                    />

                    {/* Pagination Controls - Bottom */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            Page {currentPage} of {totalPages}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                            >
                                Previous
                            </button>

                            <div className="flex items-center gap-1">
                                {(() => {
                                    const pages = [];
                                    const maxVisible = 7;
                                    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                                    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

                                    if (endPage - startPage + 1 < maxVisible) {
                                        startPage = Math.max(1, endPage - maxVisible + 1);
                                    }

                                    if (startPage > 1) {
                                        pages.push(1);
                                        if (startPage > 2) pages.push('...');
                                    }

                                    for (let i = startPage; i <= endPage; i++) {
                                        pages.push(i);
                                    }

                                    if (endPage < totalPages) {
                                        if (endPage < totalPages - 1) pages.push('...');
                                        pages.push(totalPages);
                                    }

                                    return pages.map((page, idx) => (
                                        page === '...' ? (
                                            <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">...</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-3 py-1.5 text-sm rounded-lg transition ${currentPage === page
                                                    ? 'bg-indigo-600 text-white font-semibold'
                                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ));
                                })()}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    <AcceptModal
                        donors={donors}
                        selectedStudent={selectedStudent}
                        showAcceptModal={showAcceptModal}
                        closeModal={closeModal}
                        onSubmissionSuccess={handleSubmissionSuccess}
                    />

                    <RejectModal
                        selectedStudent={selectedStudent}
                        showRejectModal={showRejectModal}
                        closeModal={closeModal}
                        refreshStudents={handleSubmissionSuccess}
                    />
                </>
            )}
        </div>
    )
}

export default SclrAdministration;