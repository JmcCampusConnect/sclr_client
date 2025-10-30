import React from 'react';

function DropDown({ label, required = false, name, options = [], register, errors }) {
	
	return (
		<div className="space-y-1.5">
			<label className="block text-md font-medium text-gray-700">
				{label} : {required && <span className="text-red-500">*</span>}
			</label>
			<select
				{...register(name)}
				name={name}
				className={`w-full p-2 border rounded-md bg-white text-gray-900 transition
          			${errors?.[name]
						? 'border-red-500 focus:border-red-500 focus:ring-red-300'
						: 'border-gray-300 focus:border-blue-500 focus:ring-blue-300'}
          				focus:outline-none focus:ring-1`
					}
			>
				<option value="">Select</option>
				{options.map((option) => (
					<option key={option} value={option}>{option}</option>
				))}
			</select>
			{errors?.[name] && (
				<p className="text-red-500 text-sm">{errors[name].message}</p>
			)}
		</div>
	)
}

export default DropDown;