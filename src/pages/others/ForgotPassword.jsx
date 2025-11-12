import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaPhoneAlt, FaIdCard, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import LoginHeader from "../../components/LoginPage/LoginHeader";

function ForgotPassword() {

    const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_URL
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        registerNo: "", mobileNo: "", aadharNo: "",
        newPassword: "", confirmPassword: "",
    });

    const [formErrors, setFormErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {

        const errors = {};

        if (!formData.registerNo.trim())
            errors.registerNo = "Register number is required";
        if (!formData.mobileNo.trim())
            errors.mobileNo = "Mobile number is required";
        else if (!/^[0-9]{10}$/.test(formData.mobileNo))
            errors.mobileNo = "Enter a valid 10-digit number";

        if (!formData.aadharNo.trim())
            errors.aadharNo = "Aadhar number is required";
        else if (!/^[0-9]{12}$/.test(formData.aadharNo))
            errors.aadharNo = "Enter a valid 12-digit Aadhar number";

        if (!formData.newPassword.trim())
            errors.newPassword = "New password is required";
        if (!formData.confirmPassword.trim())
            errors.confirmPassword = "Confirm password is required";
        else if (formData.newPassword !== formData.confirmPassword)
            errors.confirmPassword = "Passwords do not match";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
        setSuccessMessage("");
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setSuccessMessage("");
        setFormErrors({});

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await axios.put(`${apiUrl}/api/student/forgotPassword`, formData);
            setSuccessMessage("Password reset successful!");
            setFormData({
                registerNo: "", mobileNo: "", aadharNo: "",
                newPassword: "", confirmPassword: "",
            });
        } catch (error) {
            console.error("Error resetting password : ", error);
            setFormErrors((prev) => ({
                ...prev,
                generalError: "Failed to reset password. Please provide valid details or contact scholarship office.",
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 transition-colors duration-500">

            <LoginHeader />

            <div className="w-full flex justify-center items-center">
                <div className="bg-white shadow-xl rounded-xl w-full max-w-2xl px-8 py-4 pt-8 border border-gray-100 transition-all duration-500 transform hover:shadow-orange-300/50">
                    <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-5 tracking-tight">
                        Reset Your Password
                    </h2>

                    {/* Global Messages */}
                    {successMessage && (
                        <p className="text-green-600 font-semibold text-sm text-center mb-5">
                            {successMessage}
                        </p>
                    )}

                    {formErrors.generalError && (
                        <p className="text-red-600 font-semibold text-sm text-center mb-5">
                            {formErrors.generalError}
                        </p>
                    )}


                    <form
                        className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"
                        onSubmit={handleSubmit}
                    >
                        {/* Register Number */}
                        <div className="relative group">
                            <FaUserAlt className="absolute left-3 top-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <input
                                type="text"
                                name="registerNo"
                                value={formData.registerNo}
                                onChange={handleChange}
                                placeholder="Register Number"
                                className={`w-full border-b-2 
                                    ${formErrors.registerNo
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } 
                                    pl-10 pr-4 py-3 text-gray-800 focus:border-orange-500 focus:ring-0 outline-none transition-all duration-300 text-base`}
                            />
                            {formErrors.registerNo && (
                                <p className="text-red-600 text-sm mt-2">
                                    {formErrors.registerNo}
                                </p>
                            )}
                        </div>

                        {/* Mobile Number */}
                        <div className="relative group">
                            <FaPhoneAlt className="absolute left-3 top-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <input
                                type="text"
                                name="mobileNo"
                                value={formData.mobileNo}
                                onChange={handleChange}
                                placeholder="Mobile Number"
                                maxLength="10"
                                className={`w-full border-b-2 
                                    ${formErrors.mobileNo
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }
                                    pl-10 pr-4 py-3 text-gray-800 focus:border-orange-500 focus:ring-0 outline-none transition-all duration-300 text-base`}
                            />
                            {formErrors.mobileNo && (
                                <p className="text-red-600 text-sm mt-2">
                                    {formErrors.mobileNo}
                                </p>
                            )}
                        </div>

                        {/* Aadhar Number */}
                        <div className="relative group sm:col-span-2">
                            <FaIdCard className="absolute left-3 top-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <input
                                type="text"
                                name="aadharNo"
                                value={formData.aadharNo}
                                onChange={handleChange}
                                placeholder="Aadhar Number"
                                maxLength="12"
                                className={`w-full border-b-2 
                                    ${formErrors.aadharNo
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } 
                                    pl-10 pr-4 py-3 text-gray-800 focus:border-orange-500 focus:ring-0 outline-none transition-all duration-300 text-base`}
                            />
                            {formErrors.aadharNo && (
                                <p className="text-red-600 text-sm mt-2">
                                    {formErrors.aadharNo}
                                </p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="relative group">
                            <FaLock className="absolute left-3 top-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="New Password"
                                className={`w-full border-b-2 
                                    ${formErrors.newPassword
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } 
                                    pl-10 pr-10 py-3 text-gray-800 focus:border-orange-500 focus:ring-0 outline-none transition-all duration-300 text-base`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-4 text-gray-500 hover:text-orange-500 transition-colors duration-200"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            {formErrors.newPassword && (
                                <p className="text-red-600 text-sm mt-2">
                                    {formErrors.newPassword}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="relative group">
                            <FaLock className="absolute left-3 top-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm New Password"
                                className={`w-full border-b-2 
                                    ${formErrors.confirmPassword
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } 
                                    pl-10 pr-10 py-3 text-gray-800 focus:border-orange-500 focus:ring-0 outline-none transition-all duration-300 text-base`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-3 top-4 text-gray-500 hover:text-orange-500 transition-colors duration-200"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            {formErrors.confirmPassword && (
                                <p className="text-red-600 text-sm mt-2">
                                    {formErrors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between gap-6 py-4 sm:col-span-2">
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="w-1/2 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm bg-gray-200 text-gray-700 font-semibold 
                                hover:bg-gray-300 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                <FaArrowLeft /> Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-1/2 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${isSubmitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/50 hover:shadow-orange-600/60"
                                    }`}
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;