import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 20;


    const fetchData = async (page = 1, activeFilters = filters, activeSearchTerm = searchTerm) => {

        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(pageSize),
            });

            if (activeSearchTerm?.trim()) {
                params.set("search", activeSearchTerm.trim());
            }

            if (activeFilters.applicationStatus !== "all") {
                params.set("applicationStatus", activeFilters.applicationStatus);
            }

            if (activeFilters.sclrType !== "all") {
                params.set("sclrType", activeFilters.sclrType);
            }

            if (activeFilters.tutorVerification !== "all") {
                params.set("tutorVerification", activeFilters.tutorVerification);
            }

            if (activeFilters.courseType !== "all") {
                params.set("courseType", activeFilters.courseType);
            }

            if (activeFilters.year !== "all") {
                params.set("year", activeFilters.year);
            }

            if (activeFilters.gender !== "all") {
                params.set("gender", activeFilters.gender);
            }

            if (activeFilters.stream !== "all") {
                params.set("stream", activeFilters.stream);
            }

            const selectedSpecialCategories = (activeFilters.specialCategories || []).filter(cat => cat !== "All");
            if (selectedSpecialCategories.length > 0) {
                params.set("specialCategories", selectedSpecialCategories.join(","));
            }

            const [studentsRes, donorsRes] = await Promise.all([
                axios.get(`${apiUrl}/api/admin/application/fetchStudents`, { params }),
                axios.get(`${apiUrl}/api/admin/application/fetchDonors`),
            ]);

            const sortedStudents = (studentsRes.data.data || []).sort(
                (a, b) => a.applicationStatus - b.applicationStatus
            );
            setStudents(sortedStudents);
            setDonors(donorsRes.data.donors || []);
            setCurrentPage(studentsRes.data.pagination?.page || page);
            setTotalPages(studentsRes.data.pagination?.totalPages || 1);
            setTotalItems(studentsRes.data.pagination?.totalItems || sortedStudents.length);
        } catch (err) {
            console.error("Error fetching data for admin application:", err);
            setError("Failed to load data. Please try again later.");
        } finally { setIsLoading(false) }
    }

    useEffect(() => {
        fetchData(1, filters, searchTerm);
    }, [
        filters.applicationStatus,
        filters.sclrType,
        filters.tutorVerification,
        filters.courseType,
        filters.year,
        filters.gender,
        filters.stream,
        JSON.stringify(filters.specialCategories),
        searchTerm,
    ]);

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

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            fetchData(page, filters, searchTerm);
        }
    };

    const handleSubmissionSuccess = () => {
        closeModal();
        navigate("/admin/sclrAdministration");
        fetchData(1, filters, searchTerm);
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
                        totalStudents={totalItems}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />

                    <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <span>Showing {students.length} of {totalItems} applications</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span>Page {currentPage} / {totalPages}</span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    <ApplicationTable
                        students={students}
                        openAcceptModal={openAcceptModal}
                        openRejectModal={openRejectModal}
                        currentPage={currentPage}
                        pageSize={pageSize}
                    />

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