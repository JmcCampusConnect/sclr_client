import React from 'react'
import HeaderTag from '../../common/HeaderTag'
import RadioButton from '../../common/RadioButton'
import DropDown from '../../common/DropDown'

function SpecialCategory({ register, errors, setValue, watch }) {

    return (
        <>
            <HeaderTag label="New Application" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-200 p-6 rounded-xl bg-white shadow-mdd">

                {/* 🔹 Special Category Dropdown */}
                <DropDown
                    label="Special Category"
                    name="specialCategory"
                    options={[
                        'General', 'Mu-addin', 'Hazrath',
                        'Father Mother Separated',
                        'Father Expired',
                        'Single Parent', 'Orphan'
                    ]}
                    required
                    setValue={setValue}
                    watch={watch}
                    errors={errors}
                />

                {/* 🔹 Scholarship Radio */}
                <RadioButton
                    name="hasAppliedOtherScholarships"
                    options={['Yes', 'No']}
                    register={register}
                    errors={errors} required
                    label="Have you applied for any other scholarships?"
                />
            </div>
        </>
    )
}

export default SpecialCategory
