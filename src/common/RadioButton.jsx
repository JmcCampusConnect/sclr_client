import React from "react";

function RadioButton({ label, name, options = [], required, register, errors }) {

    return (
        <div className="space-y-1.5">
            <label className="block text-md font-medium text-gray-700">
                {label} : {required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex mt-4 gap-8">
                {options.map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                        <input
                            {...register(name)}
                            type="radio"
                            value={option}
                            name={name}
                            className="accent-blue-600 scale-110"
                        />
                        <span className="text-gray-800">{option}</span>
                    </label>
                ))}
            </div>
            {errors?.[name] && (
                <p className="text-red-500 text-sm">{errors[name].message}</p>
            )}
        </div>
    )
}

export default RadioButton;