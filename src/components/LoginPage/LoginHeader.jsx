import React from 'react';
import JmcLogo from '../../assets/logos/JmcLogo.png'
import Jmc75 from '../../assets/logos/Jmc75.png'

function LoginHeader() {

    return (
        <div className="w-full flex flex-col lg:flex-row justify-center items-center px-4 lg:px-16">
            <img
                src={JmcLogo}
                alt="LOGO"
                className="w-24 h-24 lg:w-28 lg:h-32"
            />
            <div className="flex flex-col justify-center lg:ml-8 text-center lg:text-left gap-1">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-2">
                    <span className="text-lg md:text-2xl lg:text-3xl font-bold">JAMAL MOHAMED COLLEGE</span>
                    <span className="text-lg md:text-xl lg:text-2xl mt-0.5 font-semibold text-gray-700 uppercase">(Autonomous)</span>
                </div>
                <p className="text-lg md:text-xl font-semibold text-gray-700 text-center">
                    TIRUCHIRAPPALLI - 620 020.
                </p>
                <p className="text-base md:text-lg lg:text-xl font-medium text-gray-800 ">
                    College Sponsored Scholarship for Poor and Meritorious Students
                </p>
            </div>
            <img
                src={Jmc75}
                alt="LOGO"
                className="w-24 h-24 lg:w-32 lg:h-32 ml-4"
            />
        </div>
    )
}

export default LoginHeader