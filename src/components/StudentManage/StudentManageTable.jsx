import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentManageTable({ students: initialStudents, onSaveStudent }) {

	const [students, setStudents] = useState(initialStudents);

	useEffect(() => {
		setStudents(initialStudents);
	}, [initialStudents]);

	const handlePasswordChange = (e, registerNo) => {
		const newPassword = e.target.value;
		setStudents(prevStudents =>
			prevStudents.map(student =>
				student.registerNo === registerNo
					? { ...student, password: newPassword, isEdited: true }
					: student
			)
		);
	};

	const handleSemBasedToggle = (registerNo) => {
		setStudents(prevStudents =>
			prevStudents.map(student =>
				student.registerNo === registerNo
					? {
						...student,
						isSemBased: student.isSemBased === 1 ? 0 : 1,
						isEdited: true
					}
					: student
			)
		);
	};

	const handleSave = (student) => {
		if (onSaveStudent) onSaveStudent(student);
		setStudents(prevStudents =>
			prevStudents.map(s =>
				s.registerNo === student.registerNo
					? { ...s, isEdited: false }
					: s
			)
		);
	};

	return (
		<div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
			<div className="max-h-[700px] overflow-y-auto">
				<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center table-auto">
					<thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
						<tr>
							{["S.No", "Register No", "Name", "Department", "Category", "Password", "Sembased", "Action"].map(
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
							students.map((student, index) => (
								<tr
									key={student?.registerNo}
									className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200 ${student.isEdited ? 'bg-blue-50/50 dark:bg-blue-900/50' : ''}`}
								>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-900 dark:text-gray-100">
										{index + 1}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
										{student?.registerNo}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
										{student?.name}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
										{student?.department}
									</td>
									<td className="px-4 py-4 text-sm lg:text-base text-gray-800 dark:text-white">
										{student?.category}
									</td>
									<td className="px-4 py-4">
										<input
											type="text"
											value={student?.password || ""}
											onChange={(e) => handlePasswordChange(e, student.registerNo)}
											className="w-28 sm:w-40 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
										/>
									</td>
									<td className="px-4 py-4">
										<label className="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												checked={student?.isSemBased === 1}
												onChange={() => handleSemBasedToggle(student.registerNo)}
												className="sr-only peer"
											/>
											<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
											
										</label>
									</td>
									<td className="px-4 py-4 text-sm lg:text-base whitespace-nowrap">
										<button
											onClick={() => handleSave(student)}
											disabled={!student.isEdited}
											className={`w-20 px-3 py-1.5 rounded-lg font-medium transition text-xs sm:text-sm ${student.isEdited
												? "bg-indigo-500 hover:bg-indigo-600 text-white"
												: "bg-gray-300 text-gray-700 cursor-not-allowed"
												}`}
										>
											Save
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="9" className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
									No students found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default StudentManageTable;
