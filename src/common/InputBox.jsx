import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function InputBox({ name, label = false, required = false, type, placeholder, register, errors, readOnly = false }) {

	const [showPassword, setShowPassword] = useState(false);
	const handleUppercase = (e) => { e.target.value = e.target.value.toUpperCase() }

	return (
		<div className="space-y-2">
			{label && (
				<label className="block text-md font-medium text-gray-700">
					{label} : {required && <span className="text-red-500">*</span>}
				</label>
			)}
			<div className="relative">
				<input
					{...register(name)}
					name={name}
					type={type === 'password' && showPassword ? 'text' : type}
					placeholder={placeholder}
					readOnly={readOnly}
					onInput={type !== 'password' ? handleUppercase : undefined}
					className={`w-full p-2 pr-10 border rounded-md text-gray-900 transition
						${readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
						${errors?.[name]
							? 'border-red-500 focus:border-red-500 focus:ring-red-300'
							: 'border-gray-300 focus:border-blue-500 focus:ring-blue-300'}
						focus:outline-none focus:ring-1`
					}
				/>

				{type === 'password' && (
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
						tabIndex={-1}
					>
						{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
					</button>
				)}
			</div>

			{errors?.[name] && (
				<p className="text-red-500 text-sm">{errors[name].message}</p>
			)}
		</div>
	)
}

export default InputBox;