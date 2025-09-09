import React, { useState } from 'react';
import { addDataAPI } from '../services/api';

export const useAdd = () => {

    const [addError, setAddError] = useState(null);

    const addData = async (apiUrl, formData) => {
        // console.log('Add Hook apiUrl : ', apiUrl)
        // console.log('Add Hook formData : ', formData)
        try {
            const response = await addDataAPI(apiUrl, formData)
            // console.log('Response from addDataApi in Add Hook : ', response)
            return response;
        } catch (error) {
            setAddError(error?.message || 'Error occured')
            console.log('Error occured in Adding Data : ', error)
        }
    }
    return { addError, addData }
}