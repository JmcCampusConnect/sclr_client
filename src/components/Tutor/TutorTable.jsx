import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

function TutorTable({ onEditTutor, onDeleteTutor }) {

	const navigate = useNavigate();
	const [tutors, setTutors] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get(`${apiUrl}/api/tutor/fetchTutors`);
			setTutors(response.data.tutors);
		};
		fetchData();
	}, []);

	return (
		<div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
			<div className="max-h-[700px] overflow-y-auto">
				<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
					{/* Table Head */}
					<thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
						<tr>
							{["S.No", "Staff ID", "Staff Name", "Department", "Category", "Section", "Batch", "Action"].map(
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
						{tutors.length > 0 ? (
							tutors.map((tutor, index) => (
								<tr
									key={tutor.staffId}
									className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
								>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
										{index + 1}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
										{tutor.staffId}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
										{tutor.staffName}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
										{tutor.department}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
										{tutor.programCategory}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
										{tutor.section}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-300">
										{tutor.batch}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base whitespace-nowrap">
										<div className="flex justify-center gap-4">
											<button
												onClick={() => onEditTutor(tutor)}
												className="w-20 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition text-xs sm:text-sm"
											>
												Edit
											</button>
											<button
												onClick={() => onDeleteTutor(tutor)}
												className="w-20 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition text-xs sm:text-sm"
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan="8"
									className="px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base"
								>
									No tutors found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default TutorTable;