import React, { useContext } from 'react'
import InputBox from '../../common/InputBox';
import RadioButton from '../../common/RadioButton';

function ParentSection({ register, errors, watch }) {

    const siblingsStatus = watch("siblingsStatus")

    return (
        <div className="border border-black p-6 rounded-lg bg-gray-50 shadow-md space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputBox
                    name='parentName'
                    label='Parent / Guardian Name'
                    type='text'
                    required
                    register={register}
                    errors={errors}
                />
                <InputBox
                    name='parentNo'
                    label='Parent / Guardian No.'
                    type='text'
                    required
                    register={register}
                    errors={errors}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputBox
                    name='parentOccupation'
                    label='Parent Occupation'
                    type='text'
                    placeholder='e.g. : Daily Wages'
                    required
                    register={register}
                    errors={errors}
                />
                <InputBox
                    name='parentAnnualIncome'
                    label='Parent Annual Income'
                    type='text'
                    placeholder='e.g. : 10000'
                    required
                    register={register}
                    errors={errors}
                />
                <RadioButton
                    name='siblingsStatus'
                    label='Siblings'
                    options={['Yes', 'No']}
                    required
                    register={register}
                    errors={errors}
                />
                {siblingsStatus === 'Yes' && (
                    <>
                        <InputBox
                            name='siblingsCount'
                            label='No. of Siblings'
                            type='text'
                            placeholder='e.g. : 2'
                            required
                            register={register}
                            errors={errors}
                        />
                        <InputBox
                            name='siblingsOccupation'
                            label={`Siblings Occupation`}
                            type='text'
                            placeholder='e.g. : Student Employee'
                            required
                            register={register}
                            errors={errors}
                        />
                        <InputBox
                            name='siblingsIncome'
                            label='Siblings Annual Income'
                            type='text'
                            required
                            register={register}
                            errors={errors}
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default ParentSection