import React, { useState } from 'react'
import HeaderTag from '../../common/HeaderTag'
import RadioButton from '../../common/RadioButton'
import SearchDropdown from '../../common/SearchDropdown'

function SpecialCategory({ register, errors }) {

    const [selectedCategory, setSelectedCategory] = useState(null);

    const specialCategoryOptions = [
        { value: 'General', label: 'General' },
        { value: 'Mu-addin', label: 'Mu-addin' },
        { value: 'Hazrath', label: 'Hazrath' },
        { value: 'Father Mother Separated', label: 'Father Mother Separated' },
        { value: 'Father Expired', label: 'Father Expired' },
        { value: 'Single Parent', label: 'Single Parent' },
        { value: 'Orphan', label: 'Orphan' },
    ];

    const handleSelectChange = (name, option) => {  setSelectedCategory(option)}

    return (
        <>
            <HeaderTag label='New Application' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 border border-black p-6 rounded-lg bg-gray-50 shadow-md'>

                <div>
                    <SearchDropdown
                        label='Special Category'
                        name='specialCategory'
                        value={selectedCategory?.value || ''}
                        options={specialCategoryOptions}
                        onChange={handleSelectChange}
                        required
                    />
                    {errors.specialCategory && (
                        <p className="text-red-500 text-sm mt-1">{errors.specialCategory.message}</p>
                    )}
                    <input
                        type="hidden"
                        {...register('specialCategory')}
                        value={selectedCategory?.value || ''}
                    />
                </div>

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