import React from 'react'

function Button({ customBtnStyle, label, handleSubmit }) {

    return (
        <button
            onClick={handleSubmit}
            className={`px-6 py-2.5 text-white text-md font-semibold rounded-lg shadow-lg transition duration-300 ${customBtnStyle}`}
        >
            {label}
        </button>
    )
}

export default Button