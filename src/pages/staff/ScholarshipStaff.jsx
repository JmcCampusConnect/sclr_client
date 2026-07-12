import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderTag from "../../common/HeaderTag";
import StaffStatus from "../../components/Others/StaffStatus";
import axios from "axios";
import Button from "../../common/Button";
import Loading from "../../assets/svg/Pulse.svg";

function ScholarshipStaff() {

    const { userId } = useParams();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [counts, setCounts] = useState({
        totalApplications: 0,
        completed: 0,
        pending: 0
    });
    const [formData, setFormData] = useState({});
    const [initialFormData, setInitialFormData] = useState({});
    const [viewMode, setViewMode] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {

        const fetchStudents = async () => {

            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${apiUrl}/api/staff/sclr/students?staffId=${userId}`);
                const fetchedStudents = response.data.data || [];
                setStudents(fetchedStudents);

                // Set counts for StaffStatus component
                setCounts({
                    totalApplications: response.data.total || fetchedStudents.length,
                    completed: response.data.complete || 0,
                    pending: response.data.pending || 0
                });

                const initial = {};
                fetchedStudents.forEach(stu => {
                    // Map stored value (1 or 2) back to "yes"/"no" for display
                    const value = stu.governmentScholarship === 1 ? "no" :
                        stu.governmentScholarship === 2 ? "yes" : "";
                    initial[stu._id] = value;
                });
                setFormData(initial);
                setInitialFormData(initial);
            } catch (err) {
                setError("Failed to fetch student data");
                console.error("Error fetching students:", err);
            } finally { setLoading(false) }
        }
        fetchStudents();
    }, [apiUrl, userId]);

    const handleSelection = (studentId, value) => {
        setFormData(prev => ({ ...prev, [studentId]: value }));
    };

    const handleSubmit = async () => {
        const changed = {};
        Object.keys(formData).forEach(id => {
            if (formData[id] !== initialFormData[id]) {
                changed[id] = formData[id] === "yes" ? 2 : 1;
            }
        });
        if (Object.keys(changed).length === 0) return alert("No changes found.");
        try {
            await axios.post(`${apiUrl}/api/staff/sclr/submit`, {
                staffId: userId,
                appliedList: changed
            });
            alert("Data submitted successfully!");
            window.location.reload();
        } catch (err) {
            console.log('Error in submitting data : ', err)
            alert("Submit failed!");
        }
    };

    // Filter data based on view mode and search
    const getFilteredData = () => {
        let filtered = students;

        // Filter by view mode
        if (viewMode === 'pending') {
            filtered = students.filter(stu =>
                stu.governmentScholarship === 0 || stu.governmentScholarship === undefined
            );
        } else if (viewMode === 'completed') {
            filtered = students.filter(stu =>
                stu.governmentScholarship === 1 || stu.governmentScholarship === 2
            );
        }

        // Filter by search term
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(st =>
                st.registerNo?.toLowerCase().includes(search) ||
                st.name?.toLowerCase().includes(search) ||
                st.department?.toLowerCase().includes(search) ||
                st.category?.toLowerCase().includes(search)
            );
        }

        return filtered;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <img src={Loading} className="w-24 h-24 animate-spin" />
                <p className="text-gray-600 text-lg">Loading students...</p>
            </div>
        );
    }

    const schemeMap = {
        JMCGSA: "Government Scholarship - Aided",
        JMCGSM: "Government Scholarship - SFM",
        JMCGSW: "Government Scholarship - SFW",
    };

    if (error) return <p className="text-red-600 text-center">{error}</p>;

    const filteredData = getFilteredData();

    // Headers for pending view
    const pendingHeaders = [
        { key: "sno", label: "S.No" },
        { key: "registerNo", label: "Reg No" },
        { key: "name", label: "Name" },
        { key: "category", label: "Category" },
        { key: "department", label: "Department" },
        { key: "applied", label: "Government Scholarship" },
    ];

    // Headers for completed view (simplified)
    const completedHeaders = [
        { key: "sno", label: "S.No" },
        { key: "registerNo", label: "Reg No" },
        { key: "name", label: "Name" },
        { key: "category", label: "Category" },
        { key: "department", label: "Department" },
        { key: "status", label: "Status" },
    ];

    const currentHeaders = viewMode === 'pending' ? pendingHeaders : completedHeaders;

    return (
        <div>

            <HeaderTag label={schemeMap[userId] || "Scholarship"} />

            {/* Staff Status Component */}
            <StaffStatus counts={counts} />

            {/* Search and Filter Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6 mb-4">
                {/* Search Bar - Left Side */}
                <div className="relative w-full sm:w-72 md:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <svg
                            className="h-4 w-4 text-gray-400 group-focus-within:text-gray-500 transition-colors duration-200"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2.5"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Reg No, Name, Dept..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none text-gray-900 dark:text-gray-100 transition-all duration-200"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Filter Buttons - Right Side */}
                <div className="flex items-center gap-1.5 p-2 bg-gray-100 dark:bg-gray-900 rounded-xl w-full sm:w-auto">
                    <button
                        onClick={() => setViewMode('pending')}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] flex-1 sm:flex-none ${viewMode === 'pending'
                            ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Pending</span>
                        <span className={`ml-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-md transition-colors duration-200 ${viewMode === 'pending'
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}>
                            {counts.pending}
                        </span>
                    </button>

                    <button
                        onClick={() => setViewMode('completed')}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] flex-1 sm:flex-none ${viewMode === 'completed'
                            ? 'bg-green-600 text-white shadow-sm shadow-green-600/20'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Completed</span>
                        <span className={`ml-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-md transition-colors duration-200 ${viewMode === 'completed'
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}>
                            {counts.completed}
                        </span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                <div className="max-h-[700px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
                        <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
                            <tr>
                                {currentHeaders.map((header) => (
                                    <th
                                        key={header.key}
                                        className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {header.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredData.length > 0 ? (
                                filteredData.map((student, index) => {
                                    if (viewMode === 'completed') {
                                        // COMPLETED VIEW - Read-only display
                                        return (
                                            <tr
                                                key={student._id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200 bg-green-50/30 dark:bg-green-900/10"
                                            >
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white uppercase">
                                                    {student.registerNo}
                                                </td>
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                    {student.name}
                                                </td>
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white uppercase">
                                                    {student.category}
                                                </td>
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                    {student.department}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold inline-block min-w-[80px] ${student.governmentScholarship === 2
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                                        }`}>
                                                        {student.governmentScholarship === 2 ? 'YES' : 'NO'}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    // PENDING VIEW - Editable inputs
                                    return (
                                        <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200">
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white uppercase">
                                                {student.registerNo}
                                            </td>
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                {student.name}
                                            </td>
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white uppercase">
                                                {student.category}
                                            </td>
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                {student.department}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-center gap-4">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name={`applied-${student._id}`}
                                                            checked={formData[student._id] === "yes"}
                                                            onChange={() => handleSelection(student._id, "yes")}
                                                            className="w-4 h-4 text-blue-600"
                                                        />
                                                        <span className="text-sm font-medium">YES</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name={`applied-${student._id}`}
                                                            checked={formData[student._id] === "no"}
                                                            onChange={() => handleSelection(student._id, "no")}
                                                            className="w-4 h-4 text-red-600"
                                                        />
                                                        <span className="text-sm font-medium">NO</span>
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={currentHeaders.length}
                                        className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base"
                                    >
                                        {searchTerm ? `No ${viewMode === 'pending' ? 'pending' : 'completed'} students found matching "${searchTerm}"` : `No ${viewMode === 'pending' ? 'pending' : 'completed'} student data available.`}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Submit button - only show in pending view */}
            {viewMode === 'pending' && (
                <div className="text-right mt-6">
                    <Button
                        label="Submit"
                        customBtnStyle="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold"
                        handleSubmit={handleSubmit}
                    />
                </div>
            )}
        </div>
    );
}

export default ScholarshipStaff;