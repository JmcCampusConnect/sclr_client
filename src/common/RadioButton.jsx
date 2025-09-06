import React from "react";

function RadioButton({ label, name, options = [], value, onChange, required, errors }) {

    return (
        <div>
            <label className="block mb-2 font-medium text-slate-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex mt-4 gap-8">
                {options.map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name={name}
                        />
                        <span>{option}</span>
                    </label>
                ))}
            </div>
            {errors?.[name] && <p className="text-red-500 text-sm">{errors[name].message}</p>}
        </div>
    )
}

export default RadioButton;