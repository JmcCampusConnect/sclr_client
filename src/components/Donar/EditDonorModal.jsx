import React, { useState, useEffect } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

function EditDonorModal({ donor, onClose, onEditDonor }) {

    const [formData, setFormData] = useState({ ...donor });

    useEffect(() => {
        setFormData({ ...donor });
    }, [donor]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${apiUrl}/api/donor/updateDonor/${formData.did}`, formData);
            onEditDonor(response.data.donor);
            onClose();
        } catch (error) {
            console.error("Error updating donor:", error);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-6xl overflow-y-auto max-h-[90vh]">
                <h1 className="text-xl mb-6 font-semibold bg-gray-600 p-3 rounded text-white">
                    Edit Donor
                </h1>

                <form className="space-y-8 font-semibold" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border border-black p-6 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div>
                            <label className="block mb-2 font-semibold text-slate-700 dark:text-gray-200">Donor ID:</label>
                            <input type="text" name="did" value={formData.did} readOnly className="w-full p-2 border border-black rounded-md bg-gray-100" />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-slate-700 dark:text-gray-200">Scholarship Type: <span className="text-red-500">*</span></label>
                            <select name="scholtype" value={formData.scholtype} onChange={handleChange} className="w-full p-2 border border-black rounded-md" required>
                                <option value="">Select</option>
                                <option value="Alumni">Alumni</option>
                                <option value="Well Wisher">Well Wisher</option>
                            </select>
                        </div>

                        {formData.scholtype === "Alumni" && (
                            <>
                                <div>
                                    <label className="block mb-2 font-semibold text-slate-700 dark:text-gray-200">Programme:</label>
                                    <input type="text" name="donordept" value={formData.donordept} onChange={handleChange} className="w-full p-2 border border-black rounded-md" />
                                </div>
                                <div>
                                    <label className="block mb-2 font-semibold text-slate-700 dark:text-gray-200">Studied Year:</label>
                                    <input type="text" name="donorbatch" value={formData.donorbatch} onChange={handleChange} className="w-full p-2 border border-black rounded-md" />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block mb-2 font-semibold text-slate-700 dark:text-gray-200">Name: <span className="text-red-500">*</span></label>
                            <input type="text" name="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))} className="w-full p-2 border border-black rounded-md" required />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-slate-700 dark:text-gray-200">Mobile No:</label>
                            <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} className="w-full p-2 border border-black rounded-md" />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-slate-700 dark:text-gray-200">PAN / Aadhar No:</label>
                            <input type="text" name="pan" value={formData.pan} onChange={(e) => setFormData(prev => ({ ...prev, pan: e.target.value.toUpperCase() }))} className="w-full p-2 border border-black rounded-md" />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-slate-700 dark:text-gray-200">Email ID:</label>
                            <input type="email" name="emailId" value={formData.emailId} onChange={handleChange} className="w-full p-2 border border-black rounded-md" />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-slate-700 dark:text-gray-200">Permanent Address:</label>
                            <input type="text" name="address" value={formData.address} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value.toUpperCase() }))} className="w-full p-2 border border-black rounded-md" />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-slate-700 dark:text-gray-200">State:</label>
                            <select name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border border-black rounded-md">
                                <option value="">Select State</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-slate-700 dark:text-gray-200">District:</label>
                            <select name="district" value={formData.district} onChange={handleChange} className="w-full p-2 border border-black rounded-md">
                                <option value="">Select District</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-slate-700 dark:text-gray-200">Pincode:</label>
                            <input type="text" name="pin" value={formData.pin} onChange={handleChange} maxLength={6} className="w-full p-2 border border-black rounded-md" />
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-black p-6 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div>
                            <label className="block mb-2 font-semibold text-slate-700 dark:text-gray-200">Date of Payment:</label>
                            <input type="date" name="scholdate" value={formData.scholdate} onChange={handleChange} className="w-full p-2 border border-black rounded-md" />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-slate-700 dark:text-gray-200">Scholarship Type:</label>
                            <div className="flex gap-4 mt-2 items-center">
                                <label className="flex items-center gap-2 text-md">
                                    <input type="radio" name="zakkath" className="scale-125" checked={formData.zakkath === true} onChange={() => setFormData(prev => ({ ...prev, zakkath: true }))} /> Zakkath
                                </label>
                                <label className="flex items-center gap-2 text-md">
                                    <input type="radio" name="zakkath" className="scale-125" checked={formData.zakkath === false} onChange={() => setFormData(prev => ({ ...prev, zakkath: false }))} /> General
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-slate-700 dark:text-gray-200">Cheque / Receipt No:</label>
                            <input type="text" name="receipt" value={formData.receipt} onChange={handleChange} className="w-full p-2 border border-black rounded-md" />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-slate-700 dark:text-gray-200">Amount: <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name={formData.zakkath ? "zakkathamt" : "amount"}
                                value={formData.zakkath ? formData.zakkathamt : formData.amount}
                                onChange={(e) => formData.zakkath ? setFormData(prev => ({ ...prev, zakkathamt: e.target.value })) : setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                className="w-full p-2 border border-black rounded-md"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold">Update</button>
                        <button type="button" className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-semibold" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditDonorModal;