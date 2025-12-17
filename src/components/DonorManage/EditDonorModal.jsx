import React, { useState } from "react";
import axios from "axios";
import "../../App.css";
import SearchDropdown from "../../common/SearchDropDown";

const apiUrl = import.meta.env.VITE_API_URL;

function EditDonorModal({ donorData, onClose, onUpdateDonor }) {

    const [formData, setFormData] = useState({ ...donorData });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, option) => {
        setFormData((prev) => ({
            ...prev,
            [name]: option ? option.value : "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${apiUrl}/api/donor/updateDonor/${formData.donorId}`, formData);
            alert(response.data.message || "Donor updated successfully!");
            onUpdateDonor(response.data.updatedDonor);
            onClose();
        } catch (error) {
            console.error("Error updating donor:", error);
        }
    };

    const districtOptions = [
        "Chennai", "Madurai", "Coimbatore", "Trichy", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi",
        "Dindigul", "Thanjavur", "Tiruppur", "Sivagangai", "Karur", "Namakkal", "Cuddalore", "Dharmapuri",
        "Krishnagiri", "Ramanathapuram", "Nagapattinam", "Pudukkottai", "Perambalur", "Ariyalur", "Theni",
        "Tenkasi", "Kanchipuram", "Tiruvannamalai", "Villupuram", "Kallakurichi", "Nilgiris", "Chengalpattu",
        "Tiruvarur", "Mayiladuthurai"
    ].map((d) => ({ value: d, label: d }));

    const stateOptions = [
        "Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Maharashtra", "Gujarat",
        "Rajasthan", "Uttar Pradesh", "Madhya Pradesh", "Bihar", "Odisha", "West Bengal", "Assam",
        "Jharkhand", "Chhattisgarh", "Goa", "Punjab", "Haryana", "Himachal Pradesh", "Uttarakhand",
        "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura", "Arunachal Pradesh",
        "Delhi", "Puducherry", "Andaman & Nicobar", "Ladakh", "Jammu & Kashmir"
    ].map((s) => ({ value: s, label: s }));

    const donorTypeOptions = [
        { value: "Alumini", label: "Alumini" },
        { value: "Well Wisher", label: "Well Wisher" },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full border border-gray-200 dark:border-gray-700 max-w-6xl hide-scrollbar overflow-y-auto max-h-[80vh]">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        ✏️ Edit Donor
                    </h1>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold transition"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Basic Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            🧾 Basic Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Donor ID" name="donorId" value={formData.donorId} readOnly />
                            <Input
                                label="Donor Name"
                                name="donorName"
                                value={formData.donorName}
                                required
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, donorName: e.target.value.toUpperCase() }))
                                }
                            />
                            <Input label="Mobile No" name="mobileNo" value={formData.mobileNo} onChange={handleChange} />
                            <Input label="Email ID" name="emailId" type="email" value={formData.emailId} onChange={handleChange} />
                            <Input
                                label="PAN / Aadhaar No"
                                name="panOrAadhaar"
                                value={formData.panOrAadhaar}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, panOrAadhaar: e.target.value.toUpperCase() }))
                                }
                            />
                            <Input
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, address: e.target.value.toUpperCase() }))
                                }
                            />
                            <SearchDropdown
                                label="District"
                                name="district"
                                value={formData.district}
                                options={districtOptions}
                                onChange={handleSelectChange}
                            />
                            <SearchDropdown
                                label="State"
                                name="state"
                                value={formData.state}
                                options={stateOptions}
                                onChange={handleSelectChange}
                            />
                            <Input label="Pincode" name="pinCode" value={formData.pinCode} maxLength={6} onChange={handleChange} />
                            <SearchDropdown
                                label="Donor Type"
                                name="donorType"
                                value={formData.donorType}
                                options={donorTypeOptions}
                                onChange={handleSelectChange}
                                required
                            />
                        </div>
                    </div>

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

const Input = ({ label, name, type = "text", value, onChange, ...props }) => (
    <div>
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            {label} : {props.required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            {...props}
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
    </div>
);

export default EditDonorModal;