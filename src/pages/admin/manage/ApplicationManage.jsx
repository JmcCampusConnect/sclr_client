import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from "../../../assets/svg/Pulse.svg";

import ApplnManageTable from '../../../components/ApplnManage/ApplnManageTable';
import ApplnManageFilters from '../../../components/ApplnManage/ApplnManageFilters';
import ApplnManageActionBar from '../../../components/ApplnManage/ApplnManageActionBar';
import ApplnDeleteModal from '../../../components/ApplnManage/ApplnDeleteModal';
import ApplnEditModal from '../../../components/ApplnManage/ApplnEditModal';

const primaryButtonClass = "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md";

function ApplicationManage() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [filters, setFilters] = useState({
        category: "All", department: "All",
        batch: "All", semester: "All"
    });
    const [searchTerm, setSearchTerm] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAppln, setEditingAppln] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAppln, setSelectedAppln] = useState(null);

    useEffect(() => {
        const fetchApplicationData = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/manage/appln/fetchApplicationData`);
                setApplications(res.data.data);
                setFilteredApplications(res.data.data);
            } catch (err) {
                console.error("Error fetching application data:", err);
                setError("Failed to load applications");
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplicationData();
    }, [apiUrl]);

    useEffect(() => {

        let filtered = [...applications];

        if (filters.category !== "All") {
            filtered = filtered.filter(app => app.category === filters.category);
        }

        if (filters.department !== "All") {
            filtered = filtered.filter(app => app.department === filters.department);
        }

        if (filters.batch !== "All") {
            filtered = filtered.filter(app => app.yearOfAdmission === filters.batch);
        }

        if (filters.semester !== "All") {
            const EVEN_SEMESTERS = ["II", "IV", "VI"];
            const ODD_SEMESTERS = ["I", "III", "V"];
            filtered = filtered.filter(app => {
                if (!app.semester) return false;
                const sem = app.semester.toUpperCase().trim();
                if (filters.semester === "EVEN") {
                    return EVEN_SEMESTERS.includes(sem);
                }
                if (filters.semester === "ODD") {
                    return ODD_SEMESTERS.includes(sem);
                }
                return true;
            });
        }

        if (searchTerm.trim() !== "") {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(app =>
                app.name?.toLowerCase().includes(lower) ||
                app.registerNo?.toLowerCase().includes(lower)
            );
        }

        setFilteredApplications(filtered);
    }, [filters, searchTerm, applications]);

    const handleDeleteApp = (id) => {
        setApplications(prev => prev.filter(app => app.applicationId !== id));
        setFilteredApplications(prev => prev.filter(app => app.applicationId !== id));
    };

    const handleRowClick = (app) => {
        setEditingAppln(app);
        setShowEditModal(true);
    };

    const handleUpdateApplication = (updatedFormData) => {
        setApplications(prev =>
            prev.map(app =>
                app.applicationId === updatedFormData.applicationId
                    ? { ...updatedFormData }
                    : app
            )
        );
        setFilteredApplications(prev =>
            prev.map(app =>
                app.applicationId === updatedFormData.applicationId
                    ? { ...updatedFormData }
                    : app
            )
        );
        setShowEditModal(false);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
                <p className="text-gray-600 font-medium text-lg">Loading applications...</p>
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
        <div className="relative">
            <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Application Management
                </h1>
            </header>

            <ApplnManageFilters filters={filters} setFilters={setFilters} />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 my-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                    <div className="flex justify-end gap-4 w-full">
                        <div className="flex items-center">
                            <button
                                className={primaryButtonClass}
                                onClick={() => navigate("/admin/adminRegisterApplication")}
                            >
                                Add Application
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ApplnManageActionBar
                totalCount={filteredApplications.length}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            {/* Table */}
            <ApplnManageTable
                onRowClick={handleRowClick}
                applications={filteredApplications}
                onDeleteClick={(app) => {
                    setSelectedAppln(app);
                    setShowDeleteModal(true);
                }}
            />

            {/* Edit Modal */}
            {showEditModal && editingAppln && (
                <ApplnEditModal
                    onRowClick={handleRowClick}
                    application={editingAppln}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={(updated) => handleUpdateApplication(updated)}
                />
            )}

            {/* Delete Modal */}
            {showDeleteModal && selectedAppln && (
                <ApplnDeleteModal
                    application={selectedAppln}
                    onClose={() => setShowDeleteModal(false)}
                    onDelete={handleDeleteApp}
                />
            )}
        </div>
    )
}

export default ApplicationManage;
