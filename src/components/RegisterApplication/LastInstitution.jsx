import React, { useContext } from 'react'
import HeaderTag from '../../common/HeaderTag';
import InputBox from '../../common/InputBox';

function LastInstitution() {

    return (
        <>
            {/* {semester === "I" && (graduate === "UG" || graduate === "PG") && ( */}
                <>
                    <HeaderTag label='Education Details' />
                    <div className="grid grid-cols-1 gap-6 border border-black p-6 rounded-lg bg-gray-50 shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputBox
                                type='text'
                                name='lastStudiedInstitution'
                                // label={graduate === 'UG' ? 'Last School Name' : 'Last College Name'}
                                required
                            />
                            <InputBox
                                type='text'
                                name='yearOfPassing'
                                label='Year of Passing'
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputBox
                                type='text'
                                name='marksSecured'
                                // label={`Maximum Secured ${graduate === 'UG' ? '' : '( Part III Only )'}`}
                                required
                            />
                            <InputBox
                                type='text'
                                name='maxMarks'
                                // label={`Maximum Marks ${graduate === 'UG' ? '' : '( Part III Only )'}`}
                                required
                            />
                            <InputBox
                                type='text'
                                name='lastStudiedInstitutionPercentage'
                                label='Percentage'
                                required
                                readOnly
                            />
                        </div>
                    </div>
                </>
            {/* )} */}
        </>
    )
}

export default LastInstitution