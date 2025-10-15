import React from "react";

function ApplicationTable({students}) {

	return (
		<div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
			<div className="max-h-[700px] overflow-y-auto">
				<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
					{/* Table Head */}
					<thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
						<tr>
							{["S.No", "Register No", "Name", "Department", "Amount Credited (₹)", "Actions"].map(
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
						{students.map((app, index) => (
							<tr
								key={app.sno}
								className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
							>
								<td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
									{index + 1}
								</td>
								<td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
									{app.registerNo}
								</td>
								<td className="px-4 py-4 text-sm lg:text-base font-medium text-gray-800 dark:text-white whitespace-nowrap">
									{app.name}
								</td>
								<td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
                                    {app.department}
                                </td>
                                <td className="px-4 py-4 text-sm lg:text-base font-semibold text-indigo-600 dark:text-indigo-400">
                                    {typeof app.amount === 'number'
                                        ? `₹ ${app.amount.toLocaleString("en-IN")}`
                                        : "N/A"}
                                </td>
                                <td className="px-4 py-4 text-sm lg:text-base whitespace-nowrap">
                                    <div className="flex justify-center gap-2">
                                        <button className="w-16 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition text-xs sm:text-sm">
											View
										</button>
										<button className="w-16 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition text-xs sm:text-sm">
											Accept
										</button>
										<button className="w-16 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition text-xs sm:text-sm">
											Reject
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default ApplicationTable;