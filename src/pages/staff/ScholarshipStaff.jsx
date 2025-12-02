import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderTag from "../../common/HeaderTag";
import axios from "axios";
import Button from "../../common/Button";
import Loading from "../../assets/svg/Pulse.svg";

function ScholarshipStaff() {

    const { userId } = useParams();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pending, setPending] = useState(0);
    const [complete, setComplete] = useState(0);
    const [formData, setFormData] = useState({});
    const [initialFormData, setInitialFormData] = useState({});

    useEffect(() => {
        const fetchStudents = async () => {

            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${apiUrl}/api/staff/sclr/students?staffId=${userId}`);
                const fetchedStudents = response.data.data || [];
                setStudents(fetchedStudents);
                setPending(response.data.pending || 0);
                setComplete(response.data.complete || 0);
                const initial = {};
                fetchedStudents.forEach(stu => { initial[stu._id] = stu.governmentScholarship || "" });
                setFormData(initial);
                setInitialFormData(initial);
            } catch (err) {
                setError("Failed to fetch student data : ", err)
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <img src={Loading} className="w-24 h-24 animate-spin" />
                <p className="text-gray-600 text-lg">Loading students...</p>
            </div>
        );
    }

    if (error) return <p className="text-red-600">{error}</p>;

    const headers = [
        { key: "sno", label: "S.No" },
        { key: "registerNo", label: "Reg No" },
        { key: "name", label: "Name" },
        { key: "category", label: "Category" },
        { key: "department", label: "Department" },
        { key: "applied", label: `${userId === "JMCTPS" ? "Applied for TPS" : "Applied for PPS"}` },
    ];

    return (
        <div>
            <HeaderTag label={userId === "JMCTPS" ? "Tamil Puthalvan Scheme" : "Pudhumai Penn Scheme"} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-lg font-semibold">
                <div className="bg-white border-l-4 border-blue-600 p-4 rounded shadow-md">
                    Total Applicants : <span className="float-right">{complete + pending}</span>
                </div>
                <div className="bg-white border-l-4 border-green-600 p-4 rounded shadow-md">
                    Completed : <span className="float-right">{complete}</span>
                </div>
                <div className="bg-white border-l-4 border-red-600 p-4 rounded shadow-md">
                    Pending : <span className="float-right">{pending}</span>
                </div>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                <div className="max-h-[700px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
                        <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
                            <tr>
                                {headers.map((header) => (
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
                            {students.length > 0 ? (
                                students.map((student, index) => (
                                    <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200">
                                        <td className="px-4 py-4">{index + 1}</td>
                                        <td className="px-4 py-4 uppercase">{student.registerNo}</td>
                                        <td className="px-4 py-4">{student.name}</td>
                                        <td className="px-4 py-4 uppercase">{student.category}</td>
                                        <td className="px-4 py-4">{student.department}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`applied-${student._id}`}
                                                        checked={formData[student._id] === "yes"}
                                                        onChange={() => handleSelection(student._id, "yes")}
                                                    />
                                                    YES
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`applied-${student._id}`}
                                                        checked={formData[student._id] === "no"}
                                                        onChange={() => handleSelection(student._id, "no")}
                                                    />
                                                    NO
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={headers.length} className="p-4 text-center text-gray-500 dark:text-gray-400">
                                        No students found for this page.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="text-right mt-6">
                <Button
                    label="Submit"
                    customBtnStyle="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold"
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}

export default ScholarshipStaff;

