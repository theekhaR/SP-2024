import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import { useUserContext } from "../components/UserContext.jsx";

const CompanyContext = createContext();
CompanyContext.propTypes = {children: PropTypes.any};


export function CompanyProvider({ children }) {

    //const { companyID } = useParams();
    const [ companyID, setCompanyID] = useState(null);
    const [ companyInfo, setCompanyInfo] = useState(null);
    const [ companyLogoURL, setCompanyLogoURL ] = useState(null);
    const [ userCompanyData, setUserCompanyData ] = useState(null);
    const [ loadingCompanyContext, setLoadingCompanyContext] = useState(true);

    const { userID } = useUserContext();

    useEffect(() =>{
        console.log("In CompanyContext, companyID updated to "+companyID)
    }, [companyID])

    useEffect( () => {
            const storedCompanyInfo = JSON.parse(localStorage.getItem('companyInfo'));
            const storedSelectedCompany = JSON.parse(localStorage.getItem('selectedCompany'));
            if (!companyID) {
                if (storedCompanyInfo && storedCompanyInfo.companyID === storedSelectedCompany) {
                    setCompanyInfo(storedCompanyInfo);
                    setCompanyID(storedCompanyInfo.companyID);
                    setLoadingCompanyContext(false);
                    return;
                }
            }

            else
            {
                //console.log("Fetch Company From Database "+companyID);
                if (companyID && userID) {
                    fetch(`http://localhost:5000/get_company?companyID=${companyID}`)
                        .then(res => res.json())
                        .then(data => {
                            setCompanyInfo(data);
                            localStorage.setItem('companyInfo', JSON.stringify(data));
                            setLoadingCompanyContext(false);
                        })
                        .catch(err => {
                            console.error("Error fetching company:", err);
                            setLoadingCompanyContext(false);
                        });

                    fetch(`http://localhost:5000/get_user_data_in_company?userID=${userID}&companyID=${companyID}`)
                        .then(res => res.json())
                        .then(data => {
                            setUserCompanyData(data);
                            localStorage.setItem('userCompanyData', JSON.stringify(data));
                            localStorage.setItem('selectedCompany', JSON.stringify(companyID));
                        })
                        .catch(err => {
                            console.error("Error fetching company:", err);
                            setLoadingCompanyContext(false);
                        });
                }}
        }
        , [companyID, userID]);

    // useEffect(() => {
    //     console.log(companyInfo)
    //     console.log(userCompanyData)
    // }, [companyInfo, userCompanyData]);


    // Load profile pic AFTER userID is set
    useEffect(() => {
        const getCompanyLogo = async () => {
            if (!companyID) return;
            const { data: imageList, error } = await supabase.storage
                .from('company-media')
                .list(`${companyID}/logo`, { limit: 1 });

            if (error) {
                console.error("Image fetch error:", error.message);
                return;
            }

            if (imageList.length > 0) {
                const imageName = imageList[0].name;

                if (!imageName || imageName === "placeholder.txt") {
                    console.log("No valid profile pic found.");
                    return;
                }

                const { data } = supabase.storage
                    .from('company-media')
                    .getPublicUrl(`${companyID}/logo/${imageName}`);
                setCompanyLogoURL(data.publicUrl);
            }
        };

        getCompanyLogo();
    }, [companyID]);

    return (
        <CompanyContext.Provider value={{
            companyID,
            setCompanyID,
            companyInfo,
            companyLogoURL,
            userCompanyData,
            loadingCompanyContext
        }}>
            {children}
        </CompanyContext.Provider>
    )
}

export function useCompanyContext(){
    return useContext(CompanyContext)
}
