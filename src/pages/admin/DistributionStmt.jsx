import React, { useState, useEffect } from "react";
import axios from "axios";
import DistributionTable from "../../components/DistributionStmt/DistributionTable";
import FilterSection from "../../components/DistributionStmt/FilterSection";
import ActionBar from "../../components/DistributionStmt/ActionBar";
import StatusCard from "../../components/DistributionStmt/StatusCard";
import Loading from "../../assets/svg/Pulse.svg";
import DeleteModal from "../../components/DistributionStmt/DeleteModal";

const apiUrl = import.meta.env.VITE_API_URL;

function DistributionStmt() {

    const [distribution, setDistribution] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState(null);

    const [filters, setFilters] = useState({
        donorId: "all",
        department: "all",
        category: "all",
        sclrType: "all",
        semester: "all",
        fromDate: "", toDate: ""
    });

    const [filteredDistribution, setFilteredDistribution] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedDistribution, setSearchedDistribution] = useState([]);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchDistribution = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${apiUrl}/api/distribution/fetchDistribution`);
                setDistribution(response.data.distributions);
            } catch (error) {
                console.error("Error fetching distribution data:", error);
                setError("Failed to load distribution data. Please try again later.");
            } finally { setIsLoading(false) }
        };
        fetchDistribution();

        const fetchDepts = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/dept/fetchDepts`);
                const data = res.data.depts || [];
                setDepartments(data);
            } catch (err) {
                console.error('Failed to fetch departments', err);
            }
        };

        fetchDepts();
    }, []);


    useEffect(() => {

        let filtered = [...distribution];

        if (filters.donorId && filters.donorId !== "all") {
            filtered = filtered.filter(d => String(d.donorId) === String(filters.donorId));
        }

        // Department
        if (filters.department && filters.department !== "all") {
            filtered = filtered.filter(d => d.department === filters.department);
        }

        // Category
        if (filters.category && filters.category !== "all") {
            filtered = filtered.filter(d => d.category === filters.category);
        }

        // Semester Odd or Even
        if (filters.semester && filters.semester !== "all") {
            if (filters.semester === "odd") {
                filtered = filtered.filter(d => {
                    const s = parseInt(d.semester, 10);
                    return !isNaN(s) && (s % 2 === 1);
                });
            } else if (filters.semester === "even") {
                filtered = filtered.filter(d => {
                    const s = parseInt(d.semester, 10);
                    return !isNaN(s) && (s % 2 === 0);
                });
            }
        }

        // Date Range Filter
        if (filters.fromDate || filters.toDate) {
            const from = filters.fromDate ? new Date(filters.fromDate) : null;
            const to = filters.toDate ? new Date(filters.toDate) : null;
            filtered = filtered.filter(d => {
                if (!d.createdAt) return false;
                const created = new Date(d.createdAt);
                if (isNaN(created.getTime())) return false;
                if (from && created < from) return false;
                if (to) {
                    const toEnd = new Date(to);
                    toEnd.setHours(23, 59, 59, 999);
                    if (created > toEnd) return false;
                }
                return true;
            });
        }

        setFilteredDistribution(filtered);
    }, [distribution, filters]);

    useEffect(() => {
        const parseSemesterNum = (sem) => {
            if (!sem) return null;
            const s = String(sem).trim();
            const digits = s.match(/\d+/);
            if (digits) return parseInt(digits[0], 10);
            const map = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6 };
            const up = s.toUpperCase();
            return map[up] || null;
        };
        const toDateObj = (val) => {
            if (!val) return null;
            const d = new Date(val);
            if (!isNaN(d)) return d;
            const parts = String(val).split(/[.\/-]/);
            if (parts.length === 3) {
                const [p1, p2, p3] = parts;
                return new Date(parseInt(p3, 10), parseInt(p2, 10) - 1, parseInt(p1, 10));
            }
            return null;
        };

        let result = [...distribution];

        // Donor Filter
        if (filters.donorId && filters.donorId !== "all") {
            result = result.filter(r => String(r.donorId) === String(filters.donorId));
        }
        // Department Filter
        if (filters.department && filters.department !== 'all') {
            result = result.filter(r => String(r.department).toLowerCase() === String(filters.department).toLowerCase());
        }

        // Category Filter
        if (filters.category && filters.category !== 'all') {
            result = result.filter(r => String(r.category).toLowerCase() === String(filters.category).toLowerCase());
        }

        // Scholarship Type Filter
        if (filters.sclrType && filters.sclrType !== 'all') {
            result = result.filter(r => String(r.sclrType) === String(filters.sclrType));
        }

        // Semester Odd or Even
        if (filters.semester && filters.semester !== 'all') {
            result = result.filter(r => {
                const num = parseSemesterNum(r.semester);
                if (num === null) return false;
                if (filters.semester === 'odd') return num % 2 === 1;
                if (filters.semester === 'even') return num % 2 === 0;
                return true;
            });
        }

        // Date Range Filter
        const from = toDateObj(filters.fromDate);
        const to = toDateObj(filters.toDate);
        if (from || to) {
            result = result.filter(r => {
                const created = toDateObj(r.createdAt) || toDateObj(r.updatedAt) || null;
                if (!created) return false;
                if (from && created < from) return false;
                if (to) {
                    const toEnd = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999);
                    if (created > toEnd) return false;
                }
                return true;
            });
        }
        setFilteredDistribution(result);
    }, [filters, distribution]);

    useEffect(() => {
        if (!searchTerm || searchTerm.trim() === "") {
            setSearchedDistribution(filteredDistribution);
            return;
        }
        const q = searchTerm.toLowerCase();
        setSearchedDistribution(filteredDistribution.filter(r =>
            (r.name || "").toLowerCase().includes(q) ||
            (r.registerNo || "").toLowerCase().includes(q) ||
            (r.donorName || "").toLowerCase().includes(q) ||
            (r.donorId || "").toLowerCase().includes(q)
        ));
    }, [searchTerm, filteredDistribution]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <img src={Loading} alt="Loading..." className="w-24 h-24 mb-4 animate-spin" />
                <p className="text-gray-600 font-medium text-lg">Loading distribution statement...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
        )
    }

    return (
        <>
            <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Distribution Statement
                </h1>
            </header>
            <FilterSection filters={filters} setFilters={setFilters} departments={departments} />
            <ActionBar
                data={searchedDistribution}
                total={searchedDistribution.length}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
            <DistributionTable
                distribution={searchedDistribution}
                onDeleteClick={(donor) => {
                    setSelectedDonor(donor);
                    setShowDeleteModal(true);
                }}
            />
            <StatusCard />
            {showDeleteModal && selectedDonor && (
                <DeleteModal
                    donor={selectedDonor}
                    onClose={() => setShowDeleteModal(false)}
                    onDelete={(donorId) => {
                        setDistribution(prev =>
                            prev.filter(d => d.donorId !== donorId)
                        );
                    }}
                />
            )}

        </>
    );
}

export default DistributionStmt;