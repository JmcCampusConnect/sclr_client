import React from 'react';
import InputBox from '../../common/InputBox';
import DropDown from '../../common/DropDown';
import FileInput from '../../common/FileInput';
import HeaderTag from '../../common/HeaderTag';

function AddressSection({ register, errors, setValue, watch, notRequiredInfo = true, readOnly = false }) {

    return (
        <>
            <HeaderTag label="Address and Other Details" />
            <div className="border border-gray-200 p-6 rounded-xl bg-white shadow-md space-y-6">

                {/* ✅ Address Field */}
                <div className="grid grid-cols-1">
                    <InputBox
                        name="address"
                        label="Permanent Address"
                        type="text"
                        required
                        register={register}
                        errors={errors}
                        readOnly={readOnly}
                    />
                </div>

                {/* ✅ State, District, Pincode */}
                <div className={`grid grid-cols-1 gap-6 ${notRequiredInfo ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                    <DropDown
                        name="state"
                        label="State"
                        options={[
                            'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
                            'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
                            'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh',
                            'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
                            'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim',
                            'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Others'
                        ]}
                        required
                        errors={errors}
                        readOnly={readOnly}
                        setValue={setValue}
                        watch={watch}
                    />

                    <DropDown
                        name="district"
                        label="District"
                        options={[
                            'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
                            'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur',
                            'Krishnagiri', 'Madurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur',
                            'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi',
                            'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur',
                            'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram',
                            'Virudhunagar', 'Others'
                        ]}
                        required
                        errors={errors}
                        readOnly={readOnly}
                        setValue={setValue}
                        watch={watch}
                    />

                    <InputBox
                        name="pinCode"
                        label="Pincode"
                        type="text"
                        required
                        register={register}
                        errors={errors}
                        readOnly={readOnly}
                    />

                    <FileInput
                        name="jamathLetter"
                        label="Jamath / Self Declaration Letter"
                        type="file"
                        required
                        register={register}
                        errors={errors}
                        readOnly={readOnly}
                    />

                    {notRequiredInfo &&
                        <>
                            <InputBox
                                name="password"
                                label="Password"
                                type="password"
                                required
                                register={register}
                                errors={errors}
                                readOnly={readOnly}
                            />

                            <InputBox
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                required
                                register={register}
                                errors={errors}
                                readOnly={readOnly}
                            />
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export default AddressSection