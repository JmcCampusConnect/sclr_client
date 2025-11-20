import React from 'react';
import JmcLogo from '../../assets/logos/JmcLogo.png'
import Jmc75 from '../../assets/logos/Jmc75.png'

function LoginHeader() {

    const brandColor = "text-blue-800 dark:text-blue-400";
    const subtextColor = "text-gray-600 dark:text-gray-300";

    return (
        <header className="w-full flex flex-col lg:flex-row justify-center items-center px-4 lg:px-16 pt-4 pb-2 transition-colors duration-500">
            
            {/* Left Logo */}
            <img
                src={JmcLogo}
                alt="Jamal Mohamed College Logo"
                className="w-20 h-20 lg:w-24 lg:h-24 object-contain flex-shrink-0"
            />
            
            {/* Header Text Block */}
            <div className="flex flex-col justify-center lg:ml-6 text-center lg:text-left mt-2 lg:mt-0 gap-0.5">
                <div className="flex flex-col lg:flex-row items-center justify-center lg:items-end gap-2">
                    <span className={`text-xl md:text-3xl lg:text-3xl font-extrabold ${brandColor}`}>
                        JAMAL MOHAMED COLLEGE
                    </span>
                    <span className={`text-lg md:text-xl lg:text-xl font-semibold ${subtextColor} mt-0.5 whitespace-nowrap uppercase`}>
                        ( Autonomous )
                    </span>
                </div>
                <p className={`text-md md:text-lg ${subtextColor} font-medium text-center`}>
                    TIRUCHIRAPPALLI - 620 020.
                </p>
                <p className={`text-base md:text-lg lg:text-xl font-medium text-green-700 dark:text-green-400`}>
                    College Sponsored Scholarship for Poor and Meritorious Students
                </p>
            </div>
            
            {/* Right Logo (Anniversary) */}
            <img
                src={Jmc75}
                alt="JMC 75th Anniversary Logo"
                className="w-16 h-16 lg:w-24 lg:h-24 ml-4 mt-2 lg:mt-0 object-contain flex-shrink-0"
            />
        </header>
    )
}

export default LoginHeader