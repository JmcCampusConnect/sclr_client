import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchDropdown from "../../common/SearchDropDown";

const apiUrl = import.meta.env.VITE_API_URL;

function EditDistributionModal({ distributionData, onClose, onUpdate }) {

    const [formData, setFormData] = useState({ ...distributionData });
    const [donors, setDonors] = useState([]);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/common/fetchDropdownData`);
                const donorList = res.data.donors || [];
                setDonors(donorList);
            } catch (err) {
                console.error("Dropdown fetch error:", err);
            }
        };
        fetchDropdownData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDonorChange = (name, option) => {
        if (!option) return;
        const selectedDonor = donors.find(d => d.donorId === option.value);
        setFormData(prev => ({
            ...prev,
            donorId: option.value,
            donorName: selectedDonor?.donorName || ""
        }));
    };

    const handleSelectChange = (name, option) => {
        setFormData(prev => ({ ...prev, [name]: option?.value || "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `${apiUrl}/api/distribution/update/${formData._id}`,
                formData
            );
            alert(res.data.message || "Distribution updated successfully");
            onUpdate(res.data.updatedDistribution);
            onClose();
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const donorOptions = donors.map(d => ({
        value: d.donorId,
        label: `${d.donorId} - ${d.donorName}`
    }));

    const amtTypeOptions = [
        { value: "generalBal", label: "General" },
        { value: "zakkathBal", label: "Zakkath" }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-gray-700 hide-scrollbar">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        ✏️ Edit Distribution
                    </h1>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold transition"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Academic / Donor Info */}
                    <Section title="📘 Donor Info">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SearchDropdown
                                label="Donor ID"
                                name="donorId"
                                value={formData.donorId}
                                options={donorOptions}
                                onChange={handleDonorChange}
                            />
                            <Input
                                label="Donor Name"
                                name="donorName"
                                value={formData.donorName}
                                readOnly
                            />
                        </div>
                    </Section>

                    {/* Student Info */}
                    <Section title="🎓 Student Details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Register No" value={formData.registerNo} readOnly />
                            <Input label="Student Name" value={formData.name} readOnly />
                        </div>
                    </Section>

                    {/* Scholarship Info */}
                    <Section title="💰 Scholarship Details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SearchDropdown
                                label="Amount Type"
                                name="amtType"
                                value={formData.amtType}
                                options={amtTypeOptions}
                                onChange={handleSelectChange}
                            />
                            <Input
                                label="Given Amount"
                                name="givenAmt"
                                type="number"
                                value={formData.givenAmt}
                                onChange={handleChange}
                            />
                        </div>
                    </Section>

                    {/* Footer */}
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
                            className="px-6 py-2.5 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const Section = ({ title, children }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
            {title}
        </h2>
        {children}
    </div>
);

const Input = ({ label, value, onChange, type = "text", readOnly, name }) => (
    <div>
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            {label} :
        </label>
        <input
            type={type} name={name}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            onWheel={type === "number" ? (e) => e.target.blur() : undefined}
            className={`w-full p-2.5 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 
                ${readOnly
                    ? "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 cursor-not-allowed"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                }`}
        />
    </div>
)

export default EditDistributionModal;