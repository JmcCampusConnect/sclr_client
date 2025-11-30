import React from 'react';
import { useNavigate } from 'react-router-dom';
import FooterCredit from './FooterCredit';

const baseButtonClasses = "font-sans uppercase font-semibold text-sm tracking-widest w-full h-14 rounded-xl transition duration-300 ease-in-out border-2 focus:outline-none focus:ring-4";

const buttonVariants = {
    primary: `text-white border-blue-800 bg-blue-700 hover:bg-blue-800 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 px-3 hover:scale-[1.01] active:scale-[0.99] focus:ring-blue-300 `,
    disabled: `bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed shadow-none `,
    ghost: `bg-transparent text-gray-800 border-gray-400 hover:border-blue-700 hover:text-blue-700 hover:scale-[1.01] active:scale-[0.99] focus:ring-blue-200`,
};

const Button = ({ onClick, disabled, variant, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseButtonClasses} ${disabled ? buttonVariants.disabled : buttonVariants[variant]}`}
    >
        {children}
    </button>
)

function StudentButtons({ applnEndDate }) {

    const navigate = useNavigate();
    const isApplicationClosed = applnEndDate ? new Date().setHours(0, 0, 0, 0) > new Date(applnEndDate).setHours(0, 0, 0, 0) : false;
    const formattedDate = applnEndDate
        ? (() => {
            const d = new Date(applnEndDate);
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            return `${day}-${month}-${year}`;
        })()
        : "N/A";

    return (
        <div
            className=" flex flex-col items-center w-full max-w-xl mx-auto
            space-y-6 p-6 sm:p-8 bg-white/98 rounded-2xl sm:rounded-3xl
            shadow-xl sm:shadow-2xl shadow-black/10
            backdrop-blur-sm border border-gray-100"
        >
            <header className="w-full text-center px-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    Scholarship Portal Access
                </h1>
                <p className="text-gray-500 text-sm sm:text-base">
                    Manage your application and track status.
                </p>
            </header>
            <section className="w-full max-w-md mt-2 px-2">
                {isApplicationClosed ? (
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-300">
                        <p className="font-bold text-lg text-red-700 mb-1">
                            Application Window Closed
                        </p>
                        <p className="text-sm text-gray-600">
                            The registration period has ended.
                        </p>
                    </div>
                ) : (
                    <p className="text-center font-semibold text-lg text-blue-700">
                        Apply Before : {formattedDate}
                    </p>
                )}
            </section>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 mt-4 w-full px-2">
                <Button
                    variant="primary"
                    disabled={isApplicationClosed}
                    onClick={() => navigate('/student/register/application')}
                >
                    New Application
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                >
                    Sign In
                </Button>
            </div>
            <footer className="w-full pt-4 border-t border-gray-200 px-2 mt-4">
                <FooterCredit isDarkMode={false} />
            </footer>
        </div>
    )
}

export default StudentButtons;
