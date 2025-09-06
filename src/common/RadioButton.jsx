import React from "react";

function RadioButton({ label, name, options = [], required, register, errors }) {

    return (
        <div>
            <label className="block mb-2 font-medium text-slate-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex mt-4 gap-8">
                {options.map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                        <input
                            {...register(name)}
                            type="radio"
                            value={option}
                            name={name}
                            className="scale-125"
                        />
                        <span className="text-lg">{option}</span>
                    </label>
                ))}
            </div>
            {errors?.[name] && <p className="text-red-500 text-sm mt-4">{errors[name].message}</p>}
        </div>
    )
}

export default RadioButton;