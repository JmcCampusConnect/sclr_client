import React from "react";

const MOCK_APPLICATIONS = [
	{ sno: 1, registerno: 1001, name: "Alice Johnson", deptId: "UCA", amount: 12000 },
	{ sno: 2, registerno: 1002, name: "Bob Williams", deptId: "UCS", amount: 15000 },
	{ sno: 3, registerno: 1003, name: "Clara Smith", deptId: "UEC", amount: 9800 },
	{ sno: 4, registerno: 1004, name: "Daniel Brown", deptId: "UCA", amount: 13200 },
	{ sno: 5, registerno: 1005, name: "Eva Davis", deptId: "UCS", amount: 14200 },
	{ sno: 6, registerno: 1006, name: "Frank Miller", deptId: "UEC", amount: 8700 },
	{ sno: 7, registerno: 1007, name: "Grace Lee", deptId: "UCA", amount: 15500 },
	{ sno: 8, registerno: 1008, name: "Henry Wilson", deptId: "UCS", amount: 11000 },
	{ sno: 9, registerno: 1009, name: "Ivy Taylor", deptId: "UEC", amount: 10000 },
	{ sno: 10, registerno: 1010, name: "Jack Thomas", deptId: "UCA", amount: 12200 },
	{ sno: 11, registerno: 1011, name: "Kara White", deptId: "UCS", amount: 9000 },
	{ sno: 12, registerno: 1012, name: "Liam Harris", deptId: "UEC", amount: 13600 },
	{ sno: 13, registerno: 1013, name: "Mia Clark", deptId: "UCA", amount: 14500 },
	{ sno: 14, registerno: 1014, name: "Noah Adams", deptId: "UCS", amount: 9600 },
	{ sno: 15, registerno: 1015, name: "Olivia Perez", deptId: "UEC", amount: 15800 },
];

function ApplicationTable() {
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
										className="px-6 py-3 text-xs sm:text-sm lg:text-base font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
									>
										{header}
									</th>
								)
							)}
						</tr>
					</thead>

					{/* Table Body */}
					<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
						{MOCK_APPLICATIONS.map((app) => (
							<tr
								key={app.sno}
								className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
							>
								<td className="px-6 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
									{app.sno}
								</td>
								<td className="px-6 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
									{app.registerno}
								</td>
								<td className="px-6 py-4 text-sm lg:text-base font-medium text-gray-800 dark:text-white whitespace-nowrap">
									{app.name}
								</td>
								<td className="px-6 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
									{app.deptId}
								</td>
								<td className="px-6 py-4 text-sm lg:text-base font-semibold text-indigo-600 dark:text-indigo-400">
									₹ {app.amount.toLocaleString("en-IN")}
								</td>
								<td className="px-6 py-4 text-sm lg:text-base whitespace-nowrap">
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