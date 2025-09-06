import React, { useContext } from 'react'
import RadioButton from '../../common/RadioButton';
import InputBox from '../../common/InputBox';
import DropDown from '../../common/DropDown';
import HeaderTag from '../../common/HeaderTag';

function AcademicDetails() {

    return (
        <>
            <HeaderTag label='Academic Details' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 border mt-7 border-black p-6 rounded-lg bg-gray-50 shadow-md'>
                <RadioButton
                    name='graduate'
                    label='UG or PG'
                    options={['UG', 'PG']}
                    required
                />
                <RadioButton
                    name='programCategory'
                    label='Programme Category'
                    options={['Aided', 'SFM', 'SFW']}
                    required
                />
                <RadioButton
                    name='semester'
                    label='Semester'
                    // options={graduate === 'PG' ? ['I', 'II', 'III', 'IV'] : ['I', 'II', 'III', 'IV', 'V', 'VI']}
                    required
                />
                <RadioButton
                    name='hostelStatus'
                    label='Hostel'
                    options={['Yes', 'No']}
                    required
                />
            </div>
            <div className="space-y-6 border border-black p-6 rounded-lg bg-gray-50 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputBox
                        label='Register No.'
                        type='text'
                        name='registerNo'
                        placeholder='24MCAXYZ'
                        required
                    />
                    <InputBox
                        label='Name'
                        type='text'
                        name='name'
                        placeholder='Name as per ID-Card'
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputBox
                        label='Year of Admission'
                        type='text'
                        name='yearOfAdmission'
                        placeholder='e.g. : 2024'
                        required
                    />
                    <DropDown
                        name='department'
                        label='Department'
                        options={['MBA', 'MCA', 'PAR', 'PBO', 'PBT', 'PCO', 'PCH', 'PCS', 'PEC', 'PEN',
                            'PFT', 'PHS', 'PIT', 'PMA', 'PMB', 'PND', 'PPH', 'PSW', 'PTA', 'PZO', 'UBA',
                            'UBO', 'UBT', 'UCA', 'UCC', 'UCH', 'UCO', 'UCS', 'UEC', 'UEN', 'UFT', 'UHM',
                            'UHS', 'UIC', 'UIF', 'UIT', 'UMA', 'UMB', 'UND', 'UPH', 'UTA', 'UVC', 'UZO',
                            'UAI', 'UAM', 'UAR']}
                        required
                    />
                    <DropDown
                        name='section'
                        label='Section'
                        options={['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']}
                        required
                    />
                </div>
            </div>
        </>
    )
}

export default AcademicDetails