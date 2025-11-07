import React from "react";
import Select from "react-select";

function DropDown({ label, name, options, errors, setValue, watch, required, readOnly }) {

	const formattedOptions = options.map((opt) => typeof opt === "string" ? { value: opt, label: opt } : opt)

	const selectedValue = formattedOptions.find((opt) => opt.value === watch(name))

	const handleChange = (selectedOption) => {
		setValue(name, selectedOption ? selectedOption.value : "", {
			shouldValidate: true, shouldDirty: true,
		});
	};

	return (
		<div className="space-y-2">

			{label && (
				<label
					htmlFor={name} className="block text-md font-medium text-gray-700"
				>
					{label} : {required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}

			<Select
				id={name}
				value={selectedValue}
				onChange={handleChange}
				options={formattedOptions}
				isClearable={false}
				placeholder=""
				isDisabled={readOnly}
				className="text-sm"
				styles={{
					control: (base, state) => ({
						...base, minHeight: "38px", borderWidth: "1px", borderRadius: "6px", 
						backgroundColor: readOnly ? "#f3f4f6" : "white",
						padding: "2.2px", boxShadow: "none",
						borderColor: errors?.[name] ? "#ef4444" : state.isFocused ? "#3b82f6" : "#d1d5db",
						"&:hover": {
							borderColor: errors?.[name] ? "#ef4444" : state.isFocused ? "#3b82f6" : "#9ca3af",
						},
					}),
					singleValue: (base) => ({ ...base, color: "#111827", fontSize: "1rem" }),
					placeholder: (base) => ({ ...base, color: "#9ca3af", }),
					dropdownIndicator: (base, state) => ({
						...base, color: state.isFocused ? "#3b82f6" :
							"#6b7280", "&:hover": { color: "#3b82f6" }
					}),
					menu: (base) => ({ ...base, zIndex: 9999, }),
					menuList: (base) => ({
						...base,
						fontSize: "1rem",
					}),
				}}
			/>

			{errors?.[name] && (
				<p className="text-red-500 text-sm">
					{errors[name].message || `${label || name} is required`}
				</p>
			)}
		</div>
	)
}

export default DropDown;