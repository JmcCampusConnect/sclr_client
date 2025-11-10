import React from 'react'
import { Hammer } from "lucide-react";

function Application() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-center px-6">
            <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full border border-gray-200">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-indigo-100 rounded-full">
                        <Hammer size={48} className="text-indigo-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                    Under Construction
                </h1>

                <p className="text-gray-600 mb-6">
                    This section is currently being built. We’re working to bring this feature to you soon.
                </p>

                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition-all duration-200"
                >
                    Refresh Later
                </button>
            </div>

            <p className="text-sm text-gray-500 mt-8">
                © {new Date().getFullYear()} Data Management Portal
            </p>
        </div>
    )
}

export default Application