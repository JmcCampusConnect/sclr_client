import React from 'react'

function FileInput({label, required = false, type, name}) {
    return (
        <div>
            <label className="block mb-2 font-medium text-slate-700">
                <span>{label} : </span>
                {required && (<span className="text-red-500 text-lg">*</span>)}
            </label>
            <input
                name={name}
                type={type}
                className=
                {
                    `w-full p-2 border rounded-md text-slate-950`
                    // ${formErrors?.[name]
                    // ? 'border-red-500 focus:border-red-500 focus:ring-red-300'
                    // : 'border-black focus:border-blue-500 focus:ring-blue-300'} 
                    //     focus:outline-none focus:ring-1`
                }
            />
        </div>
    )
}

export default FileInput