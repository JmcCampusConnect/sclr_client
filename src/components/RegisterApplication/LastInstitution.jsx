import React, { useEffect } from 'react'
import HeaderTag from '../../common/HeaderTag';
import InputBox from '../../common/InputBox';

function LastInstitution({ register, errors, watch, setValue }) {

    const graduate = watch("graduate");
    const semester = watch("semester");
    const marksSecured = watch("marksSecured");
    const maxMarks = watch("maxMarks");

    useEffect(() => {
        if (marksSecured && maxMarks && !isNaN(marksSecured) && !isNaN(maxMarks)) {
            const percentage = ((Number(marksSecured) / Number(maxMarks)) * 100).toFixed(2);
            setValue("lastStudiedInstitutionPercentage", percentage);
        } else { setValue("lastStudiedInstitutionPercentage", "") }
    }, [marksSecured, maxMarks, setValue]);

    return (
        <>
            {semester === "I" && (graduate === "UG" || graduate === "PG") && (
                <>
                    <HeaderTag label='Education Details' />
                    <div className="grid grid-cols-1 gap-6 border border-black p-6 rounded-lg bg-gray-50 shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputBox
                                type='text'
                                name='lastStudiedInstitution'
                                label={graduate === 'UG' ? 'Last School Name' : 'Last College Name'}
                                required
                                register={register}
                                errors={errors}
                            />
                            <InputBox
                                type='text'
                                name='yearOfPassing'
                                label='Year of Passing'
                                required
                                register={register}
                                errors={errors}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputBox
                                type='text'
                                name='marksSecured'
                                label={`Maximum Secured ${graduate === 'UG' ? '' : '( Part III Only )'}`}
                                required
                                register={register}
                                errors={errors}
                            />
                            <InputBox
                                type='text'
                                name='maxMarks'
                                label={`Maximum Marks ${graduate === 'UG' ? '' : '( Part III Only )'}`}
                                required
                                register={register}
                                errors={errors}
                            />
                            <InputBox
                                type='text'
                                name='lastStudiedInstitutionPercentage'
                                label='Percentage'
                                required
                                readOnly
                                register={register}
                                errors={errors}
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default LastInstitution