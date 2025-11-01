import React from 'react';
import {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import {useFetch} from '../../hook/useFetch';
import {useAdd} from '../../hook/useAdd';
import StaffStatus from '../../components/Others/StaffStatus';

function DmAttendance() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const {userId} = useParams();
    const {fetchData} = useFetch();
    const {addError, addData} = useAdd();
    const [students, setStudents] = useState([]);

    const [prevYearWorkingDays, setPrevYearWorkingDays] = useState("");
    const [currYearWorkingDays, setCurrYearWorkingDays] = useState("");
    const [editedStudents, setEditedStudents] = useState({});
    const [count, setCount] = useState();
    const [staffData, setStaffData] = useState({});

    useEffect(() => {
        const getStudents = async () => {
            try {
                const response = await fetchData(`${apiUrl}/api/staff/dm/studentsDM`, {userId});
                setStudents(response.data.students || []);
                setCount(response.data.counts);
                setStaffData(response.data.StaffData[0])
            } catch (e) {
                console.log("Error while fetching Students");
            }
        };
        getStudents();
    }, []);

    const handleDayInput = (value, max) => {
        if (value === "") return true;
        if (/^\d+$/.test(value)) {
            if (parseInt(value) <= max) return true;
        }
        return false;
    };

    const onPrevYearWorkingDaysChange = (e) => {
        const val = e.target.value;
        if (val === "" || /^\d+$/.test(val)) {
            setPrevYearWorkingDays(val);
        }
    };

    const onCurrYearWorkingDaysChange = (e) => {
        const val = e.target.value;
        if (val === "" || /^\d+$/.test(val)) {
            setCurrYearWorkingDays(val);
        }
    };

    const validateGlobalWorkingDaysBeforeStudentInput = (type) => {
        if (type === "prev" && prevYearWorkingDays === "") {
            alert("Please enter Previous Year Working Days first.");
            return false;
        }
        if (type === "curr" && currYearWorkingDays === "") {
            alert("Please enter Current Year Working Days first.");
            return false;
        }
        return true;
    };

    const onStudentDaysChange = (registerNo, type, val, semester) => {
        if (!validateGlobalWorkingDaysBeforeStudentInput(type)) return;

        const maxPrev = parseInt(prevYearWorkingDays) || Number.MAX_SAFE_INTEGER;
        const maxCurr = parseInt(currYearWorkingDays) || Number.MAX_SAFE_INTEGER;

        if (!/^\d*$/.test(val)) return;
        if (type === "prev" && val !== "" && parseInt(val) > maxPrev) return;
        if (type === "curr" && val !== "" && parseInt(val) > maxCurr) return;

        let record = editedStudents[registerNo] || {prev: "", curr: "", percentage: "0.00", remark: "Good"};

        record = {
            ...record,
            [type]: val
        };

        const prevVal = record.prev === "" ? 0 : parseInt(record.prev);
        const currVal = record.curr === "" ? 0 : parseInt(record.curr);

        let totalAllowed;
        let percentage = "0.00";

        if (semester === "I") {
            totalAllowed = parseInt(currYearWorkingDays) || 0;
            if (totalAllowed > 0 && currVal <= totalAllowed) {
                percentage = ((currVal / totalAllowed) * 100).toFixed(2);
            }
        } else {
            totalAllowed = (parseInt(prevYearWorkingDays) || 0) + (parseInt(currYearWorkingDays) || 0);
            if (totalAllowed > 0 && (prevVal + currVal) <= totalAllowed) {
                percentage = (((prevVal + currVal) / totalAllowed) * 100).toFixed(2);
            }
        }

        record.percentage = percentage;

        if (!(registerNo in editedStudents) || !editedStudents[registerNo].hasOwnProperty('remark')) {
            record.remark = "Good";
        }

        setEditedStudents(prev => ({
            ...prev,
            [registerNo]: record
        }));
    };

    const onStudentRemarkChange = (registerNo, val) => {
        let record = editedStudents[registerNo] || {prev: "", curr: "", percentage: "0.00", remark: ""};
        record = {
            ...record,
            remark: val
        };
        setEditedStudents(prev => ({
            ...prev,
            [registerNo]: record
        }));
    };

    const onSubmit = async () => {
        const submissionArray = Object.entries(editedStudents).map(([registerNo, data]) => ({
            registerNo,
            previousYearDays: data.prev,
            currentYearDays: data.curr,
            percentage: data.percentage,
            remark: data.remark.trim() === "" ? "Good" : data.remark
        }));

        console.log("Submitting student attendance data: ", submissionArray);

        try {
            const saveStudents = await addData(`${apiUrl}/api/staff/dm/saveStdutntDM`, submissionArray);
            console.log(saveStudents);
            alert("Attendance saved");
            window.location.reload();
        } catch (e) {
            console.log("Something went wrong while saving attendance DM");
            addError && addError(e);
        }
    };

    // console.log(staffData)
    return (
        <div className="p-6">
            <h1 className="text-xl mb-6 font-semibold bg-gray-600 p-3 rounded text-white">
                {staffData?.staffName}
            </h1>

         
            <StaffStatus counts={count} />

            <div className="flex flex-wrap justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <label className="font-semibold text-lg">Previous Year Working Days :</label>
                    <input
                        type="text"
                        className="w-20 border border-black px-2 py-1.5 rounded text-right"
                        value={prevYearWorkingDays}
                        onChange={onPrevYearWorkingDaysChange}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <label className="font-semibold text-lg">Current Year Working Days :</label>
                    <input
                        type="text"
                        className="w-20 border border-black px-2 py-1.5 rounded text-right"
                        value={currYearWorkingDays}
                        onChange={onCurrYearWorkingDaysChange}
                    />
                </div>
                <div className="font-semibold text-lg">
                    No of Students : {students.length}
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-emerald-700 sticky top-0 z-10">
                        <tr className="h-[70px]">
                            <th className="px-4 py-3 text-center text-md font-semibold text-white border-r border-gray-300 w-[6%]">S.No</th>
                            {['Reg No', 'Name', 'Department', 'Prev Year', 'Curr Year', 'Percentage', 'Remarks'].map((heading, i) => (
                                <th key={i} style={{width: i < 3 ? '12%' : i === 6 ? '20%' : '10%'}} className="px-4 py-3 text-center text-md font-semibold text-white border-r border-gray-300">
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="bg-white">
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-6 text-gray-500 font-semibold">No data found.</td>
                            </tr>
                        ) : (
                            students.map((student, index) => {
                                const defaultRemark = student.deeniyathMoralRemark || "Good";
                                const edited = editedStudents[student.registerNo] || {
                                    prev: "",
                                    curr: "",
                                    percentage: "0.00",
                                    remark: defaultRemark
                                };

                                const maxPrev = parseInt(prevYearWorkingDays) || Number.MAX_SAFE_INTEGER;
                                const maxCurr = parseInt(currYearWorkingDays) || Number.MAX_SAFE_INTEGER;

                                return (
                                    <tr key={student._id} className="hover:bg-gray-50 transition-colors h-[80px] border-t border-gray-300">
                                        <td className="px-4 py-3 text-center font-semibold border-r">{index + 1}</td>
                                        <td className="px-4 py-3 text-center font-semibold text-gray-700 uppercase border-r">{student.registerNo}</td>
                                        <td className="px-4 py-3 text-center font-semibold text-gray-700 uppercase border-r">{student.name}</td>
                                        <td className="px-4 py-3 text-center font-semibold text-gray-700 uppercase border-r">{student.department || student.dept}</td>

                                        <td className="p-3 text-center border-r">
                                            {student.semester === "I" ? (
                                                <span className="text-gray-500">NA</span>
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-300 p-3 rounded text-center"
                                                    value={edited.prev}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val === "" || handleDayInput(val, maxPrev)) {
                                                            onStudentDaysChange(student.registerNo, "prev", val, student.semester);
                                                        }
                                                    }}
                                                />
                                            )}
                                        </td>


                                        <td className="p-3 text-center border-r">
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 p-3 rounded text-center"
                                                value={edited.curr}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === "" || handleDayInput(val, maxCurr)) {
                                                        onStudentDaysChange(student.registerNo, "curr", val, student.semester);
                                                    }
                                                }}
                                            />
                                        </td>

                                        <td className="p-3 text-center border-r">
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 p-3 rounded text-center bg-gray-100 cursor-not-allowed"
                                                value={edited.percentage}
                                                disabled
                                            />
                                        </td>

                                        <td className="p-3 text-center border-r">
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 p-3 rounded"
                                                value={edited.remark}
                                                onChange={(e) => onStudentRemarkChange(student.registerNo, e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="text-right mt-6">
                <button
                    onClick={onSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

export default DmAttendance;
