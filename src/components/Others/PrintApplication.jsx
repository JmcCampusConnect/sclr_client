import React, { useRef } from 'react';
import PrintHeader from '../../assets/images/PrintHeader.jpg';

function PrintApplication({ student }) {

    const printRef = useRef();

    const handlePrint = (e) => {
        e.preventDefault();
        const printContent = document.getElementById('print-section').innerHTML;
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
    }

    return (
        <div className=''>
            <style>
                {`@media print {
                        body { margin: 0; -webkit-print-color-adjust: exact; }
                        #print-section { padding: 10px }
                    }
                `}
            </style>
            <hr className='mt-6 border-black' />
            <div className='p-2 border mt-16 w-[730px] mx-auto'>
                <div id="print-section" ref={printRef} className='w-[700px] h-[1130px] p-3'>
                    <div className=''>
                        <img src={PrintHeader} alt="Header" className="w-full h-[110px] object-cover mb-2" />
                    </div>
                    <div className="border border-black rounded-md mx-auto max-w-[700px] p-3 space-y-4 text-sm">
                        <div className="text-center text-xl font-semibold text-gray-800">
                            Scholarship Application ( {student.sclrType} )
                        </div>
                        <div className="text-center text-base font-semibold text-gray-700">
                            Student Details &nbsp;( {student.graduate} - {student.programCategory} )
                        </div>
                        <div className="border border-gray-300 rounded-md p-4 space-y-4 bg-white">
                            <div className="grid grid-cols-1 gap-3">
                                <Detail label="Register No." value={student.registerNo} />
                                <Detail label="Name" value={student.name} /> 
                                <Detail label="Dept / Sem & Section" value={`${student.department} / ${student.semester} Sem - ${student.section} Sec`} />
                                <Detail label="Mobile No." value={student.mobileNo} />
                                <Detail label={student.procategory === 'SFW' ? 'D/o' : 'S/o'} value={`${student.parentName}`} />
                                <Detail label="Address" value={<> {student.address} {student.state} {student.district} {student.pin} </>} />
                                <Detail label="Father's Occupation" value={student.parentOccupation} />
                                <Detail label="Annual Income" value={student.parentAnnualIncome} />
                            </div>
                            {student.siblings === 'Yes' && (
                                <div className="grid grid-cols-3 text-center mt-4 font-semibold bg-gray-100 border border-gray-300 rounded text-md">
                                    <div className="p-2 border-r">No. of Siblings</div>
                                    <div className="p-2 border-r">Siblings' Occupation</div>
                                    <div className="p-2">Family Annual Income</div>
                                    <div className="p-2 font-semibold border-t border-r border-gray-300">{student.siblingsCount}</div>
                                    <div className="p-2 font-semibold border-t border-r border-gray-300">{student.siblingsOccupation}</div>
                                    <div className="p-2 font-semibold border-t border-r border-gray-300">{student.siblingsIncome}</div>
                                </div>
                            )}
                            <div className="grid grid-cols-3 text-center mt-4 font-semibold bg-gray-100 border border-gray-300 rounded text-md">
                                <div className="p-2 border-r border-gray-300">Hostel</div>
                                <div className="p-2 border-r border-gray-300">Special Category</div>
                                <div className="p-2">Religion</div>
                                <div className="p-2 font-semibold border-t border-r border-gray-300">{student.hostelStatus}</div>
                                <div className="p-2 font-semibold border-t border-r border-gray-300 uppercase">{student.specialCategory}</div>
                                <div className="p-2 font-semibold border-t border-r border-gray-300">{student.religion}</div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-base text-md font-semibold text-gray-700 mt-2 mb-2">Education Details</h3>
                            <div className="border border-gray-300 rounded-md bg-white p-3 space-y-3 text-md">
                                <div className="grid md:grid-cols-2 gap-2">
                                    {student.semester === 'I' ? (
                                        <LabeledBox label="Percentage of Mark %" value={student.percentageOfMarkSchool === -1 ? '-' : student.percentageOfMarkSchool} />
                                    ) : (
                                        <LabeledBox label="Percentage of Mark %" value={student.semPercentage === -1 ? '-' : student.semPercentage} />
                                    )}
                                    <LabeledBox label="Class Attendance %" value={student.classAttendancePer === -1 ? '-' : student.classAttendancePer} />
                                    <LabeledBox label="Deeniyath / Moral %" value={student.deeniyathPer === -1 ? '-' : student.deeniyathPer} />
                                    {student.arrear !== 0 && (<LabeledBox label="No. of Arrears" value={student.arrear} />)}
                                    {student.fresherOrRenewal === 'Renewal' && (
                                        <LabeledBox label="Last Time Credited Amount" value={student.lastCreditedAmt || '-'} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex justify-end mt-6'>
                <button
                    type='button'
                    onClick={handlePrint}
                    className="bg-blue-500 text-white px-10 py-2 text-lg rounded hover:bg-blue-600"
                >
                    Print
                </button>
            </div>
        </div>
    )
}

const Detail = ({ label, value }) => (
    <div className="grid grid-cols-[180px_10px_1fr] items-start">
        <div className="p-1 font-medium text-[14px] text-gray-700">{label}</div><div className="p-1">:</div>
        <div className="font-semibold uppercase ml-3 px-2 text-gray-800 border-gray-200 border p-1 rounded bg-white leading-tight text-[14px]"> {value} </div>
    </div>
)

const LabeledBox = ({ label, value }) => (
    <div className="flex justify-between border border-gray-300 rounded p-1 text-md bg-white">
        <span className="font-medium text-gray-700 px-2 py-0.5">{label}</span>
        <span className="font-semibold text-gray-800">{value}</span>
    </div>
)

export default PrintApplication;