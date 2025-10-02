import React, { useState } from 'react';
import { fetDataAPI } from '../api/crudApi';


export const useFetch = () => {

    const [fetchError, setFetchError] = useState(null);

    const fetchData = async (apiUrl, formData) => {
        try {
            const response = await fetDataAPI(apiUrl, formData)
            return response;
        } catch (error) {
            setFetchError(error?.message || 'Error occured')
            console.log('Error occured in Fetch Data : ', error)
        }
    }
    return { fetchError, fetchData }
}