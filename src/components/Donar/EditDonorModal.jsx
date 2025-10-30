import React from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

function EditDonorModal({ donorData, onClose, onUpdateDonor }) {

    const [formData, setFormData] = React.useState({ ...donorData });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${apiUrl}/api/donor/updateDonor/${formData._id}`, formData);
            onUpdateDonor(response.data.updatedDonor);
            onClose();
        } catch (error) {
            console.error("Error updating donor:", error);
        }
    };

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
                <form onSubmit={handleSubmit} className="p-6 space-y-10 font-semibold">
                    {/* Section 1: Basic Info */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            🧾 Basic Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input label="Donor ID" name="did" value={formData.did} readOnly />

                            <Select
                                label="Scholarship Type"
                                name="scholtype"
                                value={formData.scholtype}
                                onChange={handleChange}
                                required
                                options={["Alumni", "Well Wisher"]}
                            />

                            {formData.scholtype === "Alumni" && (
                                <>
                                    <Input label="Programme" name="donordept" value={formData.donordept} onChange={handleChange} />
                                    <Input label="Studied Year" name="donorbatch" value={formData.donorbatch} onChange={handleChange} />
                                </>
                            )}

                            <Input
                                label="Name"
                                name="name"
                                value={formData.name}
                                required
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, name: e.target.value.toUpperCase() }))
                                }
                            />
                            <Input label="Mobile No" name="mobileNo" value={formData.mobileNo} onChange={handleChange} />
                            <Input
                                label="PAN / Aadhar No"
                                name="pan"
                                value={formData.pan}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, pan: e.target.value.toUpperCase() }))
                                }
                            />
                            <Input label="Email ID" name="emailId" type="email" value={formData.emailId} onChange={handleChange} />
                            <Input
                                label="Permanent Address"
                                name="address"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, address: e.target.value.toUpperCase() }))
                                }
                            />
                            <Select label="State" name="state" value={formData.state} onChange={handleChange} options={[]} />
                            <Select label="District" name="district" value={formData.district} onChange={handleChange} options={[]} />
                            <Input label="Pincode" name="pin" value={formData.pin} maxLength={6} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Section 2: Payment Details */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            💰 Payment Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Date of Payment"
                                name="scholdate"
                                type="date"
                                value={formData.scholdate}
                                onChange={handleChange}
                            />

                            <div>
                                <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                                    Scholarship Type:
                                </label>
                                <div className="flex gap-6 mt-2 items-center">
                                    <Radio
                                        label="Zakkath"
                                        name="zakkath"
                                        checked={formData.zakkath === true}
                                        onChange={() => setFormData((prev) => ({ ...prev, zakkath: true }))}
                                    />
                                    <Radio
                                        label="General"
                                        name="zakkath"
                                        checked={formData.zakkath === false}
                                        onChange={() => setFormData((prev) => ({ ...prev, zakkath: false }))}
                                    />
                                </div>
                            </div>

                            <Input label="Cheque / Receipt No" name="receipt" value={formData.receipt} onChange={handleChange} />

                            <Input
                                label="Amount"
                                name={formData.zakkath ? "zakkathamt" : "amount"}
                                required
                                value={formData.zakkath ? formData.zakkathamt : formData.amount}
                                onChange={(e) =>
                                    formData.zakkath
                                        ? setFormData((prev) => ({ ...prev, zakkathamt: e.target.value }))
                                        : setFormData((prev) => ({ ...prev, amount: e.target.value }))
                                }
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
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

// Reusable form components (same as Add modal)
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

const Select = ({ label, name, value, onChange, options, required }) => (
    <div>
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            {label} : {required && <span className="text-red-500">*</span>}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
        >
            <option value="">Select</option>
            {options?.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    </div>
);

const Radio = ({ label, name, checked, onChange }) => (
    <label className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
        <div className='flex flex-col justify-center'>
            <div className="flex gap-4 items-center mt-2">
                <label className="flex items-center gap-2 text-md">
                    <input type="radio" name={name} checked={checked} onChange={onChange} className="w-4 h-4 accent-blue-600" />
                    {label}
                </label>
            </div>
        </div>
    </label>
)

export default EditDonorModal;