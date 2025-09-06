import React from 'react';
import HeroSection from '../components/LandingPage/HeroSection';
import UserButtons from '../components/LandingPage/UserButtons';
import FooterCredit from '../components/LandingPage/FooterCredit';

function LandingPage() {

	return (
		<div className="w-screen h-screen p-6 pr-16 flex flex-col lg:flex-row items-center bg-blue-500 overflow-hidden 2xl:p-24 2xl:pr-40">
			<div className="w-[65%] h-full relative flex flex-col justify-between items-center">
				<HeroSection />
			</div>
			<div className="w-[35%] flex flex-col justify-items-center items-center rounded-lg h-full">
				<UserButtons />
				<FooterCredit />
			</div>
		</div>
	)
}

export default LandingPage;