import React, { useState } from 'react'
import TutorFilterSection from '../../../components/Tutor/TutorFilterSection'
import TutorActionBar from '../../../components/Tutor/TutorActionBar'
import TutorTable from '../../../components/Tutor/TutorTable'
import AddTutorModal from '../../../components/Tutor/AddTutorModal'
import EditTutorModal from '../../../components/Tutor/EditTutorModal'
import DeleteTutorModal from '../../../components/Tutor/DeleteTutorModal'

function Tutor() {

    const [addTutor, setAddTutor] = useState(null);
    const [editTutor, setEditTutor] = useState(null);
    const [deleteTutor, setDeleteTutor] = useState(null);

    const handleAddTutor = (newTutor) => {
        console.log("New tutor added : ", newTutor);
    }

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
            <TutorFilterSection />
            <TutorActionBar
                onClose={() => setAddTutor(null)}
                onAddTutor={() => setAddTutor({})}
            />
            <TutorTable
                onEditTutor={setEditTutor}
                onDeleteTutor={setDeleteTutor}
            />
            {addTutor && (
                <AddTutorModal
                    tutor={addTutor}
                    onAddTutor={handleAddTutor}
                    onClose={() => setAddTutor(null)}
                />
            )}
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