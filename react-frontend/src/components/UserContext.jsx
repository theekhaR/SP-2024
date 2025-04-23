import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import {Navigate} from "react-router-dom";
import PropTypes from 'prop-types';

const UserContext = createContext();

export function UserProvider({ children }) {

    UserProvider.propTypes = {children: PropTypes.any};

    const [userID, setUserID] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userFullname, setUserFullname] = useState(null);
    const [userProfilePicURL, setUserProfilePicUrl] = useState(null)
    const [profileExistBoolean, setProfileExistBoolean] = useState(false);

    const [session, setSession] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); //To check if supabase is loading or not

    useEffect( () => {

            const initiateUserContext = async () => {
                const {
                    data: {session},
                } = await supabase.auth.getSession();
                setSession(session)

                if (session?.user) {
                    const user = session.user;
                    setUserID(user.id);
                    setUserEmail(user.email);
                    //setUserFullname(user.user_metadata.) DOES NOT WORK ATM
                }
                setAuthenticated(!!session); //convert session into boolean value
                setLoading(false);
                //getCurrentProfilePic();
            }

            initiateUserContext();

            const {data: authListener} = supabase.auth.onAuthStateChange((event, session) => {
                    if (session?.user) {
                        initiateUserContext();
                    } else {
                        console.log("Auth Changed")
                        // Reset on logout
                        setUserID(null);
                        setUserEmail(null);
                        //setFullName(null);
                        setUserProfilePicUrl(null);
                    }
                }
            )
        }

        , []);

    // Load profile pic AFTER userID is set
    useEffect(() => {
        const getCurrentProfilePic = async () => {
            if (!userID) return;

            //console.log("Fetching profile pic for user:", userID);
            const { data: imageList, error } = await supabase.storage
                .from('user-profile-image')
                .list(`${userID}/`, { limit: 1 });

            if (error) {
                console.error("Image fetch error:", error.message);
                return;
            }

            if (imageList.length > 0) {
                const imageName = imageList[0].name;

                if (!imageName || imageName === "placeholder.txt") {
                    console.log("No valid profile pic found.");
                    setProfileExistBoolean(false);
                    return;
                }

                const { data } = supabase.storage
                    .from('user-profile-image')
                    .getPublicUrl(`${userID}/${imageName}`);

                //console.log("Setting profile pic URL:", data.publicUrl);
                setUserProfilePicUrl(data.publicUrl);
                setProfileExistBoolean(true);
            }
        };

        getCurrentProfilePic();
    }, [userID]);

    return (
        <UserContext.Provider value={{
            userID,
            userEmail,
            userFullname,
            userProfilePicURL,
            setUserProfilePicUrl,
            session,
            authenticated,
            loading
        }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUserContext(){
    return useContext(UserContext)
}
