import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function InstructionModal({ instructionModal, onClose }) {

    return (
        <>
            {instructionModal && (
                <div className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-black/95 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-gradient-to-br from-white to-gray-100 text-gray-800 w-[90%] max-w-3xl rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-gray-300 relative p-10 animate-fadeIn">
                        <button
                            onClick={onClose}
                            className="absolute top-7 right-7 text-gray-500 hover:text-red-500 text-xl transition-transform hover:scale-110"
                            aria-label="Close"
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                        <h2 className="text-3xl mt-5 font-bold text-center mb-6 text-teal-600 tracking-wide drop-shadow-md">
                            Application Instructions
                        </h2>
                        <div className="space-y-5 text-gray-700 text-[15px] md:text-base leading-relaxed px-2">
                            <p>
                                <span className="font-semibold text-gray-900">1. Username : </span>
                                Use your <span className="text-teal-600">Register Number</span> as the login ID.
                            </p>
                            <p>
                                <span className="font-semibold text-gray-900">2. Password : </span>
                                Choose a strong password and keep it safe. It’s required for all future logins.
                            </p>
                            <p>
                                <span className="font-semibold text-gray-900">3. Required Fields : </span>
                                All fields marked with <span className="text-red-500 font-bold">*</span> must be filled.
                            </p>
                            <p>
                                <span className="font-semibold text-gray-900">4. Status Check : </span>
                                You can monitor your application status anytime by logging in.
                            </p>
                        </div>
                        <div className="mt-7 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-200"
                            >
                                I Understand
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default InstructionModal