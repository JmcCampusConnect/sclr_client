import React from 'react';

function FileInput({ label, required = false, type, name, register, errors }) {

    return (
        <div className="space-y-1.5">
            <label className="block text-md font-medium text-gray-700">
                {label} : {required && <span className="text-red-500">*</span>}
            </label>
            <input
                {...register(name)}
                name={name}
                type={type}
                className={`w-full p-2 border rounded-md bg-white text-gray-900 transition
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

export default FileInput;