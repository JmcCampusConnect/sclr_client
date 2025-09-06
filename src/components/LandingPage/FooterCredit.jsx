import React from 'react'

function FooterCredit() {

    return (
        <div className="h-[20%] flex flex-col justify-center text-center animate-pulse">
            <p className="font-semibold text-white text-xs md:text-lg lg:text-xl 2xl:text-2xl">
                Developed By T. Joshwa Anand, <span className="text-xs">II MCA</span>
            </p>
            <p className="font-bold text-white text-xs md:text-lg lg:text-xl 2xl:text-2xl">
                Guided By Dr. O.S. Abdul Qadir, <span className="text-xs">Asst. COE</span>
            </p>
        </div>
    )
}

export default FooterCredit