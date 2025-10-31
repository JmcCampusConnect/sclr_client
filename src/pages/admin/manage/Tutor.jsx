import React, { useState } from 'react'
import FilterSection from '../../../components/Tutor/FilterSection'
import ActionBar from '../../../components/Tutor/ActionBar'
import TutorTable from '../../../components/Tutor/TutorTable'
import EditTutorModal from '../../../components/Tutor/EditTutorModal'
import DeleteTutorModal from '../../../components/Tutor/DeleteTutorModal'

function Tutor() {

    const [editTutor, setEditTutor] = useState(null);
    const [deleteTutor, setDeleteTutor] = useState(null);

    const handleEditTutor = (updatedTutor) => {
        console.log("Tutor updated : ", updatedTutor);
    }

    const handleDeleteTutor = (tutorId) => {
        console.log("Tutor deleted with ID : ", tutorId);
    }

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
            <TutorTable
                onEditTutor={setEditTutor}
                onDeleteTutor={setDeleteTutor}
            />
            {editTutor && (
                <EditTutorModal
                    tutor={editTutor}
                    onClose={() => setEditTutor(null)}
                    onEditTutor={handleEditTutor}
                />
            )}
            {deleteTutor && (
                <DeleteTutorModal
                    tutor={deleteTutor}
                    onClose={() => setDeleteTutor(null)}
                    onDelete={handleDeleteTutor}
                />
            )}
        </>
    )
}

export default Tutor