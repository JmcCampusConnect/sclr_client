import React from 'react'
import InputBox from '../../common/InputBox'
import DropDown from '../../common/DropDown'
import FileInput from '../../common/FileInput'

function AddressSection() {

    return (
        <div className="border border-black p-6 rounded-lg bg-gray-50 shadow-md space-y-6">
            <div className="grid grid-cols-1">
                <InputBox
                    name='address'
                    label='Permanent Address'
                    type='text'
                    placeholder='Door No and Street Name'
                    required
                />
            </div>
            <div className="grid grid-cols-3 gap-6">
                <DropDown
                    name='state'
                    label='State'
                    options={['Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
                        'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
                        'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh',
                        'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
                        'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim',
                        'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Other']}
                    required
                />
                <DropDown
                    name='district'
                    label='District'
                    options={['Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
                        'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur',
                        'Krishnagiri', 'Madurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur',
                        'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi',
                        'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur',
                        'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram',
                        'Virudhunagar', 'Other']}
                    required
                />
                <InputBox
                    name='pinCode'
                    label='Pincode'
                    type='text'
                    placeholder='Pincode'
                    required
                />
                <FileInput
                    name='jamathLetter'
                    label='Jamath / Self Declaration Letter'
                    type='file'
                    required
                />
                <InputBox
                    name='password'
                    label='Password'
                    type='password'
                    required
                />
                <InputBox
                    type='password'
                    name='confirmPassword'
                    label='Confirm Password'
                    required
                />
            </div>
        </div>
    )
}

export default AddressSection