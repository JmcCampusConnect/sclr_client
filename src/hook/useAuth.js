import React, { useState } from 'react';
import { authAPI } from '../services/api';

export const useAuth = () => {

    const [errorData, setErrorData] = useState(null);

    const authData = async (apiUrl, formData) => {

        try {
            const response = await authAPI(apiUrl, formData);
            if (response?.data.status === 200 && response?.data?.token) {
                const { token, user } = response.data;
                console.log(user.role)
                switch (user.role) {
                    case 0:
                        localStorage.setItem('studentToken', token);
                        localStorage.setItem('studentUserId', user.userId);
                        localStorage.setItem('role', user.role);
                        break;
                    case 1:
                        localStorage.setItem('adminToken', token);
                        localStorage.setItem('adminUserId', user.userId);
                        localStorage.setItem('role', user.role);
                        break;
                    case 2:
                        localStorage.setItem('staffToken', token);
                        localStorage.setItem('staffUserId', user.userId);
                        localStorage.setItem('role', user.role);
                        break;
                    default:
                        console.warn('Unknown role :', user.role);
                }
            }
            return response;
        } catch (error) {
            setErrorData(error.response?.data?.message || 'Something went wrong');
            console.error('Error occurred in authentication: ', error);
        }
    }

    return { errorData, authData };
}