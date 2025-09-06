import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InstructionModal from '../components/RegisterApplication/InstructionModal';
import SpecialCategory from '../components/RegisterApplication/SpecialCategory';
import AcademicDetails from '../components/RegisterApplication/AcademicDetails';
import StudentSection from '../components/RegisterApplication/StudentSection';
import ParentSection from '../components/RegisterApplication/ParentSection';
import AddressSection from '../components/RegisterApplication/AddressSection';
import LastInstitution from '../components/RegisterApplication/LastInstitution';
import Button from '../common/Button';


function RegisterApplication() {

    const customBtnStyle = `bg-blue-500 hover:bg-blue-700`;
    const label = 'Submit';

    return (
        <div className='space-y-7'>
            {/* <InstructionModal instructionModal={instructionModal} onClose={() => setInstructionModal(false)} /> */}
            <SpecialCategory /> <AcademicDetails /> <StudentSection />
            <ParentSection /> <AddressSection /> <LastInstitution />
            <div className='flex justify-end'>
                <Button customBtnStyle={customBtnStyle} label={label} />
            </div>
        </div>
    )
}

export default RegisterApplication