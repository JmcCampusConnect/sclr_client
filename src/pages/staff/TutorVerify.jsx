import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loading from "../../assets/svg/Pulse.svg";
import HeaderTag from '../../common/HeaderTag';

function TutorVerify() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { userId: staffId } = useParams();

    const [studentData, setStudentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [verificationData, setVerificationData] = useState({
        orphanOrSingleParent: false,
        hazrathOrMuaddin: false,
        eligibleForZakkath: false,
        needyButNotZakkath: false,
        remarks: "",
    });

    const [verifyModal, setVerifyModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const openModal = (student) => {
        setSelectedStudent(student);
        const details = student.tutorVerificationDetails;
        setVerificationData({
            orphanOrSingleParent: details?.orphanOrSingleParent || false,
            hazrathOrMuaddin: details?.hazrathOrMuaddin || false,
            eligibleForZakkath: details?.eligibleForZakkath || false,
            needyButNotZakkath: details?.needyButNotZakkath || false,
            remarks: details?.remarks || "",
        });

        setVerifyModal(true);
    };

    const closeModal = () => {
        setVerifyModal(false);
        setSelectedStudent(null);
        setVerificationData({
            orphanOrSingleParent: false,
            hazrathOrMuaddin: false,
            eligibleForZakkath: false,
            needyButNotZakkath: false,
            remarks: "",
        });
    };

    const handleVerificationChange = (key, value) => {
        setVerificationData(prev => ({
            ...prev,
            [key]: value,
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
                setStudentData(response.data);
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

        setIsSubmitting(true);

        const tutorVerificationDetails = {
            orphanOrSingleParent: verificationData.orphanOrSingleParent,
            hazrathOrMuaddin: verificationData.hazrathOrMuaddin,
            eligibleForZakkath: verificationData.eligibleForZakkath,
            needyButNotZakkath: verificationData.needyButNotZakkath,
            remarks: verificationData.remarks,
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
            console.error('Error in verfiying student : ', err);
        } finally { setIsSubmitting(false) }
    }

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

    return (
        <div>
            <HeaderTag label={`Tutor Verification`} />

            <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                <div className="max-h-[700px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
                        <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
                            <tr>
                                {["S.No", "Register No", "Name", "Department", "Semester", "Action"].map(header => (
                                    <th
                                        key={header}
                                        className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {studentData.length > 0 ? (
                                studentData.map((student, index) => (
                                    <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200">
                                        <td className="px-4 py-4">{index + 1}</td>
                                        <td className="px-4 py-4">{student.registerNo || "—"}</td>
                                        <td className="px-4 py-4">{student.name}</td>
                                        <td className="px-4 py-4">{student.department || "—"}</td>
                                        <td className="px-4 py-4">{student.semester || "—"}</td>

                                        <td className="px-4 py-4">
                                            <button
                                                onClick={() => openModal(student)}
                                                className="w-20 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition text-xs sm:text-sm"
                                            >
                                                Verify
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-4 text-center text-gray-500">
                                        No students found.
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
                                    />

                                    <RadioGroup
                                        label="Hazrath / Muaddin Family"
                                        name="hazrathOrMuaddin"
                                        checkedValue={verificationData.hazrathOrMuaddin}
                                        onChange={handleVerificationChange}
                                        dataKey="hazrathOrMuaddin"
                                    />

                                    <RadioGroup
                                        label="Eligible for Zakkath"
                                        name="eligibleForZakkath"
                                        checkedValue={verificationData.eligibleForZakkath}
                                        onChange={handleVerificationChange}
                                        dataKey="eligibleForZakkath"
                                    />

                                    <RadioGroup
                                        label="Needy but Not Eligible for Zakkath"
                                        name="needyButNotZakkath"
                                        checkedValue={verificationData.needyButNotZakkath}
                                        onChange={handleVerificationChange}
                                        dataKey="needyButNotZakkath"
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
                                disabled={isSubmitting}
                                className={`px-6 py-2.5 rounded-lg font-semibold text-white shadow-md transition 
                                ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
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


const RadioGroup = ({ label, name, checkedValue, onChange, dataKey }) => (
    <div className="flex flex-col">
        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">{label} :</p>
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
    </div>
)

export default TutorVerify;