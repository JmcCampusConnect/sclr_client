import React from "react";

function ApplicationStatusForm() {

    const formControlClass =
        "block w-full px-3 py-2 text-sm lg:text-base text-gray-700 bg-white " +
        "border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 " +
        "focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

    const primaryButtonClass =
        "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white " +
        "bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none " +
        "focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md";

    const warningButtonClass =
        "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white " +
        "bg-amber-500 rounded-lg hover:bg-amber-600 transition shadow-md";

    const successButtonClass =
        "flex items-center justify-center px-4 py-2 text-sm lg:text-base font-semibold text-white " +
        "bg-green-600 rounded-lg hover:bg-green-700 transition shadow-md";

    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6">

            <h3 className="text-lg sm:text-xl font-semibold bg-gray-100 dark:bg-gray-900 
						   text-gray-800 dark:text-gray-200 p-3 rounded-lg mb-6 border 
						   border-gray-200 dark:border-gray-700">
                Application Status
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block mb-2 text-md font-semibold text-gray-700 dark:text-gray-300">
                        Register No. :
                    </label>
                    <input type="text" className={formControlClass} />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <button className={primaryButtonClass}>Check Status</button>
            </div>

        </div>
    );
}

export default ApplicationStatusForm;



// import React, { useState } from 'react'

// function CheckStatus() {


//     const [userId, setUserId] = useState('');
//     const [userPassword, setUserPassword] = useState('');


//     const handleUserIdChange = (e) => {
//         // console.log(e)
//         setUserId(e.target.value);
//         // console.log(userId)
//     }

//     const handleUserPasswordChange = (e) => {
//         // console.log(e)
//         setUserPassword(e.target.value);
//         // console.log(userPassword)
//     }


//     const handleSubmit = () => {
//         console.log(userId)
//         console.log(userPassword)
//     }

//     return (
//         <div>

//             <input
//                 type="text"
//                 className='bg-red-200'
//                 onChange={handleUserIdChange}
//                 value={userId}

//             />

//             <input
//                 type="text"
//                 className='bg-red-200'
//                 onChange={handleUserPasswordChange}
//                 value={userPassword}

//             />

//             <button
//             onClick={handleSubmit}
//             >Check Status</button>


//         </div>
//     )
// }

// export default CheckStatus
