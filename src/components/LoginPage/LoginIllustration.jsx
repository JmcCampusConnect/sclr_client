import React from 'react';
import Map from '../../assets/gifs/Map.gif'

function LoginIllustration() {
    
    return (
        <div className="lg:w-2/3 flex flex-col items-center justify-center">
            <img src={Map} alt="World Map" className="h-32 md:h-72 px-10 object-contain" />
            <p className="text-lg lg:text-2xl font-bold text-white animate-pulse mt-4">
                Jamalians Around The World
            </p>
            <h2 className="text-sm lg:text-xl font-semibold text-white text-center mt-1">
                "Elevating the Next Generation Through Alumni & Well-Wishers"
            </h2>
        </div>
    )
}

export default LoginIllustration