import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loading from "../../assets/svg/Pulse.svg";
import HeaderTag from '../../common/HeaderTag';
import StaffStatus from '../../components/Others/StaffStatus';

function TutorVerify() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { userId: staffId } = useParams();

    const [studentData, setStudentData] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [counts, setCounts] = useState({
        totalApplications: 0,
        completed: 0,
        pending: 0
    });
    const [viewMode, setViewMode] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');

    const [verificationData, setVerificationData] = useState({
        orphanOrSingleParent: null,
        hazrathOrMuaddin: null,
        eligibleForZakkath: null,
        needyButNotZakkath: null,
        remarks: "",
    });

    const [verifyModal, setVerifyModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const openModal = (student) => {
        setSelectedStudent(student);
        setVerificationData({
            orphanOrSingleParent: null,
            hazrathOrMuaddin: null,
            eligibleForZakkath: null,
            needyButNotZakkath: null,
            remarks: "",
        });
        setFormErrors({});
        setVerifyModal(true);
    };

    const closeModal = () => {
        setVerifyModal(false);
        setSelectedStudent(null);
        setVerificationData({
            orphanOrSingleParent: null,
            hazrathOrMuaddin: null,
            eligibleForZakkath: null,
            needyButNotZakkath: null,
            remarks: "",
        });
        setFormErrors({});
    };

    const handleVerificationChange = (key, value) => {
        setVerificationData(prev => ({
            ...prev,
            [key]: value,
        }));
        setFormErrors(prev => ({
            ...prev,
            [key]: undefined,
        }));
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${apiUrl}/api/staff/tutorStudents`, {
                params: { userId: staffId }
            });
            if (response.status === 200) {
                const students = response.data || [];
                setAllStudents(students);
                setStudentData(students);

                // Calculate counts
                const total = students.length;
                const completed = students.filter(s => s.tutorVerification === 1).length;
                const pending = students.filter(s => s.tutorVerification === 0).length;

                setCounts({
                    totalApplications: total,
                    completed: completed,
                    pending: pending
                });
            }
        } catch (error) {
            setError("Failed to load student data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitVerification = async () => {

        if (!selectedStudent) return;

        const newErrors = {};

        if (verificationData.orphanOrSingleParent == null)
            newErrors.orphanOrSingleParent = "This field is required";

        if (verificationData.hazrathOrMuaddin == null)
            newErrors.hazrathOrMuaddin = "This field is required";

        if (verificationData.eligibleForZakkath == null)
            newErrors.eligibleForZakkath = "This field is required";

        if (verificationData.needyButNotZakkath == null)
            newErrors.needyButNotZakkath = "This field is required";


        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        const tutorVerificationDetails = {
            ...verificationData,
            verifiedBy: staffId,
            verifiedAt: new Date().toISOString(),
        };

        try {
            await axios.put(
                `${apiUrl}/api/staff/verifyStudent/${selectedStudent._id}`,
                {
                    tutorVerificationDetails,
                    tutorVerification: 1
                }
            );
            alert(`Verification successful for ${selectedStudent.name}`);
            closeModal();
            fetchStudents();
        } catch (err) {
            alert("Verification failed!\nPlease try again.");
            console.error('Error in verifying student : ', err);
        } finally { setIsSubmitting(false) }
    }

    // Filter data based on view mode and search
    const getFilteredData = () => {
        let filtered = allStudents;

        // Filter by view mode
        if (viewMode === 'pending') {
            filtered = allStudents.filter(stu =>
                stu.tutorVerification === 0
            );
        } else if (viewMode === 'completed') {
            filtered = allStudents.filter(stu =>
                stu.tutorVerification === 1
            );
        }

        // Filter by search term
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(st =>
                st.registerNo?.toLowerCase().includes(search) ||
                st.name?.toLowerCase().includes(search) ||
                st.department?.toLowerCase().includes(search) ||
                st.semester?.toLowerCase().includes(search)
            );
        }

        return filtered;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
                <p className="text-gray-600 font-medium text-lg">Loading student details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-height-screen">
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
        );
    }

    const filteredData = getFilteredData();

    const isFormValid =
        verificationData.orphanOrSingleParent != null &&
        verificationData.hazrathOrMuaddin != null &&
        verificationData.eligibleForZakkath != null &&
        verificationData.needyButNotZakkath != null;

    return (
        <div>
            <HeaderTag label={`Tutor Verification`} />

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
                                {viewMode === 'pending' ? (
                                    // Pending view headers
                                    ["S.No", "Register No", "Name", "Department", "Semester", "Action"].map(header => (
                                        <th
                                            key={header}
                                            className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                        >
                                            {header}
                                        </th>
                                    ))
                                ) : (
                                    // Completed view headers
                                    ["S.No", "Register No", "Name", "Department", "Semester", "Status"].map(header => (
                                        <th
                                            key={header}
                                            className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                        >
                                            {header}
                                        </th>
                                    ))
                                )}
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
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                    {student.registerNo || "—"}
                                                </td>
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                    {student.name}
                                                </td>
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                    {student.department || "—"}
                                                </td>
                                                <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                    {student.semester || "—"}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg text-sm font-semibold text-green-700 dark:text-green-300 inline-block min-w-[80px]">
                                                        Verified
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    // PENDING VIEW - With Verify button
                                    return (
                                        <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200">
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                {student.registerNo || "—"}
                                            </td>
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                {student.name}
                                            </td>
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                {student.department || "—"}
                                            </td>
                                            <td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
                                                {student.semester || "—"}
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => openModal(student)}
                                                    className="w-20 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition text-xs sm:text-sm"
                                                >
                                                    Verify
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={viewMode === 'pending' ? 6 : 6}
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

            {verifyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full border border-gray-200 dark:border-gray-700 max-w-6xl hide-scrollbar overflow-y-auto max-h-[80vh]">

                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                🧾 Tutor Verification
                            </h1>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6 space-y-1">
                            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6 bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                                    Student Basic Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Info label="Name" value={selectedStudent?.name} />
                                    <Info label="Register No" value={selectedStudent?.registerNo} />
                                    <Info label="Department" value={selectedStudent?.department} />
                                    <Info label="Semester" value={selectedStudent?.semester} />
                                </div>
                            </div>

                            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                                <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pb-2">
                                    Verification Checklist
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <RadioGroup
                                        label="Orphan or Single Parent"
                                        name="orphanOrSingleParent"
                                        checkedValue={verificationData.orphanOrSingleParent}
                                        onChange={handleVerificationChange}
                                        dataKey="orphanOrSingleParent"
                                        error={formErrors.orphanOrSingleParent}
                                    />

                                    <RadioGroup
                                        label="Hazrath / Muaddin Family"
                                        name="hazrathOrMuaddin"
                                        checkedValue={verificationData.hazrathOrMuaddin}
                                        onChange={handleVerificationChange}
                                        dataKey="hazrathOrMuaddin"
                                        error={formErrors.hazrathOrMuaddin}
                                    />

                                    <RadioGroup
                                        label="Eligible for Zakkath"
                                        name="eligibleForZakkath"
                                        checkedValue={verificationData.eligibleForZakkath}
                                        onChange={handleVerificationChange}
                                        dataKey="eligibleForZakkath"
                                        error={formErrors.eligibleForZakkath}

                                    />

                                    <RadioGroup
                                        label="Needy but Not Eligible for Zakkath"
                                        name="needyButNotZakkath"
                                        checkedValue={verificationData.needyButNotZakkath}
                                        onChange={handleVerificationChange}
                                        dataKey="needyButNotZakkath"
                                        error={formErrors.needyButNotZakkath}
                                    />
                                </div>

                                <div className="mt-6">
                                    <label className="font-semibold text-gray-800 dark:text-gray-200">Remarks :</label>
                                    <textarea
                                        rows="3"
                                        value={verificationData.remarks}
                                        onChange={(e) =>
                                            setVerificationData(prev => ({ ...prev, remarks: e.target.value }))
                                        }
                                        className="w-full mt-2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="hidden">
                                <p>Verified By: {staffId}</p>
                                <p>Verified At: {new Date().toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 px-6 py-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={closeModal}
                                className="px-6 py-2.5 rounded-lg font-semibold bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitVerification}
                                disabled={isSubmitting || !isFormValid}
                                className={`px-6 py-2.5 rounded-lg font-semibold text-white shadow-md transition ${isSubmitting || !isFormValid
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"}`}
                            >
                                {isSubmitting ? "Verifying..." : "Verify"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const Info = ({ label, value }) => (
    <div>
        <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{label} :</p>
        <p
            className=
            {`
                w-full p-2 border border-gray-300 rounded-lg text-gray-900
                bg-gray-100 cursor-not-allowed
                dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600
            `}
        >
            {value || "—"}
        </p>
    </div>
);

const RadioGroup = ({ label, name, checkedValue, onChange, dataKey, error }) => (

    <div className="flex flex-col">
        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">
            {label} :
        </p>

        <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="radio"
                    name={name}
                    checked={checkedValue === true}
                    onChange={() => onChange(dataKey, true)}
                    className="w-4 h-4 accent-green-600"
                />
                <span className="text-gray-700 dark:text-gray-300">Yes</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="radio"
                    name={name}
                    checked={checkedValue === false}
                    onChange={() => onChange(dataKey, false)}
                    className="w-4 h-4 accent-red-600"
                />
                <span className="text-gray-700 dark:text-gray-300">No</span>
            </label>
        </div>

        {error && (
            <p className="text-red-500 text-sm mt-2">
                {error}
            </p>
        )}
    </div>
)

export default TutorVerify;