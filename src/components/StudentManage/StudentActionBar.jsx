import React from "react";

function StudentActionBar({ totalCount, searchTerm, setSearchTerm, onShowGrid }) {

	const primaryButtonClass = "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md";
	const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

	return (
		<>
			<div className="flex flex-col md:flex-row justify-between items-center gap-4 my-6">
				<div className="flex justify-end gap-4 w-full">
					<button className={primaryButtonClass}>
						<svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
						</svg>
						Download Excel
					</button>
				</div>
			</div>

			<div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
				<input
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="🔍 Search students..."
					className={`w-full md:w-1/2 ${formControlClass}`}
				/>
				<p className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
					No. of Students :{" "}
					<span className="font-semibold text-indigo-600 dark:text-indigo-400">
						{totalCount}
					</span>
				</p>
			</div>
		</>
	);
}

export default StudentActionBar;
