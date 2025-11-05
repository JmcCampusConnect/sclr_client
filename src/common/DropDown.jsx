import React, { useState, useEffect } from "react";
import Select from "react-select";

function DropDown({ label, required = false, name, options = [], register, errors = {}, setValue, watch }) {

	const formattedOptions = options.map((opt) => typeof opt === "object" ? opt : { value: opt, label: opt })

	const [localValue, setLocalValue] = useState(null);

	const formValue = watch ? watch(name) : localValue;
	const selectedValue =
		formattedOptions.find((opt) => opt.value === formValue) || null;

	const handleChange = (selectedOption) => {
		if (setValue) { setValue(name, selectedOption ? selectedOption.value : "") }
		else { setLocalValue(selectedOption ? selectedOption.value : "") }
	}

	useEffect(() => {
		if (watch && formValue !== localValue) {setLocalValue(formValue)}
	}, [formValue]);

	return (
		
		<div className="space-y-1.5">

			{label && (
				<label className="block text-md font-medium text-gray-700">
					{label} : {required && <span className="text-red-500">*</span>}
				</label>
			)}

			<Select
				value={selectedValue}
				onChange={handleChange}
				options={formattedOptions}
				isSearchable
				placeholder="Select..."
				className="text-gray-900"
				styles={{
					control: (base, state) => ({
						...base,
						borderColor: errors?.[name] ? "#ef4444" : "#d1d5db",
						boxShadow: state.isFocused
							? errors?.[name]
								? "0 0 0 1px #ef4444"
								: "0 0 0 1px #3b82f6"
							: "none",
						"&:hover": {
							borderColor: errors?.[name] ? "#ef4444" : "#3b82f6",
						},
						borderRadius: "8px",
						minHeight: "38px",
						backgroundColor: "white",
					}),
					singleValue: (base) => ({ ...base, color: "#111827" }),
					menu: (base) => ({ ...base, zIndex: 9999 }),
				}}
			/>

			{register && <input type="hidden" {...register(name)} />}

			{errors?.[name] && (
				<p className="text-red-500 text-sm">{errors[name].message}</p>
			)}
		</div>
	)
}

export default DropDown;