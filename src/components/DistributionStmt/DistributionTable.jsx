import React from "react";
import { useNavigate } from "react-router-dom";

function DistributionTable({ }) {

	const navigate = useNavigate();

	return (
		<div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
			<div className="max-h-[700px] overflow-y-auto">
				<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
					{/* Table Head */}
					<thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
						<tr>
							{["S.No", "Register No", "Name", "Department", "Category", "Type", "Donor Name", "Amount"].map(
								(header) => (
									<th
										key={header}
										className="px-4 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
									>
										{header}
									</th>
								)
							)}
						</tr>
					</thead>

					{/* Table Body */}
					<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
						<tr
							className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
						>
							<td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
								1
							</td>
							<td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
								2021001
							</td>
							<td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
								John Doe
							</td>
							<td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
								Computer Science
							</td>
							<td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
								Orphan
							</td>
							<td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
								Fresher
							</td>
							<td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
								Mr. Smith
							</td>
							<td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
								10000
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default DistributionTable;