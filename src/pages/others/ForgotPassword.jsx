import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaPhoneAlt, FaIdCard, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import LoginHeader from "../../components/LoginPage/LoginHeader";

function ForgotPassword() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <LoginHeader />

            <div className="w-full flex justify-center items-center">
                <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl w-full max-w-lg p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-orange-200 dark:hover:shadow-orange-900/20">
                    <form className="grid grid-cols-1 gap-4">
                        {/* Register Number */}
                        <div className="relative">
                            <FaUserAlt className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Register Number"
                                className="w-full border border-gray-300 dark:border-gray-600 pl-10 pr-4 py-2.5 rounded-md placeholder-gray-500 dark:bg-gray-900 dark:text-gray-100 
                                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                            />
                        </div>

                        {/* Mobile Number */}
                        <div className="relative">
                            <FaPhoneAlt className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Mobile Number"
                                maxLength="10"
                                className="w-full border border-gray-300 dark:border-gray-600 pl-10 pr-4 py-2.5 rounded-md placeholder-gray-500 dark:bg-gray-900 dark:text-gray-100 
                                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                            />
                        </div>

                        {/* Aadhar Number */}
                        <div className="relative">
                            <FaIdCard className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Aadhar Number"
                                maxLength="12"
                                className="w-full border border-gray-300 dark:border-gray-600 pl-10 pr-4 py-2.5 rounded-md placeholder-gray-500 dark:bg-gray-900 dark:text-gray-100 
                                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                            />
                        </div>

                        {/* New Password */}
                        <div className="relative">
                            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                className="w-full border border-gray-300 dark:border-gray-600 pl-10 pr-10 py-2.5 rounded-md placeholder-gray-500 dark:bg-gray-900 dark:text-gray-100 
                                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-3.5 text-gray-500 hover:text-orange-500"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                className="w-full border border-gray-300 dark:border-gray-600 pl-10 pr-10 py-2.5 rounded-md placeholder-gray-500 dark:bg-gray-900 dark:text-gray-100 
                                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-3 top-3.5 text-gray-500 hover:text-orange-500"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between gap-4">
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="w-1/2 rounded-lg px-3 p-2 bg-gray-400 hover:bg-gray-500 text-white font-bold transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-1/2 rounded-lg px-3 p-2 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
