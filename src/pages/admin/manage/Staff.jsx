import React from 'react'
import FilterSection from '../../../components/Tutor/FilterSection'
import ActionBar from '../../../components/Tutor/ActionBar'
import StaffTable from '../../../components/Tutor/TutorTable'

function Staff() {

    return (
        <>
            {/* Header */}
            <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Tutor Management
                </h1>
            </header>
            <FilterSection />
            <ActionBar />
            <TutorTable />
        </>
    )
}

export default Staff