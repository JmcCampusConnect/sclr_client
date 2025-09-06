import React from 'react'
import HeaderTag from '../../common/HeaderTag'
import DropDown from '../../common/DropDown'
import RadioButton from '../../common/RadioButton'

function SpecialCategory({ register, errors }) {

    return (
        <>
            <HeaderTag label='New Application' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 border border-black p-6 rounded-lg bg-gray-50 shadow-md'>
                <DropDown
                    name='specialCategory'
                    label='Special Category'
                    options={['General', 'Mu-addin', 'Hazrath', 'Father Mother Separated', 'Father Expired', 'Single Parent', 'Orphan']}
                    required
                    register={register}
                    errors={errors}
                />
                <RadioButton
                    name='hasAppliedOtherScholarships'
                    label='Have you applied for any other scholarships ?'
                    options={['Yes', 'No']}
                    register={register}
                    errors={errors}
                />
            </div>
        </>
    )
}

export default SpecialCategory