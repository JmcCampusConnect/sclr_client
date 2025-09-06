import React from 'react'

function FileInput({ label, required = false, type, name, register, errors }) {
    return (
        <div>
            <label className="block mb-2 font-medium text-slate-700">
                <span>{label} : </span>
                {required && (<span className="text-red-500 text-lg">*</span>)}
            </label>
            <input
                {...register(name)}
                name={name}
                type={type}
                className=
                {
                    `w-full p-2 border rounded-md text-slate-950
                    ${errors?.[name]
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-300'
                        : 'border-black focus:border-blue-500 focus:ring-blue-300'
                    } focus:outline-none focus:ring-1`
                }
            />
			{errors?.[name] && <p className="text-red-500 text-sm mt-2">{errors[name].message}</p>}
        </div>
    )
}

export default FileInput