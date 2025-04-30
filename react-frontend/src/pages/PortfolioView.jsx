import React, {useEffect, useState} from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import MissingImagePlaceHolder from "../assets/MissingImagePlaceholder.jpg"
import {useParams} from "react-router";
import {useUserContext} from "../components/UserContext.jsx";

function PortfolioView() {

    const { companyID }= useParams();
    const { userID } = useUserContext();
    const [ userData, setUserData] =useState([]);

    useEffect(() => {
        if (userID)
            getPortfolioData();
    }, [userID]);

    useEffect(() => {
        console.log(userData)
    }, [userData]);

    const getPortfolioData = async () => {
        fetch(`http://localhost:5000/get_portfolio?userID=${userID}`)
            .then(res => res.json())
            .then(data => {
                setUserData(data);
            })
            .catch(err => {
                console.error("Error fetching company:", err);
            });
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Lnavbar />

            <div className="flex">

                <div className="w-full px-4 space-y-12">
                    {/* Portfolio Section */}
                    <div className="pt-12">
                        <h2 className="text-3xl font-bold mb-4 text-center">Portfolio</h2>
                        {userData?.portfolio?.length > 0 ? (
                            userData.portfolio.map((fileUrl, idx) => (
                                <div key={`portfolio-${idx}`} className="mb-8 text-center">
                                    {fileUrl.endsWith(".pdf") ? (
                                        <embed
                                            src={fileUrl}
                                            type="application/pdf"
                                            className="w-full h-[600px] rounded shadow"
                                        />
                                    ) : (
                                        <img
                                            src={fileUrl}
                                            alt={`Portfolio ${idx + 1}`}
                                            className="max-w-full max-h-[800px] mx-auto rounded shadow"
                                            onError={(e) => (e.target.src = MissingImagePlaceHolder)}
                                        />
                                    )}

                                    <div className="flex justify-center mt-6">
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-64 text-center bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                                    >
                                        Open in new tab
                                    </a>
                                </div>
                            </div>
                            ))
                            ) : (
                            <p className="text-gray-500 text-center">No portfolio uploaded.</p>
                            )}
                    </div>
                    {/* CV Section */}
                    {/*<div>*/}
                    {/*    <h2 className="text-3xl font-bold mb-4 text-center">CV</h2>*/}
                    {/*    {userData?.CV?.length > 0 ? (*/}
                    {/*        userData.CV.map((fileUrl, idx) => (*/}
                    {/*            <div key={`cv-${idx}`} className="mb-8 text-center">*/}
                    {/*                {fileUrl.endsWith(".pdf") ? (*/}
                    {/*                    <embed*/}
                    {/*                        src={fileUrl}*/}
                    {/*                        type="application/pdf"*/}
                    {/*                        className="w-full h-[600px] rounded shadow"*/}
                    {/*                    />*/}
                    {/*                ) : (*/}
                    {/*                    <img*/}
                    {/*                        src={fileUrl}*/}
                    {/*                        alt={`CV ${idx + 1}`}*/}
                    {/*                        className="max-w-full max-h-[800px] mx-auto rounded shadow"*/}
                    {/*                        onError={(e) => (e.target.src = MissingImagePlaceHolder)}*/}
                    {/*                    />*/}
                    {/*                )}*/}
                    {/*                <a*/}
                    {/*                    href={fileUrl}*/}
                    {/*                    target="_blank"*/}
                    {/*                    rel="noopener noreferrer"*/}
                    {/*                    className="text-blue-600 underline block mt-2"*/}
                    {/*                >*/}
                    {/*                    Open in new tab*/}
                    {/*                </a>*/}
                    {/*            </div>*/}
                    {/*        ))*/}
                    {/*    ) : (*/}
                    {/*        <p className="text-gray-500 text-center">No CV uploaded.</p>*/}
                    {/*    )}*/}
                    {/*</div>*/}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default PortfolioView;
