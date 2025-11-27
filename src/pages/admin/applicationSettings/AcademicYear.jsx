import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../../assets/svg/Pulse.svg";
import AcademicYearTable from "../../../components/AcademicYear/AcademicYearTable";
import AddAcademicYearModal from "../../../components/AcademicYear/AddAcademicYearModal";
import EditAcademicYearModal from "../../../components/AcademicYear/EditAcademicYearModal";
import DeleteAcademicYearModal from "../../../components/AcademicYear/DeleteAcademicYearModal";

const primaryButtonClass = "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none";
const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500";
const apiUrl = import.meta.env.VITE_API_URL;

function AcademicYear() {

    const [acYears, setAcYears] = useState([]);
    const [currAcYear, setCurrAcYear] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteData, setDeleteData] = useState(null);
    const [allAcademicYears, setAllAcademicYears] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAcademicYears, setFilteredAcademicYears] = useState([]);

    useEffect(() => {
        fetchAcademicYear();
    }, []);

    useEffect(() => {
        if (!searchTerm || searchTerm.trim() === "") {
            setFilteredAcademicYears(allAcademicYears || []);
            return;
        }
        const q = String(searchTerm).trim().toLowerCase();
        const filtered = (allAcademicYears || []).filter((item) => {
            const idMatch = String(item.academicId || "").toLowerCase().includes(q);
            const yearMatch = String(item.academicYear || "").toLowerCase().includes(q);
            return idMatch || yearMatch;
        });
        setFilteredAcademicYears(filtered);
    }, [allAcademicYears, searchTerm]);

    const fetchAcademicYear = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get(`${apiUrl}/api/application/settings/fetchAcademicYear`);
            setAcYears(response.data.academicYears);
            setCurrAcYear(response.data.currAcYear);
            setAllAcademicYears(response.data.getAllAcademicYears);
        } catch (err) {
            setError("Failed to load academic years.");
        } finally { setIsLoading(false) }
    }

    const academicSave = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${apiUrl}/api/application/settings/academicYearSet`, { currAcYear })
            alert("Academic year changed successfully.");
            fetchAcademicYear();
        } catch (error) {
            alert("Something went wrong while setting the academic year.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center mt-20">
                <img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
                <p className="text-gray-600 font-medium text-lg">Loading academics...</p>
            </div>
        )
    }

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
        )
    }

    return (
        <div>

            <header className="mb-8 border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-extrabold text-center text-gray-900">
                    Academic Year Settings
                </h1>
            </header>

            <form onSubmit={academicSave} className="bg-white border rounded-lg shadow p-6">
                <label className="block text-lg font-semibold mb-4 text-gray-700 w-[50%]">
                    Select Academic Year :
                </label>

                <div className="flex items-center space-x-4 w-[50%]">
                    <select
                        value={currAcYear}
                        onChange={(e) => setCurrAcYear(e.target.value)}
                        className="flex-grow border border-gray-400 rounded-md px-3 py-2"
                        required
                    >
                        <option value="">-- Select --</option>
                        {acYears.map((year, index) => (
                            <option key={index} value={year}> {year} </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-md"
                    >
                        Set
                    </button>
                </div>
            </form>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 my-6">
                <input
                    type="text"
                    placeholder="🔍 Search by ID or Year..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full md:w-1/2 ${formControlClass}`}
                />

                <button className={primaryButtonClass} onClick={() => setShowModal(true)}>
                    Add Academic
                </button>
            </div>

            <AcademicYearTable
                acYears={filteredAcademicYears}
                onEdit={(data) => setEditData(data)}
                onDelete={(data) => setDeleteData(data)}
            />

            {showModal && (
                <AddAcademicYearModal
                    onClose={() => setShowModal(false)}
                    onAdded={(newAcademic) => {
                        setAllAcademicYears((prev) => [...prev, newAcademic]);
                        setShowModal(false);
                    }}
                />
            )}

            {editData && (
                <EditAcademicYearModal
                    academicData={editData}
                    onClose={() => setEditData(null)}
                    onUpdateAcademic={(updated) => {
                        setAllAcademicYears((prev) => prev.map((ac) => ac.academicId === updated.academicId ? updated : ac))
                        setEditData(null);
                    }}
                />
            )}

            {deleteData && (
                <DeleteAcademicYearModal
                    academic={deleteData}
                    onClose={() => setDeleteData(null)}
                    onDelete={(id) => {
                        setAllAcademicYears((prev) => prev.filter((ac) => ac.academicId !== id));
                        setDeleteData(null);
                    }}
                />
            )}
        </div>
    );
}

export default AcademicYear;
