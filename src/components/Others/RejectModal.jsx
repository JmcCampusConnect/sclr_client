import React from 'react'

function RejectModal({ showRejectModal, closeModal }) {

    return (
        <>
            {showRejectModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-90">
                    <div className="bg-white w-[80%] max-w-4xl rounded-xl overflow-y-auto shadow-lg p-6">
                        <form className="space-y-8">
                            {/* Header Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-gray-100 p-4 rounded-md shadow">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-gray-600">Register No. :</label>
                                    <div className="text-lg font-semibold uppercase">123456</div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-gray-600">Name :</label>
                                    <div className="text-lg font-semibold uppercase">John Doe</div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-gray-600">Department :</label>
                                    <div className="text-lg font-semibold uppercase">Computer Science</div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-gray-600">Special Category :</label>
                                    <div className="text-lg font-semibold uppercase">—</div>
                                </div>
                            </div>

                            {/* Reason */}
                            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                                <label className="block text-gray-700 font-semibold mb-2">Rejection Reason</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800">
                                        <option>Select Reason</option>
                                        <option>Re Appear</option>
                                        <option>Low Percentage of Marks</option>
                                        <option>Missing Document</option>
                                        <option>Redo</option>
                                        <option>Shortage of Attendance</option>
                                        <option>Shortage of Deeniyath Attendance</option>
                                        <option>Shortage of the Moral Attendance</option>
                                        <option>Others</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Enter custom reason"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end items-center gap-6 mt-6">
                                <button
                                    type="button"
                                    className="bg-green-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-green-700 transition"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-red-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-red-600 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default RejectModal