import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
import HeaderTag from '../../../common/HeaderTag'

function AcademicYear() {

    const [acYears, setAcYears] = useState([]);
    const [currAcYear, setCurrAcYear] = useState('')

    useEffect(() => {
        const fetchAcademicYear = async () => {
            const response = await axios.get(`${apiUrl}/api/application/settings/fetchAcademicYear`);
            setAcYears(response.data.academicYears)
            setCurrAcYear(response.data.currAcYear)
        }
        fetchAcademicYear();
    }, [])

    const academicSave = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/api/application/settings/academicYearSet`, { currAcYear });
            alert('Academic year changed successfully.');
            window.location.reload();
        } catch (error) {
            console.error('Error in setting academic year : ', error);
            alert('Something went wrong while setting the academic year.');
        }
    }

    return (
        <div>
            <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Academic Year Settings
                </h1>
            </header>
            <form onSubmit={academicSave} className="bg-white border border-gray-300 rounded-lg shadow p-6">
                <label htmlFor="acyear" className="block text-lg font-semibold mb-4 text-gray-700 w-[50%]">
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
                        {acYears.map((year) => (<option key={year} value={year}>{year}</option>))}
                    </select>
                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-md transition"
                    >
                        Set
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AcademicYear;