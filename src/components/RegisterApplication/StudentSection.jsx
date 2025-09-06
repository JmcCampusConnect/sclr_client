import React from 'react'
import DropDown from '../../common/DropDown'
import HeaderTag from '../../common/HeaderTag'
import InputBox from '../../common/InputBox'

function StudentSection() {

    return (
        <>
            <HeaderTag label='Student Details' />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border border-black p-6 rounded-lg bg-gray-50 shadow-md">
                <DropDown
                    name='religion'
                    label='Religion'
                    options={['Islam', 'Hindu', 'Christian', 'Others']}
                    required
                />
                <InputBox
                    name='mobileNo'
                    label='Mobile No.'
                    type='text'
                    required
                />
                <InputBox
                    name='aadharNo'
                    label='Aadhar No.'
                    type='text'
                    required
                />
            </div>
        </>
    )
}

export default StudentSection