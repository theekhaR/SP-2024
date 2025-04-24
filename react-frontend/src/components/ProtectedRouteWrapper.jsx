import React, { useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useUserContext } from "./UserContext.jsx";

function ProtectedRouteWrapper({ children }) {
  // const [authenticated, setAuthenticated] = useState(false);
  // const [loading, setLoading] = useState(true);
  ProtectedRouteWrapper.propTypes = { children: PropTypes.any }; //Has to be here otherwise propTypes error
  // https://www.geeksforgeeks.org/reactjs-proptypes/

  const { loading, authenticated } = useUserContext();

  useEffect(() => {
    console.log("reached wrapper");
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    if (authenticated) {
      return <>{children}</>;
    }
    return <Navigate to="/Login" />;
  }
}

export default ProtectedRouteWrapper;
