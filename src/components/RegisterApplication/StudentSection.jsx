import React from 'react';
import DropDown from '../../common/DropDown';
import HeaderTag from '../../common/HeaderTag';
import InputBox from '../../common/InputBox';

function StudentSection({ register, errors, setValue, watch }) {

    return (
        <>
            <HeaderTag label="Student Details" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border border-gray-200 p-6 rounded-xl bg-white shadow-md">
                
                <DropDown
                    name="religion"
                    label="Religion"
                    options={['Islam', 'Hindu', 'Christian', 'Others']}
                    required
                    errors={errors}
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
                />

                <InputBox
                    name="aadharNo"
                    label="Aadhar No."
                    type="text"
                    required
                    register={register}
                    errors={errors}
                />
            </div>
        </>
    )
}

export default StudentSection;