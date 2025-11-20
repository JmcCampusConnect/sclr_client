import React from 'react';
import Map from '../../assets/gifs/Map.gif';

function LoginIllustration() {

    return (
        <div className="lg:w-1/2 flex flex-col items-center justify-center">
            <img
                src={Map}
                alt="World Map"
                className="h-40 md:h-60 object-contain drop-shadow-lg"
            />

            <p className="text-xl lg:text-xl font-extrabold text-amber-300 animate-pulse mt-6 tracking-wider">
                Jamalians Around The World
            </p>

            <div className="h-0.5 w-1/4 bg-amber-400 mt-2 mb-4"></div>

            <h2 className="text-md lg:text-md 2xl:text-lg font-medium text-gray-200 text-center">
                "Elevating the Next Generation Through Alumni & Well-Wishers"
            </h2>
        </div>
    );
}

export default LoginIllustration;
