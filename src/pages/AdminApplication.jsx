import React, { useEffect, useState } from "react";
import axios from "axios";
import FilterSection from "../components/AdminApplication/FilterSection";
import ActionBar from "../components/AdminApplication/ActionBar";
import ApplicationTable from "../components/AdminApplication/ApplicationTable";
const apiUrl = import.meta.env.VITE_API_URL;

function AdminApplication() {

	const [searchMode, setSearchMode] = useState("all");
	const [students, setStudents] = useState([]);

	useEffect(() => {
		const fetchStudents = async () => {
			const response = await axios.get(`${apiUrl}/api/admin/application/fetchStudents`);
			setStudents(response.data.data)
		}
		fetchStudents();
	}, []);

	return (
		<div>
			<header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
				<h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
					Admin Application Management
				</h1>
			</header>
			<FilterSection searchMode={searchMode} setSearchMode={setSearchMode} />
			<ActionBar totalStudents={15} />
			<ApplicationTable students={students} />
		</div>
	)
}

export default AdminApplication;