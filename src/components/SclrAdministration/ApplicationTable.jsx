import React from "react";
import { useNavigate } from "react-router-dom";

function ApplicationTable({ students, openAcceptModal, openRejectModal }) {

	const navigate = useNavigate();

	return (
		<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-x-auto max-h-[700px] overflow-y-auto">
			<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
				<thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
					<tr>
						{["S.No", "Register No", "Name", "Department", "Last Year (₹)", "Current Year (₹)", "Actions"].map(
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
				<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
					{students.length > 0 ? (
						students.map((app, index) => (
							<tr key={app.applicationId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200">
								<td className="px-4 py-4">{index + 1}</td>
								<td className="px-4 py-4">{app.registerNo}</td>
								<td className="px-4 py-4" style={{minWidth: '300px'}}>{app.name}</td>
								<td className="px-4 py-4">{app.department}</td>
								<td className="px-4 py-4 font-semibold text-indigo-600 dark:text-indigo-400">
									{typeof app.lastYearCreditedAmount === 'number'
										? app.lastYearCreditedAmount === 0
											? "N/A"
											: `₹ ${app.lastYearCreditedAmount.toLocaleString("en-IN")}`
										: "N/A"}
								</td>
								<td className="px-4 py-4 font-semibold text-indigo-600 dark:text-indigo-400">
									{typeof app.currentYearCreditedAmount === 'number'
										? app.currentYearCreditedAmount === 0
											? "N/A"
											: `₹ ${app.currentYearCreditedAmount.toLocaleString("en-IN")}`
										: "N/A"}
								</td>
								<td className="px-4 py-4">
									<div className="flex justify-center gap-2">
										<button
											onClick={() => navigate('/admin/sclrAdministration/view', { state: { student: app } })}
											className="w-16 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition text-xs sm:text-sm"
										>
											View
										</button>
										<button
											onClick={() => openAcceptModal(app)}
											className={`w-16 px-3 py-1.5 rounded-lg font-medium transition text-xs sm:text-sm
                      								${app.applicationStatus === 1 ? 'bg-green-400 text-white' :
													app.applicationStatus === 0 ? 'bg-green-600 hover:bg-green-700 text-white' :
														'bg-gray-300 text-gray-500'}`}
											disabled={app.applicationStatus !== 0}
										>
											Accept
										</button>
										<button
											onClick={() => openRejectModal(app)}
											className={`w-16 px-3 py-1.5 rounded-lg font-medium transition text-xs sm:text-sm
                      								${app.applicationStatus === 2 ? 'bg-red-400 text-white' :
													app.applicationStatus === 0 ? 'bg-red-500 hover:bg-red-600 text-white' :
														'bg-gray-300 text-gray-500'}`}
											disabled={app.applicationStatus !== 0}
										>
											Reject
										</button>
									</div>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan="7" className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
								No applications found.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
x``}

export default ApplicationTable;