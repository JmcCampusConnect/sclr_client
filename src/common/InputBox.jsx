import React from 'react';

function InputBox({ name, label = false, required = false, type, placeholder, register, errors, readOnly = false }) {

	const handleUppercase = (e) => { e.target.value = e.target.value.toUpperCase() }

	return (
		<div className="space-y-2">
			{label && (
				<label className="block text-md font-medium text-gray-700">
					{label} : {required && <span className="text-red-500">*</span>}
				</label>
			)}
			<input
				{...register(name)}
				name={name}
				type={type}
				placeholder={placeholder}
				readOnly={readOnly}
				onInput={handleUppercase}
				className={`w-full p-2 border rounded-md text-gray-900 transition
					${readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
					${errors?.[name]
						? 'border-red-500 focus:border-red-500 focus:ring-red-300'
						: 'border-gray-300 focus:border-blue-500 focus:ring-blue-300'}
					focus:outline-none focus:ring-1`
				}
			/>
			{errors?.[name] && (
				<p className="text-red-500 text-sm">{errors[name].message}</p>
			)}
		</div>
	)
}

export default InputBox;