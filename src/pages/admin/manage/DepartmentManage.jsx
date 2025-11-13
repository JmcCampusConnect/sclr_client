import React, { useEffect, useState } from "react";
import axios from "axios";
import DepartmentTable from "../../../components/DepartmentManage/DepartmentTable";
import AddDepartmentModal from "../../../components/DepartmentManage/AddDepartmentModal";
import DepartmentActionBar from "../../../components/DepartmentManage/DepartmentActionBar";
import EditDepartmentModal from "../../../components/DepartmentManage/EditDepartmentModal";
import DeleteDepartmentModal from "../../../components/DepartmentManage/DeleteDepartmentModal";
import Loading from "../../../assets/svg/Pulse.svg";

const apiUrl = import.meta.env.VITE_API_URL;

function Department() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editDepartment, setEditDepartment] = useState(null);
    const [deleteDepartments, setDeleteDepartments] = useState(null);
    const [depts, setDepts] = useState([]);
    const [allDepts, setAllDepts] = useState([]);
    const [filteredDepts, setFilteredDepts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDepts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${apiUrl}/api/dept/fetchDepts`);
            const data = response.data.depts || [];
            setDepts(data);
            setAllDepts(data);
            setFilteredDepts(data);
        } catch (error) {
            console.error("Error fetching departments:", error);
            setError("Failed to load department data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDepts();
    }, []);

    const handleDepartmentAdd = (newDept) => {
        setDepts((prev) => [...prev, newDept]);
        setFilteredDepts((prev) => [...prev, newDept]);
    };

    const handleEditDepartment = (updatedDept) => {
        setDepts((prev) =>
            prev.map((dept) =>
                dept._id === updatedDept._id ? updatedDept : dept
            )
        );
        setFilteredDepts((prev) =>
            prev.map((dept) =>
                dept._id === updatedDept._id ? updatedDept : dept
            )
        );
    };

    const handleDeleteDepartment = (deletedId) => {
        setDepts((prev) => prev.filter((dept) => dept._id !== deletedId));
        setFilteredDepts((prev) => prev.filter((dept) => dept._id !== deletedId));
    };

    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setDepts(filteredDepts);
            return;
        }
        const searched = filteredDepts.filter(
            (dept) =>
                dept.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dept.departmentName
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
        setDepts(searched);
    };


    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
                <p className="text-gray-600 font-medium text-lg">
                    Loading department data...
                </p>
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
            {/* Header */}
            <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Department Management
                </h1>
            </header>

            {/* Action Bar */}
            <DepartmentActionBar
                depts={depts}
                onAddDepartment={() => setShowAddModal(true)}
                onclose={() => setShowAddModal(false)}
                searchDepts={(e) => handleSearch(e)}
            />

            {/* Table */}
            <DepartmentTable
                depts={depts}
                onclose={() => setShowAddModal(false)}
                onEdit={(dept) => setEditDepartment(dept)}
                onDelete={(dept) => setDeleteDepartments(dept)}
            />

            {/* Modals */}
            {showAddModal && (
                <AddDepartmentModal
                    onClose={() => setShowAddModal(false)}
                    onAddDepartment={handleDepartmentAdd}
                />
            )}
            {editDepartment && (
                <EditDepartmentModal
                    deptData={editDepartment}
                    onClose={() => setEditDepartment(null)}
                    onEdit={handleEditDepartment}
                />
            )}
            {deleteDepartments && (
                <DeleteDepartmentModal
                    depts={deleteDepartments}
                    onClose={() => setDeleteDepartments(null)}
                    onDelete={handleDeleteDepartment}
                />
            )}
        </div>
    )
}

export default Department;