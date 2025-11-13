import React, { useState, useEffect } from 'react'
import axios from "axios";
import StudentFilterSection from '../../../components/StudentManage/StudentFilterSection';
import StudentActionBar from '../../../components/StudentManage/StudentActionBar';
import Loading from '../../../assets/svg/Pulse.svg';
import StudentManageTable from '../../../components/StudentManage/StudentManageTable';

function StudentManage() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/studentManage/fetchStudentData`);
                setStudents(response.data.students);
            } catch (err) {
                console.error("Error fetching student data:", err);
                setError("Failed to load students. Please try again later.");
            } finally {
                setIsLoading(false); 
            }
        };
        fetchStudentData();
    }, [apiUrl]);

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
            <StudentFilterSection />
            <StudentActionBar />
            <StudentManageTable students={students} />
        </>
    );
}

export default StudentManage;
