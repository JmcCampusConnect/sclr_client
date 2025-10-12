import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderTag from '../common/HeaderTag'
const apiUrl = import.meta.env.VITE_API_URL;

function ApplicationDate() {

    const [applnStartDate, setStartDate] = useState('');
    const [applnEndDate, setEndDate] = useState('');
    const [date, setDate] = useState({});

    const handleSaveDates = async () => {
        if (!applnStartDate || !applnEndDate) {
            alert("Please fill in both Start Date and End Date."); return;
        }
        try {
            await axios.post(`${apiUrl}/api/application/settings/updateDates`, {
                applnStartDate, applnEndDate
            })
            alert('Application date saved successfully.');
        } catch (error) {
            console.error('Error saving dates : ', error);
            alert('Failed to save dates.');
        }
    };

    useEffect(() => {
        const fetchDates = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/application/settings/fetchDates`);
                const { applnStartDate, applnEndDate } = response.data || {};
                setDate(response.data);
                if (applnStartDate) setStartDate(applnStartDate.slice(0, 10));
                if (applnEndDate) setEndDate(applnEndDate.slice(0, 10));
            } catch (error) { console.error('Error fetching dates:', error) }
        };
        fetchDates();
    }, [apiUrl]);

    return (
        <div>
            <HeaderTag label={'Application Date Settings'} />
            <div className="bg-white border border-gray-300 rounded-lg shadow p-6 flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-start">
                {/* Start Date */}
                <div className="w-full md:w-auto">
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                        Start Date :
                    </label>
                    <input
                        type="date"
                        value={applnStartDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-gray-400 rounded-md px-3 py-1.5 text-gray-800 w-full md:w-[180px]"
                    />
                </div>
                {/* End Date */}
                <div className="w-full md:w-auto">
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                        End Date :
                    </label>
                    <input
                        type="date"
                        value={applnEndDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-gray-400 rounded-md px-3 py-1.5 text-gray-800 w-full md:w-[180px]"
                    />
                </div>
                {/* Save Button with invisible label for alignment */}
                <div className="w-full md:w-auto">
                    <label className="block mb-5 invisible">Action</label>
                    <button type="button"
                        onClick={handleSaveDates}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 h-[39px] rounded-md transition w-full md:w-auto"
                    >
                        Save Dates
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ApplicationDate