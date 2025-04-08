import React, { useEffect, useState } from "react";
import { supabase } from '../supabaseClient';
import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

function ProtectedRouteWrapper({ children }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    ProtectedRouteWrapper.propTypes = {children: PropTypes.any}; //Has to be here otherwise propTypes error
    // https://www.geeksforgeeks.org/reactjs-proptypes/

    useEffect(() => {
        const getSession = async () => {
            const {
                data: {session},
            } = await supabase.auth.getSession();

            setAuthenticated(!!session); //convert session into boolean value
            setLoading(false);
        };

        getSession();
    }, []);

    if (loading) {
        return <div>Loading...</div>
    }
    else {
        if (authenticated) {
            return <>{children}</>
        }
        return <Navigate to="/Login"/>;
    }
}

export default ProtectedRouteWrapper;