import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentFilterSection from "../../../components/StudentManage/StudentFilterSection";
import StudentActionBar from "../../../components/StudentManage/StudentActionBar";
import Loading from "../../../assets/svg/Pulse.svg";
import StudentManageTable from "../../../components/StudentManage/StudentManageTable";

function StudentManage() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [filters, setFilters] = useState({ category: "All", department: "All" });
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/tutor/departments`);
                setDepartments(response.data.departments);
            } catch (error) {
                console.error("Error fetching departments : ", error);
            }
        };
        fetchDepartments();
    }, []);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/studentManage/fetchStudentData`);
                setStudents(response.data.students);
                setFilteredStudents(response.data.students);
            } catch (err) {
                console.error("Error fetching student data:", err);
                setError("Failed to load students. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudentData();
    }, [apiUrl]);

    useEffect(() => {

        let filtered = [...students];

        if (filters.category && filters.category !== "All") {
            filtered = filtered.filter((s) => s.category === filters.category);
        }

        if (filters.department && filters.department !== "All") {
            filtered = filtered.filter((s) => s.department === filters.department);
        }

        if (searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (s) =>
                    s.name.toLowerCase().includes(term) ||
                    s.registerNo.toLowerCase().includes(term)
            );
        }

        setFilteredStudents(filtered);
    }, [filters, searchTerm, students]);

    if (isLoading) {
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
        <>
            <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Student Manage
                </h1>
            </header>

            <StudentFilterSection
                departments={departments}
                filters={filters}
                setFilters={setFilters}
            />

            <StudentActionBar
                totalCount={filteredStudents.length}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <StudentManageTable
                students={filteredStudents}
            />
        </>
    )
}

export default StudentManage;