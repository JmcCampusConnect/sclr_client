import React from 'react';
import MyJamal from '../../assets/images/MyJamal.png';
import JmcLogo from '../../assets/logos/JmcLogo.png'
import ManMoving from '../../assets/gifs/ManMoving.gif';

function HeroSection() {

    return (
        <>
            <div className='flex flex-col justify-center w-full h-[75%] items-center'>
                <img
                    src={JmcLogo}
                    alt="Jamal Logo"
                    className="absolute h-40 md:h-60 lg:h-96 md:w-60 lg:w-80 opacity-10 2xl:w-1/2 2xl:h-3/5"
                />
                <img
                    src={MyJamal}
                    alt="My Jamal My Pride"
                    className="z-10 mt-20 w-44 h-36 md:w-44 md:h-48 lg:w-3/4 lg:h-64"
                />
                <h1 className="z-10 text-white text-center font-semibold text-lg md:text-2xl lg:text-3xl pb-10 italic ">
                    Show Us The Right Path
                </h1>
            </div>
            <div className="w-full flex h-[25%] items-center justify-center">
                <img
                    src={ManMoving}
                    alt="Man"
                    className="w-24 h-24 md:w-40 md:h-full"
                />
                <div className='pr-20'>
                    <p className="text-amber-300 font-bold text-lg md:text-2xl lg:text-2xl font-serif">"Jamal &#8211; Empowering your FUTURE with</p>
                    <p className="text-amber-300 font-bold text-center text-lg md:text-2xl lg:text-2xl font-serif">Education and Scholarship."</p>
                </div>
                <h2 >
                    &nbsp;&nbsp;
                </h2>
            </div>
        </>
    )
}

export default HeroSection