import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        const validateToken = async () => {
            try {
                const response = await fetch('http://localhost:4321/auth/validate-token', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, []);

    if (loading) {
        return React.createElement('div', null, 'Loading...');
    }

    return isAuthenticated 
        ? props.element 
        : React.createElement(Navigate, { to: '/' });
};


export default ProtectedRoute;


