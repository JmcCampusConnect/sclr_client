import React from 'react'
import DistributionTable from '../../components/DistributionStmt/DistributionTable';
import FilterSection from '../../components/DistributionStmt/FilterSection';
import ActionBar from '../../components/DistributionStmt/ActionBar';
import StatusCard from '../../components/DistributionStmt/StatusCard';

function DistributionStmt() {
    return (
        <>
            {/* Header */}
            <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    Distribution Statement
                </h1>
            </header>
            <FilterSection  />
            <ActionBar />
            <DistributionTable  />
            <StatusCard />
        </>
    )
}

export default DistributionStmt;