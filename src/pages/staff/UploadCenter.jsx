import React, { useState, useEffect } from "react";
import { UploadCloud, Download, FileText, Loader2, Hammer } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UploadCard = ({ title, name, uploadUrl, downloadUrl, sampleUrl }) => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { userId } = useParams();
    const [fetchError, setFetchError] = useState(null);
    const [studentsData, setStudentsData] = useState([]);
    const [statusCount, setStatusCount] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // For fetching student data for COE
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const Students = await fetchData(`${apiUrl}/api/staff/coe/students`, {});
                setStudentsData(Students.data?.data || []);
                setStatusCount(Students.data.counts)
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    fetchError && fetchError(err.response.data.message || 'No students found');
                } else {
                    console.error('Something error on fetch student for coe:', err);
                    fetchError && fetchError('Server error: unable to fetch student data');
                }
            }
        }
        fetchStudents()
    }, []);

    // For fetching student data for SCLR TPS/PPS
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${apiUrl}/api/staff/sclr/students?staffId=${userId}`);
                const fetchedStudents = response.data.data || [];
                setStudentsData(fetchedStudents);
                setPending(response.data.pending || 0);
                setComplete(response.data.complete || 0);
                const initial = {};
                fetchedStudents.forEach(stu => {
                    initial[stu._id] = stu.governmentScholarship || "";
                });
                setFormData(initial);
                setInitialFormData(initial);
            } catch (err) {
                setError("Failed to fetch student data.");
            } finally { setLoading(false) }
        }
        fetchStudents();
    }, [apiUrl, userId]);

    const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

    const handleUpload = async () => {
        if (!selectedFile) return alert("Please select a file first!");
        const formData = new FormData();
        formData.append("file", selectedFile);
        try {
            setUploading(true);
            await axios.post(uploadUrl, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert(`${title} uploaded successfully!`);
            setSelectedFile(null);
        } catch (err) {
            console.error(err);
            alert("Upload failed. Please try again.");
        } finally { setUploading(false) }
    }

    const handleDownload = async (url, filename) => {
        try {
            const response = await axios.get(url, { responseType: "blob" });
            const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = blobUrl;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch {
            alert("File not found or download failed.");
        }
    }

    return (
        <div className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-center">
            {/* Header */}
            <div className="flex items-center justify-between w-full mb-4">
                <h2 className="text-lg font-semibold text-gray-800">{title} : </h2>
                <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition" />
            </div>
            {/* File input */}
            <label className="w-full cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center text-gray-500 hover:border-blue-400 hover:text-blue-500 transition">
                <input type="file" onChange={handleFileChange} className="hidden" />
                <UploadCloud className="h-10 w-10 mb-2" />
                {selectedFile ? (
                    <p className="text-sm font-medium text-gray-700 truncate w-48">
                        {selectedFile.name}
                    </p>
                ) : (
                    <p className="text-sm">Click to select a file</p>
                )}
            </label>
            {/* Buttons */}
            <div className="flex flex-col w-full mt-6 gap-2">
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-white font-semibold transition ${uploading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="animate-spin h-4 w-4" /> Uploading...
                        </>
                    ) : (
                        <>
                            <UploadCloud className="h-4 w-4" /> Upload File
                        </>
                    )}
                </button>

                <button
                    onClick={() => handleDownload(downloadUrl, `${name}.xlsx`)}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-700 transition"
                >
                    <Download className="h-4 w-4" /> Download File
                </button>

                <button
                    onClick={() => handleDownload(sampleUrl, `${name}_sample.xlsx`)}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg text-white font-semibold bg-fuchsia-700 hover:bg-fuchsia-700 transition"
                >
                    <FileText className="h-4 w-4" /> Download Header
                </button>
            </div>
        </div>
    )
}

const UploadCenter = () => {

    const { userId } = useParams();

    return (
        <div>
            <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Upload Center
                </h1>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                {userId === 'JMCCOE' && (
                    <UploadCard
                        title="COE MARK ENTRY FILE"
                        name="tutor_file"
                        uploadUrl="/api/upload/tutor"
                        downloadUrl="/api/download/tutor"
                        sampleUrl="/api/sample/tutor"
                    />
                )}
                {userId === 'JMCTPS' && (
                    <UploadCard
                        title="TAMIL PUTHALVAN SCHEME"
                        name="tutor_file"
                        uploadUrl="/api/upload/tutor"
                        downloadUrl="/api/download/tutor"
                        sampleUrl="/api/sample/tutor"
                    />
                )}
                {userId === 'JMCPPS' && (
                    <UploadCard
                        title="PUDUMAI PEN SCHEME"
                        name="tutor_file"
                        uploadUrl="/api/upload/tutor"
                        downloadUrl="/api/download/tutor"
                        sampleUrl="/api/sample/tutor"
                    />
                )}
            </div>
        </div>
    )
}

export default UploadCenter;