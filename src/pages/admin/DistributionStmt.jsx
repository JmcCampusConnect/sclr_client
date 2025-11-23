import React, {useState, useEffect} from "react";
import axios from "axios";
import DistributionTable from "../../components/DistributionStmt/DistributionTable";
import FilterSection from "../../components/DistributionStmt/FilterSection";
import ActionBar from "../../components/DistributionStmt/ActionBar";
import StatusCard from "../../components/DistributionStmt/StatusCard";
import Loading from "../../assets/svg/Pulse.svg";

const apiUrl = import.meta.env.VITE_API_URL;

function DistributionStmt() {
    const [distribution, setDistribution] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters and derived lists
    const [filters, setFilters] = useState({
        donor: "", // donor name or id
        department: "all",
        category: "all",
        sclrType: "all",
        semester: "all", // all | odd | even
        fromDate: "",
        toDate: ""
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchDistribution();
        // fetch departments for searchable dropdown
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

    // Apply filters (AND gate)
    useEffect(() => {
        let filtered = [...distribution];

        // donor search (id or name)
        if (filters.donor && filters.donor.trim() !== "") {
            const q = filters.donor.toLowerCase();
            filtered = filtered.filter(d =>
                (d.donorName && d.donorName.toLowerCase().includes(q)) ||
                (d.donorId && d.donorId.toLowerCase().includes(q))
            );
        }

        // department
        if (filters.department && filters.department !== "all") {
            filtered = filtered.filter(d => d.department === filters.department);
        }

        // category
        if (filters.category && filters.category !== "all") {
            filtered = filtered.filter(d => d.category === filters.category);
        }

        // semester: odd -> 1,3,5 ; even -> 2,4,6
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

        // date range: filters.fromDate and filters.toDate are YYYY-MM-DD
        if (filters.fromDate || filters.toDate) {
            const from = filters.fromDate ? new Date(filters.fromDate) : null;
            // include entire toDate day by setting time to end of day
            const to = filters.toDate ? new Date(filters.toDate) : null;

            filtered = filtered.filter(d => {
                if (!d.createdAt) return false;
                const created = new Date(d.createdAt);
                if (isNaN(created.getTime())) return false;
                if (from && created < from) return false;
                if (to) {
                    // set to end of day for inclusive range
                    const toEnd = new Date(to);
                    toEnd.setHours(23, 59, 59, 999);
                    if (created > toEnd) return false;
                }
                return true;
            });
        }

        setFilteredDistribution(filtered);
    }, [distribution, filters]);

    // Apply filters (AND gate)
    useEffect(() => {
        const parseSemesterNum = (sem) => {
            if (!sem) return null;
            const s = String(sem).trim();
            // try numeric
            const digits = s.match(/\d+/);
            if (digits) return parseInt(digits[0], 10);
            // roman numerals
            const map = {I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6};
            const up = s.toUpperCase();
            return map[up] || null;
        };

        const toDateObj = (val) => {
            if (!val) return null;
            const d = new Date(val);
            if (!isNaN(d)) return d;
            // try dd.mm.yyyy
            const parts = String(val).split(/[.\/-]/);
            if (parts.length === 3) {
                const [p1, p2, p3] = parts;
                // assume dd.mm.yyyy
                return new Date(parseInt(p3, 10), parseInt(p2, 10) - 1, parseInt(p1, 10));
            }
            return null;
        };

        let result = [...distribution];

        // donor filter (name or id)
        if (filters.donor && filters.donor.trim() !== "") {
            const q = filters.donor.toLowerCase();
            result = result.filter(r => (r.donorName || "").toLowerCase().includes(q) || (r.donorId || "").toLowerCase().includes(q));
        }

        if (filters.department && filters.department !== 'all') {
            result = result.filter(r => String(r.department).toLowerCase() === String(filters.department).toLowerCase());
        }

        if (filters.category && filters.category !== 'all') {
            result = result.filter(r => String(r.category).toLowerCase() === String(filters.category).toLowerCase());
        }

        if (filters.sclrType && filters.sclrType !== 'all') {
            result = result.filter(r => String(r.sclrType) === String(filters.sclrType));
        }

        // semester odd/even
        if (filters.semester && filters.semester !== 'all') {
            result = result.filter(r => {
                const num = parseSemesterNum(r.semester);
                if (num === null) return false;
                if (filters.semester === 'odd') return num % 2 === 1;
                if (filters.semester === 'even') return num % 2 === 0;
                return true;
            });
        }

        // date range filter on createdAt
        const from = toDateObj(filters.fromDate);
        const to = toDateObj(filters.toDate);
        if (from || to) {
            result = result.filter(r => {
                const created = toDateObj(r.createdAt) || toDateObj(r.updatedAt) || null;
                if (!created) return false;
                if (from && created < from) return false;
                if (to) {
                    // include whole day for 'to'
                    const toEnd = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999);
                    if (created > toEnd) return false;
                }
                return true;
            });
        }

        setFilteredDistribution(result);
    }, [filters, distribution]);

    // Apply search on filtered results only
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
        );
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
            {/* Header */}
            <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Distribution Statement
                </h1>
            </header>

            <FilterSection filters={filters} setFilters={setFilters} departments={departments} />
            <ActionBar total={searchedDistribution.length} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <DistributionTable distribution={searchedDistribution} />
            <StatusCard />
        </>
    );
}

export default DistributionStmt;