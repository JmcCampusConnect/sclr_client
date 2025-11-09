import React from "react";

const ButtonsBar = ({ primaryButtonClass, handleDownloadExcel }) => (

    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex justify-end gap-4 w-full">
            <button className={primaryButtonClass} onClick={handleDownloadExcel}>
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                </svg>
                Download Excel
            </button>
        </div>
    </div>
)

export default ButtonsBar;