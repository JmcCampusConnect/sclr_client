import React from "react"; 

function DistributionTable({ distribution }) {

	return (
		<div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
			<div className="max-h-[700px] overflow-y-auto">
				<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
					{/* Table Head */}
					<thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
						<tr>
							{["S.No", "Register No", "Name", "Department", "Category", "Sclr Type", "Donor Name", "Donor Type", "Amount"].map(
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
						{distribution.length > 0 ? (
							distribution.map((dist, index) => (
								<tr
									key={dist.registerNo}
									className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
								>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
										{index + 1}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
										{dist.registerNo}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
										{dist.name}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
										{dist.department}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
										{dist.category}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
										{dist.sclrType}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
										{dist.donorName}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
										{dist.donorType}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
										{`₹ ${dist.givenAmt.toLocaleString("en-IN")}`}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="9" className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
									No distribution statements found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default DistributionTable;