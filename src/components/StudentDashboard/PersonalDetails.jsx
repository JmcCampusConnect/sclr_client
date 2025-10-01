import React from "react";
import { Card, Detail } from "./UI";

const PersonalDetails = ({ student }) => (

	<Card title="Personal Details">
		<div className="grid md:grid-cols-3 gap-6">
			<Detail label="Register No." value={student.registerNo} />
			<Detail label="Name" value={student.name} />
			<Detail label="Department" value={student.department} />
			<Detail label="Section" value={student.section} />
			<Detail label="Graduate" value={student.graduate} />
			<Detail label="Programme Category" value={student.programCategory} />
			<Detail label="Semester" value={student.semester} />
			<Detail label="Mobile No." value={student.mobileNo} />
			<Detail label="Aadhar Number" value={student.aadharNo} />
			<Detail label="Parent Name" value={student.parentName} />
			<Detail label="Parent Contact No." value={student.parentNo} />
			<Detail label="Parent Occupation" value={student.parentOccupation} />
			<Detail label="Annual Income" value={student.parentAnnualIncome} />
			<Detail label="Siblings" value={student.siblingsStatus} />
			{student.siblingsStatus === "Yes" && (
				<>
					<Detail label="No. of Siblings" value={student.siblingsCount} />
					<Detail label="Siblings Occupation" value={student.siblingsOccupation} />
					<Detail label="Family Annual Income" value={student.siblingsIncome} />
				</>
			)}
			<Detail label="Hostel" value={student.hostelStatus} />
			<Detail label="Religion" value={student.religion} />
			<Detail label="Address" value={student.address} />
			<Detail label="State" value={student.state} />
			<Detail label="District" value={student.district} />
			<Detail label="Pincode" value={student.pinCode} />
		</div>
	</Card>
)

export default PersonalDetails;