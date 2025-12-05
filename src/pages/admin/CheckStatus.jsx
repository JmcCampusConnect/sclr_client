import React, { useState, useEffect } from "react";
import axios from "axios";
import StatusModal from "../../components/Others/StatusModal";
import AcceptModal from "../../components/Others/AcceptModal";

function CheckStatus() {

    const [registerNo, setRegisterNo] = useState("");
    const [modalData, setModalData] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [donors, setDonors] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/admin/application/fetchDonors`);
                setDonors(res.data.donors);
            } catch (err) {
                console.error("Error fetching donors:", err);
            }
        };
        fetchDonors();
    }, []);


    const checkStatus = async () => {

        if (!registerNo) {
            alert("Please enter a register number.");
            return;
        }

        try {
            const response = await axios.get(`${apiUrl}/api/student/status`, { params: { registerNo } });
            if (response.data.success) {
                setModalData(response.data.student);
            } else {
                alert(response.data.message || "Failed to fetch application status.");
                setModalData(null);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("An error occurred while fetching the application status.");
            }
            console.error("Error in checking status : ", error);
            setModalData(null);
        }
    }

    const handleRelease = (student) => {
        setSelectedStudent(student);
        setShowAcceptModal(true);
    };

    const closeAcceptModal = () => {
        setShowAcceptModal(false);
        setSelectedStudent(null);
    }

    const formControlClass =
        "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white " +
        "border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 " +
        "focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

    const primaryButtonClass =
        "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white " +
        "bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none " +
        "focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md";

    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
            rounded-xl shadow-lg p-6">

            {/* Status Modal */}
            {modalData && (
                <StatusModal
                    data={modalData}
                    onClose={() => setModalData(null)}
                    onRelease={handleRelease}
                />
            )}

            {/* Accept Modal */}
            <AcceptModal
                showAcceptModal={showAcceptModal}
                closeModal={closeAcceptModal}
                selectedStudent={selectedStudent}
                donors={donors}
            />

            <header className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Application Status
                </h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block mb-3.5 text-md font-semibold text-gray-700 dark:text-gray-300">
                        Register Number :
                    </label>
                    <input
                        type="text"
                        name="registerNo"
                        autoComplete="on"
                        className={formControlClass}
                        value={registerNo}
                        onChange={(e) => setRegisterNo(e.target.value.toUpperCase())}
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <button className={primaryButtonClass} onClick={checkStatus}>
                    Check Status
                </button>
            </div>
        </div>
    );
}

export default CheckStatus;