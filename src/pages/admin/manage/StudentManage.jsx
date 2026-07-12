import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import StudentFilterSection from "../../../components/StudentManage/StudentFilterSection";
import StudentActionBar from "../../../components/StudentManage/StudentActionBar";
import Loading from "../../../assets/svg/Pulse.svg";
import StudentManageTable from "../../../components/StudentManage/StudentManageTable";
import StudentEditModal from "../../../components/StudentManage/StudentEditModal";
import Toast from "../../../common/Toast";
import { debounce } from "../../../utils/debounce";

function StudentManage() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const queryClient = useQueryClient();

    // State management
    const [filters, setFilters] = useState({ category: "All", department: "All", semBased: "All" });
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 100,
        total: 0,
    });
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [toast, setToast] = useState(null);

    // Use ref to track if search is from user typing
    const isTypingRef = useRef(false);

    // Debounce search - use useRef to prevent recreation
    const debouncedSetSearchRef = useRef(
        debounce((value) => {
            setDebouncedSearchTerm(value);
            setPagination(prev => ({ ...prev, page: 1 }));
            isTypingRef.current = false;
        }, 600)
    );

    useEffect(() => {
        const debouncedFn = debouncedSetSearchRef.current;
        if (searchTerm !== debouncedSearchTerm) {
            isTypingRef.current = true;
            debouncedFn(searchTerm);
        }
        return () => {
            debouncedFn.cancel();
        };
    }, [searchTerm, debouncedSearchTerm]);

    // Fetch departments
    const { data: departmentsData } = useQuery({
        queryKey: ['departments'],
        queryFn: async () => {
            const response = await axios.get(`${apiUrl}/api/tutor/departments`);
            return response.data.departments || [];
        },
        staleTime: 5 * 60 * 1000,
    });

    // Fetch students with pagination and filters
    const {
        data: studentsData,
        isLoading,
        error,
        refetch,
        isFetching
    } = useQuery({
        queryKey: ['students', debouncedSearchTerm, filters, pagination.page, pagination.limit],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                search: debouncedSearchTerm || '',
                category: filters.category || 'All',
                department: filters.department || 'All',
                semBased: filters.semBased || 'All',
            });
            const response = await axios.get(`${apiUrl}/api/studentManage/fetchStudentData?${params}`);
            return response.data;
        },
        keepPreviousData: true,
        staleTime: 30000,
        enabled: !isTypingRef.current || !!debouncedSearchTerm,
    });

    // Update student mutation
    const updateStudentMutation = useMutation({
        mutationFn: async ({ registerNo, data }) => {
            const response = await axios.put(
                `${apiUrl}/api/studentManage/updateStudent/${registerNo}`, data
            );
            return response.data;
        },
        onSuccess: (data) => {
            showToast('success', data.message || 'Student updated successfully!');
            queryClient.invalidateQueries(['students']);
            setIsModalOpen(false);
            setSelectedStudent(null);
        },
        onError: (error) => {
            showToast('error', error.response?.data?.message || 'Failed to update student. Please try again.');
        },
    });

    // Quick save mutation 
    const quickSaveMutation = useMutation({
        mutationFn: async ({ registerNo, data }) => {
            const response = await axios.put(
                `${apiUrl}/api/studentManage/quickSaveStudent/${registerNo}`,
                data
            );
            return response.data;
        },
        onSuccess: (data) => {
            showToast('success', data.message || 'Student updated successfully!');
            queryClient.invalidateQueries(['students']);
        },
        onError: (error) => {
            showToast('error', error.response?.data?.message || 'Failed to update student.');
        },
    });

    // Delete student mutation
    const deleteStudentMutation = useMutation({
        mutationFn: async (registerNo) => {
            const response = await axios.delete(
                `${apiUrl}/api/studentManage/deleteStudent/${registerNo}`
            );
            return response.data;
        },
        onSuccess: (data) => {
            showToast('success', data.message || 'Student deleted successfully!');
            queryClient.invalidateQueries(['students']);
            setIsDeleteModalOpen(false);
            setStudentToDelete(null);
        },
        onError: (error) => {
            showToast('error', error.response?.data?.message || 'Failed to delete student. Please try again.');
            setIsDeleteModalOpen(false);
        },
    });

    // Show toast notification - memoized
    const showToast = useCallback((type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 5000);
    }, []);

    // Handle filter changes
    const handleFilterChange = useCallback((filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    // Handle page change
    const handlePageChange = useCallback((newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
        const tableElement = document.querySelector('.overflow-x-auto');
        if (tableElement) {
            tableElement.scrollTop = 0;
        }
    }, []);

    // Handle limit change
    const handleLimitChange = useCallback((newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    }, []);

    // Handle edit student
    const handleEditStudent = useCallback((student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    }, []);

    // Handle delete student - open modal
    const handleDeleteStudent = useCallback((student) => {
        if (student.hasDistribution) {
            showToast('error', 'Cannot delete student with distribution records.');
            return;
        }
        setStudentToDelete(student);
        setIsDeleteModalOpen(true);
    }, [showToast]);

    // Confirm delete
    const confirmDelete = useCallback(async () => {
        if (studentToDelete) {
            await deleteStudentMutation.mutateAsync(studentToDelete.registerNo);
        }
    }, [studentToDelete, deleteStudentMutation]);

    // Close delete modal
    const handleCloseDeleteModal = useCallback(() => {
        setIsDeleteModalOpen(false);
        setStudentToDelete(null);
    }, []);

    // Handle quick save from table
    const handleQuickSave = useCallback(async (registerNo, data) => {
        await quickSaveMutation.mutateAsync({ registerNo, data });
    }, [quickSaveMutation]);

    // Close modal
    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedStudent(null);
    }, []);

    // Memoized computed values
    const totalStudents = useMemo(() => studentsData?.pagination?.total || 0, [studentsData]);
    const studentList = useMemo(() => studentsData?.students || [], [studentsData]);
    const departments = useMemo(() => departmentsData || [], [departmentsData]);

    // Memoize setSearchTerm to prevent unnecessary re-renders
    const handleSetSearchTerm = useCallback((value) => {
        setSearchTerm(value);
    }, []);

    const handleModalSave = useCallback(async (studentData) => {
        const isRegisterNoChanged = selectedStudent?.registerNo !== studentData.registerNo;
        if (isRegisterNoChanged) {
            const confirmed = window.confirm(
                `⚠️ You are changing the Register Number from "${selectedStudent.registerNo}" to "${studentData.registerNo}".\n\n` +
                `This will update the register number in:\n` +
                `• Student Records\n` +
                `• Application Records (${studentData.applicationsCount || 'multiple'})\n` +
                `• Transaction Records (${studentData.distributionsCount || 'multiple'})\n\n` +
                `Are you sure you want to proceed?`
            );
            if (!confirmed) { return }
        }
        await updateStudentMutation.mutateAsync({
            registerNo: selectedStudent.registerNo,
            data: studentData
        });
    }, [selectedStudent, updateStudentMutation]);

    // Loading state
    if (isLoading && !studentsData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
                <p className="text-gray-600 font-medium text-lg">Loading students...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-red-600 font-semibold">Failed to load students. Please try again.</p>
                <button
                    onClick={() => refetch()}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <>
            <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Student Manage
                </h1>
            </header>

            <StudentFilterSection
                departments={departments}
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            <StudentActionBar
                totalCount={totalStudents}
                searchTerm={searchTerm}
                setSearchTerm={handleSetSearchTerm}
            />

            <StudentManageTable
                students={studentList}
                isLoading={isLoading || isFetching}
                onQuickSave={handleQuickSave}
                onEditStudent={handleEditStudent}
                onDeleteStudent={handleDeleteStudent}
                pagination={pagination}
                totalCount={totalStudents}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />

            {isModalOpen && selectedStudent && (
                <StudentEditModal
                    student={selectedStudent}
                    onClose={handleCloseModal}
                    onSave={handleModalSave}
                    isLoading={updateStudentMutation.isLoading}
                    departments={departments}
                />
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && studentToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[90%] max-w-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-200 scale-100">

                        {/* Header with Icon */}
                        <div className="flex flex-col items-center text-center px-8 pt-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="bg-gradient-to-tr from-red-500 to-red-600 text-white rounded-full p-5 shadow-md mb-5">
                                <FontAwesomeIcon icon={faTriangleExclamation} className="text-3xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Confirm Deletion
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-md leading-relaxed max-w-sm">
                                This action <span className="font-semibold text-red-500">cannot be undone.</span>
                                <span> Are you sure you want to permanently remove this student from the system?</span>
                            </p>
                        </div>

                        {/* Student Summary Card */}
                        <div className="px-8 py-5">
                            <div className="rounded-xl dark:bg-gray-800/70 p-4 border border-gray-200 dark:border-gray-700 shadow-sm text-center">
                                <p className="text-md text-gray-500 dark:text-gray-400 font-mono">
                                    Register No : {studentToDelete.registerNo}
                                </p>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    {studentToDelete.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {studentToDelete.department} • {studentToDelete.category}
                                </p>
                                {studentToDelete.applicationCount > 0 && (
                                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <p className="text-blue-700 dark:text-blue-300 text-sm font-semibold">
                                            ℹ️ This student has {studentToDelete.applicationCount} application record(s)
                                        </p>
                                        <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                                            These records will be permanently deleted
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={handleCloseDeleteModal}
                                className="px-5 py-2.5 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleteStudentMutation.isLoading}
                                className="px-5 py-2.5 rounded-lg font-semibold bg-gradient-to-tr from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleteStudentMutation.isLoading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}

export default StudentManage;