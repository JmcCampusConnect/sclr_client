import React from 'react'

function InputBox({ name, label, required = false, type, placeholder }) {

    return (
        <div>
            <label className="block mb-2 font-medium text-slate-700">
                <span>{label} : </span>
                {required && (<span className="text-red-500 text-lg">*</span>)}
            </label>
            <input
                name={name}
                type={type}
                placeholder={placeholder}
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

export default InputBox