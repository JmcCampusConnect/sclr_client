import React from 'react'

function DropDown({ label, required = false, name, options = [], register, errors }) {

	return (
		<div>
			<label className="block mb-2 font-medium text-slate-700">
				<span>{label} : </span>
				{required && (<span className="text-red-500 text-lg">*</span>)}
			</label>
			<select
				{...register(name)}
				name={name}
				className=
				{
					`w-full p-2 border rounded-md text-slate-950
					${errors?.[name]
						? 'border-red-500 focus:border-red-500 focus:ring-red-300'
						: 'border-black focus:border-blue-500 focus:ring-blue-300'
					} 
					focus:outline-none focus:ring-1`
				}
			>
				<option value=''>Select</option>
				{options.map((option) => (
					<option key={option} value={option}>{option}</option>
				))}
			</select>
			{errors?.[name] && <p className="text-red-500 text-sm mt-2">{errors[name].message}</p>}
		</div >
	)
}

export default DropDown
