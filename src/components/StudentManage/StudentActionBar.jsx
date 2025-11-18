import React from "react";

function StudentActionBar({ totalCount, searchTerm, setSearchTerm, onShowGrid }) {

	const secondaryButtonClass = "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 transition";
	const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

	return (
		<>
			<div className="flex flex-col md:flex-row justify-between items-center gap-4 my-6">
				<div className="flex flex-col sm:flex-row items-center gap-4 w-full">
					<div className="flex justify-end gap-4 w-full">
						<button
							className={secondaryButtonClass}
							onClick={onShowGrid}
						>
							<svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
							Show Grid
						</button>
					</div>
				</div>
			</div>
			<div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 mt-8">
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
	)
}

export default StudentActionBar;