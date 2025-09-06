import React from 'react'

function RadioButton({ label, required = false, option = [], name, options = [] }) {

    return (
        <div>
            <label className="block mb-2 font-medium text-slate-700">
                <span>{label} : </span>
                {required && (<span className="text-red-500 text-lg">*</span>)}
            </label>
            <div className="flex mt-4 gap-8">
                {options.map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                        <input
                            name={name}
                            type="radio"
                            className="scale-125"
                        />
                        <span className="text-lg">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    )
}

export default RadioButton