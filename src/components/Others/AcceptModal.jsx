import React, { useState, useEffect } from "react";
import "../../App.css";
import axios from "axios";
import SearchDropdown from "../../common/SearchDropdown";
const apiUrl = import.meta.env.VITE_API_URL;

function AcceptModal({ showAcceptModal, closeModal, selectedStudent, donors }) {

    const [selectedDonor, setSelectedDonor] = useState("");
    const [amount, setAmount] = useState("");
    const [donorType, setDonorType] = useState("");
    const [sclrType, setSclrType] = useState("");
    const [filteredDonors, setFilteredDonors] = useState([]);
    const [allowNegative, setAllowNegative] = useState(false);
    const [scholarships, setScholarships] = useState([]);

    const numericAmount = parseFloat(amount) || 0;

    const donorTypeOptions = [
        { value: "Alumini", label: "Alumini" },
        { value: "Well Wishers", label: "Well Wishers" },
    ]

    const sclrTypeOptions = [
        { value: "generalBal", label: "General" },
        { value: "zakkathBal", label: "Zakkath" },
    ]

    useEffect(() => {

        if (!numericAmount || !donorType || !sclrType) {
            setFilteredDonors([]);
            setSelectedDonor("");
            return;
        }

        let filtered = donors || [];
        if (!allowNegative) {
            filtered = filtered.filter((d) => {
                const donorBalance =
                    sclrType === "generalBal" ? d.generalBal : d.zakkathBal;
                return (
                    d.donorType === donorType &&
                    parseFloat(donorBalance) >= numericAmount
                );
            });
        } else {
            filtered = filtered.filter((d) => d.donorType === donorType);
        }

        setFilteredDonors(filtered);
        if (selectedDonor && !filtered.some((d) => d.donorId === selectedDonor)) {
            setSelectedDonor("");
        }
    }, [numericAmount, donorType, sclrType, donors, selectedDonor, allowNegative]);

    const donorOptions = (filteredDonors || []).map((d) => ({
        value: d.donorId,
        label: `${d.donorId} - ${d.donorName}`,
    }))

    const handleDropdownChange = (name, option) => {
        if (name === "donorType") setDonorType(option?.value || "");
        if (name === "sclrType") setSclrType(option?.value || "");
        if (name === "donor") setSelectedDonor(option?.value || "");
    }

    const handleAddScholarship = () => {

        if (!amount || !donorType || !sclrType || !selectedDonor) {
            alert("Please fill all fields before adding scholarship.");
            return;
        }

        const donorData = donors.find((d) => d.donorId === selectedDonor);
        const newScholarship = {
            id: Date.now(),
            studentId: selectedStudent?._id,
            donorId: selectedDonor,
            donorName: donorData?.donorName || "",
            donorType, sclrType,
            amount: numericAmount,
        };

        setScholarships((prev) => [...prev, newScholarship]);
        setAmount("");
        setSelectedDonor("");
        setFilteredDonors([]);
    }

    const handleSaveAll = async () => {

        if (scholarships.length === 0) {
            alert("Please add at least one scholarship before submitting.");
            return;
        }

        const payload = {
            academicYear: new Date().getFullYear(),
            scholarships: scholarships.map((s) => ({
                ...s,
                registerNo: selectedStudent?.registerNo,
                name: selectedStudent?.name,
                department: selectedStudent?.department,
            })),
        };

        try {

            const response = await axios.post(`${apiUrl}/api/admin/application/sclrDistributions`, payload);
            if (response.status === 201) {
                alert("Scholarships submitted successfully!");
                setScholarships([]);
                closeModal();
            } else {
                alert(`Failed: ${response.data.message}`);
            }
        } catch (err) {
            console.error("Error submitting scholarships:", err);
            const message = err.response?.data?.message || "Something went wrong while submitting scholarships.";
            alert(message);
        }
    }

    if (!showAcceptModal) return null;

    const student = selectedStudent || {};
    const areFiltersSet = numericAmount > 0 && donorType && sclrType;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80">
            <div className="bg-white w-[80%] max-w-6xl max-h-[80vh] rounded-2xl overflow-y-auto shadow-2xl p-8 relative hide-scrollbar">
                <form className="space-y-10">
                    
                    {/* Student Details */}
                    <div className="bg-gray-100 rounded-xl p-6 shadow-inner">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Student Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Register No. :
                                </label>
                                <div className="font-medium text-gray-900">{student.registerNo || "—"}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Name :
                                </label>
                                <div className="font-medium text-gray-900">{student.name || "—"}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Department :
                                </label>
                                <div className="font-medium text-gray-900">{student.department || "—"}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Special Category :
                                </label>
                                <div className="font-medium text-gray-900">{student.specialCategory || "—"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Scholarship Input Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1.5">
                                Scholarship Amount : <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Amount"
                                min="0"
                            />
                        </div>
                        <SearchDropdown
                            label="Donor Type"
                            name="donorType"
                            value={donorType}
                            options={donorTypeOptions}
                            onChange={handleDropdownChange}
                            required
                        />
                        <SearchDropdown
                            label="Scholarship Type"
                            name="sclrType"
                            value={sclrType}
                            options={sclrTypeOptions}
                            onChange={handleDropdownChange}
                            required
                        />
                    </div>

                    {/* Donor Selection */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-800">Select Donor</h3>
                        {!areFiltersSet ? (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm">
                                ⚠️ Please fill in <b>Scholarship Amount</b>, <b>Donor Type</b>, and <b>Scholarship Type</b> to view available donors.
                            </div>
                        ) : donorOptions.length === 0 ? (
                            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
                                ❌ No donors found matching the criteria.
                            </div>
                        ) : (
                            <SearchDropdown
                                name="donor"
                                value={selectedDonor}
                                options={donorOptions}
                                onChange={handleDropdownChange}
                                required
                            />
                        )}
                    </div>

                    {/* Add Scholarship Button */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleAddScholarship}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                        >
                            Add Scholarship
                        </button>
                    </div>

                    {/* Added Scholarships List */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Added Scholarships</h3>
                        {scholarships.length === 0 ? (
                            <div className="italic text-gray-500">No scholarships added yet.</div>
                        ) : (
                            <div className="space-y-3">
                                {scholarships.map((s, i) => (
                                    <div
                                        key={s.id}
                                        className="grid grid-cols-[40px_90px_1fr_100px_100px] gap-4 items-center bg-white rounded-md px-4 py-2 border text-md text-gray-700"
                                    >
                                        <div>{i + 1}.</div>
                                        <div className="font-semibold">
                                            {s.sclrType === "generalBal" ? "General" : "Zakkath"}
                                        </div>
                                        <div className="truncate">{s.donorName}</div>
                                        <div>{s.donorType}</div>
                                        <div className="text-right font-medium">
                                            ₹{s.amount.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between gap-4 pt-8 border-t border-gray-200">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={allowNegative}
                                onChange={(e) => setAllowNegative(e.target.checked)}
                                className="w-5 h-5 accent-green-600"
                            />
                            <label className="ml-3 font-medium text-gray-700">
                                Allow Negative Values
                            </label>
                        </div>
                        <div className="space-x-4">
                            <button
                                type="button"
                                onClick={handleSaveAll}
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
    )
}

export default AcceptModal;