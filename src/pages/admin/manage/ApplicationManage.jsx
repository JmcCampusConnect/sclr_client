import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from "../../../assets/svg/Pulse.svg";

import ApplnManageTable from '../../../components/ApplnManage/ApplnManageTable';
import ApplnManageFilters from '../../../components/ApplnManage/ApplnManageFilters';
import ApplnManageActionBar from '../../../components/ApplnManage/ApplnManageActionBar';
import ApplnDeleteModal from '../../../components/ApplnManage/ApplnDeleteModal';

function ApplicationManage() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);

    const [filters, setFilters] = useState({
        category: "All",
        department: "All",
        batch: "All",
    });

    const [searchTerm, setSearchTerm] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
    }, []);

    useEffect(() => {

        let filtered = [...applications];

        if (filters.category !== "All") {
            filtered = filtered.filter(app => app.category === filters.category);
        }
        if (filters.department !== "All") {
            filtered = filtered.filter(app => app.department === filters.department);
        }
        if (filters.batch !== "All") {
            filtered = filtered.filter(app => app.yearofAddmission === filters.batch);
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
        setApplications(prev => prev.filter(app => app._id !== id));
        setFilteredApplications(prev => prev.filter(app => app._id !== id));
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

            <ApplnManageActionBar
                totalCount={filteredApplications.length}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            {/* Table */}
            <ApplnManageTable
                applications={filteredApplications}
                onDeleteClick={(app) => {
                    setSelectedAppln(app);
                    setShowDeleteModal(true);
                }}
            />

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
