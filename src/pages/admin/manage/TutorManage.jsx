import React, { useState, useEffect } from 'react'
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
import TutorFilterSection from '../../../components/TutorManage/TutorFilterSection'
import TutorActionBar from '../../../components/TutorManage/TutorActionBar'
import TutorTable from '../../../components/TutorManage/TutorTable'
import AddTutorModal from '../../../components/TutorManage/AddTutorModal'
import EditTutorModal from '../../../components/TutorManage/EditTutorModal'
import DeleteTutorModal from '../../../components/TutorManage/DeleteTutorModal'

function Tutor() {

    const [addTutor, setAddTutor] = useState(null);
    const [editTutor, setEditTutor] = useState(null);
    const [deleteTutor, setDeleteTutor] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [filterFormData, setFilterFormData] = useState()
    const [tutors, setTutors] = useState([]);
    const [allTutors, setAllTutors] = useState([]);
    const [filteredTutors, setFilteredTutors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`${apiUrl}/api/tutor/fetchTutors`);
            setTutors(response.data.tutors);
            setAllTutors(response.data.tutors);
            setFilteredTutors(response.data.tutors);
        };

        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/tutor/departments`);
                setDepartments(response.data.departments);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

        fetchData();
        fetchDepartments();
    }, []);

    const dep = Object.values(departments).map(item => ({
        value: item.department,
        label: `${item.department} - ${item.departmentName}`
    }));

    const handleFilterForm = () => {

        if (!filterFormData) return;
        const filtered = allTutors.filter(tutor => {
            const matchesCategory =
                filterFormData.category === "All" || tutor.category === filterFormData.category;
            const matchesDepartment =
                filterFormData.department === "All" || tutor.department === filterFormData.department;
            const matchesBatch =
                filterFormData.batch === "All" || tutor.batch === filterFormData.batch;
            return matchesCategory && matchesDepartment && matchesBatch;
        })
        setFilteredTutors(filtered);
        setTutors(filtered);
    }

    // Search filter
    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setTutors(filteredTutors);
            return;
        }
        const searched = filteredTutors.filter(tutor =>
            tutor.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tutor.staffId.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setTutors(searched);
    }

    return (
        <>
            {/* Header */}
            <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Tutor Management
                </h1>
            </header>
            <TutorFilterSection
                depts={dep}
                filterForm={(e) => setFilterFormData(e)}
            />
            <TutorActionBar
                tutors={tutors}
                onClose={() => setAddTutor(null)}
                onAddTutor={() => setAddTutor({})}
                filterDropdownData={handleFilterForm}
                handleSearch={(e) => handleSearch(e)}
            />
            <TutorTable
                onEditTutor={setEditTutor}
                onDeleteTutor={setDeleteTutor}
                tutors={tutors}
            />
            {addTutor && (
                <AddTutorModal
                    tutor={addTutor}
                    onClose={() => setAddTutor(null)}
                />
            )}
            {editTutor && (
                <EditTutorModal
                    tutor={editTutor}
                    onClose={() => setEditTutor(null)}
                />
            )}
            {deleteTutor && (
                <DeleteTutorModal
                    tutor={deleteTutor}
                    onClose={() => setDeleteTutor(null)}
                />
            )}
        </>
    )
}

export default Tutor