import React, { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

function Staff() {

    const [staffs, setStaffs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        staffId: "",
        staffName: "",
        password: "",
    });
    const [search, setSearch] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`${apiUrl}/api/staffManage/fetchStaffs`);
            setStaffs(response.data.staffs);
        };
        fetchData();
    }, []);

    const filteredStaffs = staffs.filter((staff) => {
        const query = search.toLowerCase();
        return (
            staff.staffId.toLowerCase().includes(query) ||
            staff.staffName.toLowerCase().includes(query) ||
            staff.password.toLowerCase().includes(query)
        );
    });


    const handleEdit = (staff) => {
        setFormData({
            staffId: staff.staffId,
            staffName: staff.staffName,
            password: staff.password,
        });
        setIsModalOpen(true);
    };

    const onClose = () => {
        setIsModalOpen(false);
        setErrors({});
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {

        if (!formData.staffName || !formData.password || !formData.staffId) {
            alert("All Feild Shoud be Required")
            return;
        }
        e.preventDefault();

        try {
            await axios.put(`${apiUrl}/api/staffManage/updateStaff`, formData);
            setStaffs((prev) =>
                prev.map((x) =>
                    x.staffId === formData.staffId ? { ...x, ...formData } : x
                )
            );
            onClose();
        } catch (err) {
            console.error('Error in updating staff details : ', err);
            alert("Update failed!");
        }
    };

    return (
        <>
            {/* Header */}
            <header className="">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Staff Management
                </h1>

                <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="🔍 Search staff..."
                        className={`w-full md:w-1/2 ${formControlClass}`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <p className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        No. of Records :{" "}
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                            {staffs.length}
                        </span>
                    </p>
                </div>

                <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                    <div className="max-h-[700px] overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
                            <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
                                <tr>
                                    {["S.No", "Staff ID", "Staff Name", "Password", "Action"].map(
                                        (header) => (
                                            <th
                                                key={header}
                                                className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                            >
                                                {header}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredStaffs.length > 0 ? (
                                    filteredStaffs.map((staff, index) => (
                                        <tr
                                            key={staff.staffId}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
                                        >
                                            <td className="px-4 py-4">{index + 1}</td>
                                            <td className="px-4 py-4">{staff.staffId}</td>
                                            <td className="px-4 py-4 uppercase">{staff.staffName}</td>
                                            <td className="px-4 py-4">{staff.password}</td>

                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => handleEdit(staff)}
                                                    className="w-20 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition text-xs sm:text-sm"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base"
                                        >
                                            No records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </header>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full border border-gray-200 dark:border-gray-700 max-w-6xl hide-scrollbar overflow-y-auto max-h-[80vh]">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                ✏️ Edit Staff
                            </h1>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold transition"
                            >
                                ×
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-7">
                            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                                    🧾 Basic Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Input
                                        label="Staff ID"
                                        name="staffId"
                                        value={formData.staffId}
                                        required
                                        disabled
                                        error={errors.staffId}
                                    />

                                    <Input
                                        label="Staff Name"
                                        name="staffName"
                                        value={formData.staffName}
                                        onChange={handleChange}
                                        required
                                        error={errors.staffName}
                                    />

                                    <Input
                                        label="Password"
                                        name="password"
                                        type="text"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        error={errors.password}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2.5 rounded-lg font-semibold bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md transition"
                                >
                                    Update
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

const Input = ({
    label, name, type = "text", value, onChange, error, ...props
}) => (

    <div className="space-y-2">
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            {label} : {props.required && <span className="text-red-500">*</span>}
        </label>

        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            {...props}
            className={`w-full p-2 pr-10 border rounded-md text-gray-900 transition
                ${props.disabled || props.readOnly ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'}
                ${error
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-300'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-300'
                }
                focus:outline-none focus:ring-1`
            }
        /> 

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
)

export default Staff;