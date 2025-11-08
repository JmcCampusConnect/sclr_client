import React from 'react';
import DropDown from '../../common/DropDown';
import HeaderTag from '../../common/HeaderTag';
import InputBox from '../../common/InputBox';

function StudentSection({ register, errors, setValue, watch, addtionalInfo, readOnly = false, sclrType, lastYearCreditedAmount = 0 }) {

    return (
        <>
            <HeaderTag label="Student Details" />

            <div className={`grid grid-cols-1 gap-6 border border-gray-200 p-6 rounded-xl bg-white shadow-md ${addtionalInfo && sclrType === 'Renewal' ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>

                <DropDown
                    name="religion"
                    label="Religion"
                    options={['Islam', 'Hindu', 'Christian', 'Others']}
                    required
                    errors={errors}
                    readOnly={readOnly}
                    setValue={setValue}
                    watch={watch}
                />

                <InputBox
                    name="mobileNo"
                    label="Mobile No."
                    type="text"
                    required
                    register={register}
                    errors={errors}
                    readOnly={readOnly}
                />

                <InputBox
                    name="aadharNo"
                    label="Aadhar No."
                    type="text"
                    required
                    register={register}
                    errors={errors}
                    readOnly={readOnly}
                />

                {addtionalInfo && sclrType === 'Renewal'  && (
                    <InputBox
                        name="lastYearCreditedAmount"
                        label="Last Year Credited Amount"
                        type="text"
                        required
                        register={register}
                        errors={errors}
                        readOnly={true}
                    />
                )}

            </div>
        </>
    )
}

export default StudentSection;