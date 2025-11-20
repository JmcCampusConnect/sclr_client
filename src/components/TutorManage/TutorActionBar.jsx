import React from "react";

function TutorActionBar({ onAddTutor, handleSearch, tutors }) {

	const primaryButtonClass = "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md";
	const formControlClass = "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

	return (
		<>
			<div className="flex flex-col md:flex-row justify-between items-center gap-4 my-6">
				<div className="flex flex-col sm:flex-row items-center gap-4 w-full">
					<div className="flex justify-end gap-4 w-full">
						<div className="flex items-center">
							<button
								onClick={onAddTutor}
								className={primaryButtonClass}
							>
								Add Tutor
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
				<input
					placeholder="🔍 Search tutors..."
					className={`w-full md:w-1/2 ${formControlClass}`}
					onChange={(e) => handleSearch(e.target.value)}
				/>

				<p className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
					No. of Tutors :{" "}
					<span className="font-semibold text-indigo-600 dark:text-indigo-400">
						{tutors.length}
					</span>
				</p>
			</div>
		</>
	)
}

export default TutorActionBar;