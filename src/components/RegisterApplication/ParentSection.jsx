import React, { useContext } from 'react'
import InputBox from '../../common/InputBox';
import RadioButton from '../../common/RadioButton';

function ParentSection({ register, errors, watch, readOnly = false }) {

    const siblingsStatus = watch("siblingsStatus")

    return (
        <div className="border border-gray-200 p-6 rounded-xl bg-white shadow-md space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputBox
                    name='parentName'
                    label='Parent / Guardian Name'
                    type='text'
                    required
                    register={register}
                    errors={errors}
                    readOnly={readOnly}
                />
                <InputBox
                    name='parentNo'
                    label='Parent / Guardian No.'
                    type='text'
                    required
                    register={register}
                    errors={errors}
                    readOnly={readOnly}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputBox
                    name='parentOccupation'
                    label='Parent Occupation'
                    type='text'
                    required
                    register={register}
                    errors={errors}
                    readOnly={readOnly}
                />
                <InputBox
                    name='parentAnnualIncome'
                    label='Parent Annual Income'
                    type='text'
                    required
                    register={register}
                    errors={errors}
                    readOnly={readOnly}
                />
                <RadioButton
                    name='siblingsStatus'
                    label='Siblings'
                    options={['Yes', 'No']}
                    required
                    register={register}
                    errors={errors}
                    readOnly={readOnly}
                />
                {siblingsStatus === 'Yes' && (
                    <>
                        <InputBox
                            name='siblingsCount'
                            label='No. of Siblings'
                            type='text'
                            required
                            register={register}
                            errors={errors}
                            readOnly={readOnly}
                        />
                        <InputBox
                            name='siblingsOccupation'
                            label={`Siblings Occupation`}
                            type='text'
                            required
                            register={register}
                            errors={errors}
                            readOnly={readOnly}
                        />
                        <InputBox
                            name='siblingsIncome'
                            label='Siblings Annual Income'
                            type='text'
                            required
                            register={register}
                            errors={errors}
                            readOnly={readOnly}
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default ParentSection