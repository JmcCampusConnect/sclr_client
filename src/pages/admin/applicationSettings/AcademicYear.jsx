import React, { useState, useEffect } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

// Replace with your loading gif path
import Loading from "../../../assets/svg/Pulse.svg";
import AcademicYearTable from '../../../components/AcademicYear/AcademicYearTable';
import AddAcademicYearModal from '../../../components/AcademicYear/AddAcademicYearModal';
import EditAcademicYearModal from '../../../components/AcademicYear/EditAcademicYearModal';
import DeleteAcademicYearModal from '../../../components/AcademicYear/DeleteAcademicYearModal';

const primaryButtonClass = "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md";

const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500";

function AcademicYear() {

    const [acYears, setAcYears] = useState([]);
    const [currAcYear, setCurrAcYear] = useState('');

    const [isLoading, setIsLoading] = useState(true);  // FIX
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteData, setDeleteData] = useState(null);


    // FIX

    useEffect(() => {
        fetchAcademicYear();
    }, []);

    const fetchAcademicYear = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.get(
                `${apiUrl}/api/application/settings/fetchAcademicYear`
            );

            setAcYears(response.data.academicYears);
            setCurrAcYear(response.data.currAcYear);

        } catch (err) {
            setError("Failed to load academic years.");
        } finally {
            setIsLoading(false);
        }
    };

    const academicSave = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                `${apiUrl}/api/application/settings/academicYearSet`,
                { currAcYear }
            );

            alert("Academic year changed successfully.");
            window.location.reload();

        } catch (error) {
            alert("Something went wrong while setting the academic year.");
        }
    };

    // ---------------------- LOADING UI ----------------------
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center mt-20">
                <img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
                <p className="text-gray-600 font-medium text-lg">Loading academics...</p>
            </div>
        );
    }

    // ---------------------- ERROR UI ------------------------
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center mt-20">
                <p className="text-red-600 font-semibold text-lg">{error}</p>
                <button
                    onClick={fetchAcademicYear}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            <header className="mb-8 border-b border-gray-200 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900">
                    Academic Year Settings
                </h1>
            </header>

            <form onSubmit={academicSave} className="bg-white border border-gray-300 rounded-lg shadow p-6">
                <label className="block text-lg font-semibold mb-4 text-gray-700 w-[50%]">
                    Select Academic Year :
                </label>

                <div className="flex items-center space-x-4 w-[50%]">
                    <select
                        value={currAcYear}
                        onChange={(e) => setCurrAcYear(e.target.value)}
                        className="flex-grow border border-gray-400 rounded-md px-3 py-2 text-gray-800 focus:outline-none"
                        required
                    >
                        <option value="">-- Select --</option>
                        {acYears.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-md transition"
                    >
                        Set
                    </button>
                </div>
            </form>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 my-6">
                <input
                    type="text"
                    placeholder="🔍 Search Academic..."
                    className={`w-full md:w-1/2 ${formControlClass}`}
                />

                <button
                    className={primaryButtonClass}
                    onClick={() => setShowModal(true)}
                >
                    Add Academic
                </button>

            </div>

            <AcademicYearTable
                acYears={acYears}
                onEdit={(data) => setEditData(data)}
                onDelete={(data) => setDeleteData(data)}
            />


            {showModal && (
                <AddAcademicYearModal
                    onClose={() => setShowModal(false)}
                    onAdded={(newAcademic) => {
                        setAcYears((prev) => [...prev, newAcademic]);
                    }}
                />
            )}

            {editData && (
                <EditAcademicYearModal
                    academicData={editData}
                    onClose={() => setEditData(null)}
                    onUpdateAcademic={(updated) => {
                        setAcYears((prev) =>
                            prev.map((ac) => (ac._id === updated._id ? updated : ac))
                        );
                    }}
                />
            )}

            {deleteData && (
                <DeleteAcademicYearModal
                    academic={deleteData}
                    onClose={() => setDeleteData(null)}
                    onDelete={(id) => {
                        setAcYears(prev => prev.filter(ac => ac._id !== id));
                    }}
                />
            )}



        </div>
    );
}

export default AcademicYear;
