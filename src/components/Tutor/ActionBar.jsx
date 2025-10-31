import React from "react";

function ActionBar({ }) {

	const primaryButtonClass = "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md";
	const secondaryButtonClass = "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 transition";
	const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

	return (
		<>
			{/* Buttons */}
			<div className="flex flex-col md:flex-row justify-between items-center gap-4 my-6">
				{/* Buttons and Count */}
				<div className="flex flex-col sm:flex-row items-center gap-4 w-full">
					<div className="flex justify-end gap-4 w-full">
						<button className={secondaryButtonClass}>
							{/* Simple Icon for Show Grid */}
							<svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
							Show Grid
						</button>
						<button className={primaryButtonClass}>
							{/* Simple Icon for Download */}
							<svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
							Download Excel
						</button>
					</div>
				</div>
			</div>

			{/* Search + Count */}
			<div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
				<input
					placeholder="🔍 Search applications..."
					className={`w-full md:w-1/2 ${formControlClass}`}
				/>
				<p className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
					No. of Tutors : {" "}
					<span className="font-semibold text-indigo-600 dark:text-indigo-400">
						150
					</span>
				</p>
			</div>
		</>
	)
}

export default ActionBar;