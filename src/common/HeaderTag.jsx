import React from 'react'

function HeaderTag({ label }) {

    return (
        <h3 className="text-xl mb-6 font-semibold bg-gray-600 rounded text-white p-3">
            {label}
        </h3>
    )
}

export default HeaderTag;