import React from "react";

function FooterCredit({ isDarkMode = false }) {

    const baseText = isDarkMode ? "text-gray-400" : "text-gray-500";
    const emphasis = isDarkMode ? "text-gray-200" : "text-gray-800";

    const developers = [
        "T. Joshwa Anand",
        "M. I. Mohamed Jainul Haneef",
        "H. Abdul Rasak",
        "J. Mohamed Hamdhan",
        "M. Mohamed Hanifa"
    ];

    return (
        <div className="text-center w-full pt-3 select-none">
            <div className="flex justify-center mb-3.5">
                <span className="block w-16 h-[1px] bg-gray-300" />
            </div>
            <p className={`text-xs ${baseText} font-light tracking-wide leading-relaxed`}>
                <span className="block text-[12px] uppercase font-semibold tracking-widest text-gray-400 mb-1">
                    Development Team
                </span>
                <span className={`${emphasis} font-normal`}>
                    {developers.join(", ")}
                </span>
            </p>
            <div className="my-3" />
            <p className={`text-xs ${baseText} font-light tracking-wide`}>
                <span className="block text-[12px] uppercase font-semibold tracking-widest text-gray-400 mb-1">
                    Project Guide
                </span>
                <span className={`${emphasis} font-normal`}>
                    Dr. O.S. Abdul Qadir
                </span>
                <span className={`ml-1 ${baseText}`}>• Asst. COE</span>
            </p>
            <div className="flex justify-center mt-4">
                <span className="block w-16 h-[1px] bg-gray-300" />
            </div>
        </div>
    );
}

export default FooterCredit;