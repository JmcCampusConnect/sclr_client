import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Key, Loader, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL;

const LABELS = {
    application: 'Application Records',
    student: 'Student Profiles',
    distribution: 'Distribution Logs',
    donor: 'Donor History',
    transaction: 'Financial Transactions',
    staff: 'Staff Assignments',
};

const DataDeletion = () => {

    const [data, setData] = useState({});
    const [selected, setSelected] = useState({});
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        axios.get(`${apiUrl}/api/dataDeletion/fetchUniqueValues`)
            .then(res => {
                setData(res.data.data);
                const init = {};
                Object.keys(res.data.data).forEach(k => init[k] = []);
                setSelected(init);
            });
    }, []);

    const toggle = (collection, value) => {
        setSelected(prev => ({
            ...prev,
            [collection]: prev[collection].includes(value)
                ? prev[collection].filter(v => v !== value)
                : [...prev[collection], value],
        }));
    };

    const getTotalSelectedCount = () =>
        Object.values(selected).reduce((acc, curr) => acc + curr.length, 0);

    const handleDelete = async () => {
        if (!password) {
            setStatus({ type: 'error', message: 'Admin password is required.' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await axios.post(`${apiUrl}/api/dataDeletion/delete`, {
                selections: selected,
                adminPassword: password,
            });
            setStatus({
                type: 'success',
                message: `Data purged successfully. Summary: ${JSON.stringify(res.data.deletedSummary)}`
            });
            setPassword('');
        } catch (err) {
            setStatus({
                type: 'error',
                message: err.response?.data?.message || 'A server error occurred during deletion.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-3">
                        <Trash2 className="text-red-600" size={36} />
                        System Data Purge
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Select specific academic years to permanently remove records from the database.</p>
                </div>

                {/* Warning Banner */}
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 flex gap-3 items-start">
                    <AlertTriangle className="text-amber-600 shrink-0" />
                    <div>
                        <h3 className="font-bold text-amber-800">Irreversible Action</h3>
                        <p className="text-amber-700 text-sm">Deleting data will remove all associated files and logs. Please ensure you have a backup before proceeding.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Selection Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {Object.keys(data).length > 0 && Object.values(data).some(arr => arr.length > 0) ? (
                            Object.entries(data).map(([collection, values]) => (
                                values.length > 0 && (
                                    <div key={collection} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                                            <h2 className="font-bold text-slate-700 uppercase text-xs tracking-wider">
                                                {LABELS[collection] || collection}
                                            </h2>
                                        </div>
                                        <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {values.map(item => (
                                                <button
                                                    key={item._id}
                                                    onClick={() => toggle(collection, item._id)}
                                                    className={`flex flex-col items-center justify-center px-4 py-3 rounded-lg border transition-all
                                                        ${selected[collection]?.includes(item._id)
                                                            ? 'bg-red-50 border-red-200 text-red-700 ring-2 ring-red-100'
                                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                        }`}
                                                >
                                                    <span className="text-sm font-semibold">{item._id}</span>
                                                    <span className="text-xs text-slate-400 mt-3">
                                                        {item.count} records
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                                <CheckCircle className="mx-auto text-slate-300 mb-4" size={48} />
                                <h3 className="text-lg font-bold text-slate-800">Nothing to delete</h3>
                                <p className="text-slate-500">All system records are currently cleared or no data matches the purge criteria.</p>
                            </div>
                        )}
                    </div>

                    {/* Action Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 sticky top-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Info size={20} className="text-blue-500" />
                                Selection Summary
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Items selected : </span>
                                    <span className="font-bold text-slate-900">{getTotalSelectedCount()} Categories</span>
                                </div>
                                <div className="border-t pt-3">
                                    <label className="block text-sm font-semibold text-slate-700 mb-4 mt-2">Confirm Admin Password</label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleDelete}
                                disabled={loading || getTotalSelectedCount() === 0}
                                className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${loading || getTotalSelectedCount() === 0
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                                    }`}
                            >
                                {loading ? <Loader className="animate-spin" /> : <Trash2 size={20} />}
                                {loading ? 'Processing...' : 'Execute Bulk Delete'}
                            </button>

                            {status.message && (
                                <div className={`mt-4 p-4 rounded-lg flex gap-2 items-start text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                    {status.type === 'success' ? <CheckCircle size={16} className="shrink-0 mt-0.5" /> : <AlertTriangle size={16} className="shrink-0 mt-0.5" />}
                                    <p>{status.message}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataDeletion;