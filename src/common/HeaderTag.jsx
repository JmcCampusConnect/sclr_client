import React from 'react';

function HeaderTag({ label }) {
    return (
        <h3 className="text-xl font-semibold bg-gradient-to-r 
            from-slate-700 to-slate-500 text-white px-5 py-3 rounded-lg shadow-sm mb-6"
        >
            {label}
        </h3>
    )
}

export default HeaderTag;