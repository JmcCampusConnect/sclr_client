import React from 'react'
import '../../App.css'

function AcceptModal({ showAcceptModal, closeModal }) {
    
    return (
        <>
            {showAcceptModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80">
                    <div className="bg-white w-[70%] max-w-6xl max-h-[80vh] rounded-2xl overflow-y-auto shadow-2xl p-8 relative hide-scrollbar">
                        <form className="space-y-10">
                            {/* Header Info */}
                            <div className="bg-gray-100 rounded-xl p-6 shadow-inner">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-1">
                                            Register No. :
                                        </label>
                                        <div className="text-gray-900">123456</div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-1">Name :</label>
                                        <div className="text-gray-900">John Doe</div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-1">Department :</label>
                                        <div className="text-gray-900">Computer Science</div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-1">Special Category :</label>
                                        <div className="text-gray-900">—</div>
                                    </div>
                                </div>
                            </div>

                            {/* Scholarship Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-3">Scholarship Amount</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter Amount"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-3">Scholarship Type</label>
                                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>Select</option>
                                        <option>Merit</option>
                                        <option>Need-Based</option>
                                    </select>
                                </div>
                            </div>

                            {/* Donor Search */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter Donor Name or ID"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                                    <div className="px-4 py-2 cursor-pointer hover:bg-blue-100">D001 - Ahmed</div>
                                    <div className="px-4 py-2 cursor-pointer hover:bg-blue-100">D002 - Fatima</div>
                                </div>
                            </div>

                            {/* Save */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-2 rounded-lg"
                                >
                                    Save
                                </button>
                            </div>

                            {/* Submitted List */}
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Submitted Scholarships</h3>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-4 text-md text-gray-700 gap-4 items-center bg-white rounded-md px-4 py-2 border">
                                        <div>1.</div>
                                        <div className="font-semibold">Merit</div>
                                        <div>Ahmed</div>
                                        <div className="text-right font-medium">₹5,000</div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between gap-4 pt-8 border-t border-gray-200">
                                <div className="flex items-center">
                                    <input type="checkbox" className="w-5 h-5 accent-green-600" />
                                    <label className="ml-3 text-md font-medium text-gray-700">
                                        Allow Negative Values
                                    </label>
                                </div>
                                <div className="space-x-4">
                                    <button
                                        type="button"
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                                    >
                                        Final Submit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default AcceptModal