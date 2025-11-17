import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import HeaderTag from "../../common/HeaderTag";

const apiUrl = import.meta.env.VITE_API_URL;

function ChangePassword() {

    const { userId } = useParams();

    const [formData, setFormData] = useState({ pass: "", conpass: "" });
    const [formErrors, setFormErrors] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const validateForm = () => {

        const errors = {};

        if (!formData.pass.trim()) { errors.pass = "This field is required" }

        if (!formData.conpass.trim()) {
            errors.conpass = "This field is required";
        } else if (formData.conpass !== formData.pass) {
            errors.conpass = "Passwords do not match";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: "" }));
        setSuccessMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");

        if (!validateForm()) return;

        setIsUpdating(true);

        try {
            const res = await axios.put(`${apiUrl}/api/staff/passwordChange`, {
                staffId: userId,
                password: formData.pass
            });

            if (res.status === 200) {
                setSuccessMessage("Password updated successfully!");
                setFormData({ pass: "", conpass: "" });
            }
        } catch (error) {
            console.error("Error updating staff password:", error);
            setFormErrors(prev => ({
                ...prev,
                conpass: "Failed to update password. Please try again."
            }));
        } finally { setIsUpdating(false) }
    }

    return (
        <div>
            <HeaderTag label="Change Password" />
            <form
                onSubmit={handleSubmit}
                className="bg-white border border-gray-300 rounded-lg shadow p-6 w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"
            >
                {/* Password */}
                <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                        Password : <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        name="pass"
                        value={formData.pass}
                        onChange={handleInputChange}
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 transition 
                            ${formErrors.pass
                                ? "border-red-500 focus:ring-red-300"
                                : "border-gray-300"
                            }`}
                    />
                    {formErrors.pass && (
                        <p className="text-red-600 text-sm mt-2">{formErrors.pass}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                        Confirm Password : <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        name="conpass"
                        value={formData.conpass}
                        onChange={handleInputChange}
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 transition 
                            ${formErrors.conpass
                                ? "border-red-500 focus:ring-red-300"
                                : "border-gray-300"
                            }`}
                    />
                    {formErrors.conpass && (
                        <p className="text-red-600 text-sm mt-2">
                            {formErrors.conpass}
                        </p>
                    )}
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="col-span-2">
                        <p className="text-green-600 font-semibold text-sm">
                            {successMessage}
                        </p>
                    </div>
                )}

                {/* Submit Button */}
                <div className="col-span-2 flex justify-end mt-2">
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className={`${isUpdating ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
                            } text-white font-semibold px-6 py-2 rounded-md transition`}
                    >
                        {isUpdating ? "Updating..." : "Update"}
                    </button>
                </div>

            </form>
        </div>
    )
}

export default ChangePassword;