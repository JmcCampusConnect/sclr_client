import React, { useState } from 'react';
import { addDataAPI } from '../api/crudApi';

export const useAdd = () => {

    const [addError, setAddError] = useState(null);

    const addData = async (apiUrl, formData) => {
        try {
            const response = await addDataAPI(apiUrl, formData)
            return response;
        } catch (error) {
            setAddError(error?.message || 'Error occured')
            console.log('Error occured in Adding Data : ', error)
        }
    }
    return { addError, addData }
}