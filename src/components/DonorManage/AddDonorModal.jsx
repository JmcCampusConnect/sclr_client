import React, { useState } from "react";
import axios from "axios";
import '../../App.css';
import SearchDropdown from "../../common/SearchDropDown";

const apiUrl = import.meta.env.VITE_API_URL;

function AddDonorModal({ onClose, onAddDonor }) {

    const [formData, setFormData] = useState({
        donorId: "", donorName: "", mobileNo: "", emailId: "", academicYear: "", panOrAadhaar: "", address: "",
        district: "", state: "", pinCode: "", donorType: "", donorDate: "", generalAmt: "", generalBal: "",
        zakkathAmt: "", zakkathBal: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => {
            const updated = { ...prev };
            if (name === "generalAmt" && value) delete updated.zakkathAmt;
            if (name === "zakkathAmt" && value) delete updated.generalAmt;
            delete updated[name];
            return updated;
        });
    };


    const handleSelectChange = (name, option) => {
        setFormData((prev) => ({
            ...prev, [name]: option ? option.value : "",
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {

        const newErrors = {};

        if (!formData.donorName.trim()) {
            newErrors.donorName = "Donor Name is required.";
        }

        if (!formData.donorType) {
            newErrors.donorType = "Donor Type is required.";
        }

        const hasGeneral = !!formData.generalAmt && Number(formData.generalAmt) > 0;
        const hasZakkath = !!formData.zakkathAmt && Number(formData.zakkathAmt) > 0;

        if (!hasGeneral && !hasZakkath) {
            newErrors.generalAmt = "Either General Amount or Zakkath Amount is required.";
            newErrors.zakkathAmt = "Either Zakkath Amount or General Amount is required.";
        }

        setErrors(newErrors);
        return newErrors;
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            const firstErrorField = Object.keys(newErrors)[0];
            const el = document.querySelector(`[name="${firstErrorField}"]`);
            if (el) el.focus();
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/api/donor/addDonor`, formData);
            alert('Donor added successfully');
            onAddDonor(response.data.donor);
            onClose();
        } catch (error) {
            console.error("Error adding donor : ", error);
            if (error?.response?.status === 409) {
                alert(error.response.data.message);
            }
        }
    }

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
        { value: "Well Wishers", label: "Well Wishers" },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full border border-gray-200 dark:border-gray-700 max-w-6xl hide-scrollbar overflow-y-auto max-h-[80vh]">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        🎗️ Add Donor
                    </h1>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold transition"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="p-6 space-y-6">

                    {/* Basic Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            🧾 Basic Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input
                                label="Donor Name"
                                name="donorName"
                                value={formData.donorName}
                                required
                                error={errors.donorName}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, donorName: e.target.value.toUpperCase() }))
                                }
                            />
                            <Input label="Mobile No" name="mobileNo" value={formData.mobileNo} onChange={handleChange} />
                            <Input label="Email ID" name="emailId" type="email" value={formData.emailId} onChange={handleChange} />
                            <Input
                                label="PAN / Aadhaar No"
                                name="panNo"
                                value={formData.panNo}
                                onChange={(e) => setFormData((prev) => ({ ...prev, panNo: e.target.value.toUpperCase() }))}
                            />
                            <Input
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value.toUpperCase() }))}
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
                                error={errors.donorType}
                            />
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            💰 Payment Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="General Amount"
                                name="generalAmt"
                                type="number"
                                value={formData.generalAmt}
                                onChange={handleChange}
                                onWheel={(e) => e.target.blur()}
                                error={errors.generalAmt}
                            />
                            <Input
                                label="Zakkath Amount"
                                name="zakkathAmt"
                                type="number"
                                value={formData.zakkathAmt}
                                onChange={handleChange}
                                onWheel={(e) => e.target.blur()}
                                error={errors.zakkathAmt}
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
                            className="px-6 py-2.5 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md transition"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const Input = ({ label, name, type = "text", value, onChange, error, ...props }) => (
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
            className={`w-full p-2.5 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none transition
				${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
)

export default AddDonorModal;