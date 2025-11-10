import React, { useEffect, useState } from 'react'
import axios from 'axios';
import DepartmentTable from '../../../components/Department/DepartmentTable';
import AddDepartmentModal from '../../../components/Department/AddDepartmentModal';
import DepartmentActionBar from '../../../components/Department/DepartmentActionBar';
import EditDepartmentModal from '../../../components/Department/EditDepartmentModal';
import DeleteDepartmentModal from '../../../components/Department/DeleteDepartmentModal';

const apiUrl = import.meta.env.VITE_API_URL;

function Department() {

    const [showAddModal, setShowAddModal] = useState(false);
    const [editDepartment, setEditDepartment] = useState(null);
    const [deleteDepartments, setDeleteDepartments] = useState(null);
    const [depts, setDepts] = useState([]);
    const [allDepts, setAllDepts] = useState([]);
    const [filteredDepts, setFilteredDepts] = useState([]);

    const fetchDepts = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/dept/fetchDepts`);
            setDepts(response.data.depts);
            setAllDepts(response.data.depts);
            setFilteredDepts(response.data.depts);
        } catch (error) {
            console.error("Error fetching depts data : ", error);
        }
    }

    useEffect(() => { fetchDepts() }, []);

    const handleDepartmentAdd = (newDonor) => { setDonors((prev) => [...prev, newDonor]) }

    const handleEditDonor = (updatedDonor) => {
        setDonors((prev) => prev.map((depts) =>
            (depts.donorId === updatedDonor.donorId ? updatedDonor : depts))
        )
    }

    const handleDeleteDonor = (deletedId) => { setDonors((prev) => prev.filter((depts) => depts.donorId !== deletedId)) }

    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setDepts(filteredDepts);
            return;
        }
        const searched = filteredDepts.filter((dept) =>
            dept.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (dept.departmentName && dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setDepts(searched);
    };

    return (
        <div className="relative">
            <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Department Management
                </h1>
            </header>

            <DepartmentActionBar
                depts={depts}
                onAddDepartment={() => setShowAddModal(true)}
                onclose={() => setShowAddModal(false)}
                searchDepts={(e) => handleSearch(e)}
            />
            <DepartmentTable
                depts={depts}
                onclose={() => setShowAddModal(false)}
                onEdit={(depts) => setEditDepartment(depts)}
                onDelete={(depts) => setDeleteDepartments(depts)}
            />
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
                    onEdit={handleEditDonor}
                />
            )}
            {deleteDepartments && (
                <DeleteDepartmentModal
                    depts={deleteDepartments}
                    onClose={() => setDeleteDepartments(null)}
                    onDelete={handleDeleteDonor}
                />
            )}
        </div>
    )
}

export default Department