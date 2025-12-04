import React from 'react'
import { CheckCircle } from 'lucide-react';

function StudentGuidelines() {
    
   return (
		<div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
			<div className="flex items-center mb-6">
				<CheckCircle className="w-6 h-6 text-green-600 mr-2" />
				<h1 className="text-2xl font-bold text-gray-800">Guidelines</h1>
			</div>
			<ul className="list-disc list-inside space-y-4 text-gray-700 text-lg leading-relaxed pl-2">
				<li>
					Before filling up the application, ensure you have all your personal and academic information ready.
				</li>
				<li>
				</li>
				<li>
					Use a valid email address and phone number for communication purposes.
				</li>
				<li>
					Submit the completed application before the deadline to avoid disqualification.
				</li>
				<li>
					Ensure all fields in the application are filled out accurately and completely to avoid delays in processing.
				</li>
			</ul>
		</div>
	)
}

export default StudentGuidelines