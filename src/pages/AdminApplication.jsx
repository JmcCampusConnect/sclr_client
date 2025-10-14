import React, { useState } from "react";
import FilterSection from "../components/AdminApplication/FilterSection";
import ActionBar from "../components/AdminApplication/ActionBar";
import ApplicationTable from "../components/AdminApplication/ApplicationTable";

function AdminApplication() {

	const [searchMode, setSearchMode] = useState("all");

	return (
		<div>
			<header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
				<h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
					Admin Application Management
				</h1>
			</header>
			<FilterSection searchMode={searchMode} setSearchMode={setSearchMode} />
			<ActionBar totalStudents={15} />
			<ApplicationTable />
		</div>
	)
}

export default AdminApplication;