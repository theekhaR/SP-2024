import React, {useEffect, useState} from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import MissingImagePlaceHolder from "../assets/MissingImagePlaceholder.jpg"
import {useParams} from "react-router";
import {useUserContext} from "../components/UserContext.jsx";

function CompanyProfileUser() {

    const { companyID }= useParams();
    const { userID } = useUserContext();
    const [ companyInfo, setCompanyInfo] =useState([]);

    useEffect(() => {
        if (companyID && userID)
            getCompanyData();
    }, [companyID]);

    const getCompanyData = async () => {
        fetch(`http://localhost:5000/get_company?companyID=${companyID}`)
            .then(res => res.json())
            .then(data => {
                setCompanyInfo(data);
                localStorage.setItem('companyInfo', JSON.stringify(data));
            })
            .catch(err => {
                console.error("Error fetching company:", err);
            });
    }

    async function handleFollow() {
        try {
            const response = await fetch(
                `http://localhost:5000/add_user_following`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "userID": userID,
                        "companyID": companyID
                    })
                }
            );
            if (response.status === 201) {
                alert("Followed the company")
                return ;
            }
            // Unexpected error
            const data = await response.json();
            alert(data.error);
            return [];
        } catch (error) {
            console.error("Error checking user:", error);
            return [];
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Lnavbar />

            <div className="flex">

                <div className="flex-1 p-8">
                    {/* Banner */}
                    {/*<div className="relative w-full h-64 mb-10 rounded-lg overflow-hidden shadow">*/}
                    {/*  <img src={BannerImg} alt="Company Banner" className="w-full h-full object-cover" />*/}
                    {/*</div>*/}

                    {/* Company Info Card */}
                    <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col space-y-6">
                        {/* Top: Logo + Info + Button */}
                        <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-6">
                            {/* Logo + Text Info */}
                            <div className="flex gap-6">
                                <img src={companyInfo.companyLogoURL || MissingImagePlaceHolder} alt="Company Logo" className="w-24 h-24 object-contain" />
                                <div className="text-gray-700 text-sm space-y-1">
                                    <h2 className="text-xl font-bold text-blue-800">{companyInfo.companyName}</h2>

                                    {companyInfo.companyLocation && (<p><strong>Company Location:</strong> {companyInfo.companyLocation}</p>)}

                                    {companyInfo.companySize && (<p><strong>Company Size:</strong> {companyInfo.companySize}</p>)}

                                    {companyInfo.companyEmail && (<p><strong>Email:</strong> {companyInfo.companyEmail}</p>)}

                                    {companyInfo.companyPhone && (<p><strong>Phone:</strong> {companyInfo.companyPhone}</p>)}
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-x-8 text-sm text-gray-700">
                                <div>
                                    {companyInfo.industryName && (<p><strong>Industry:</strong> {companyInfo.industryName}</p>)}
                                    {companyInfo.companyWebsite && (
                                        <a>
                                            <strong>Website: </strong>
                                            <a href={companyInfo.companyWebsite.startsWith('http') ? companyInfo.companyWebsite : `https://${companyInfo.companyWebsite}`}
                                               className="text-blue-600 underline">
                                                {companyInfo.companyWebsite}
                                            </a>
                                        </a>
                                    )}
                                </div>
                                {/*<div>*/}
                                {/*  <p>*/}
                                {/*    <a href="http://www.google.com" className="text-blue-600 underline">*/}
                                {/*      www.google.com*/}
                                {/*    </a>*/}
                                {/*  </p>*/}
                                {/*</div>*/}
                            </div>
                        </div>

                        <hr />

                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex space-x-12 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">8</div>
                                    <div className="text-sm text-gray-500">Opening Position</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">23,408</div>
                                    <div className="text-sm text-gray-500">Followers</div>
                                </div>
                            </div>



                            {/*  ------------------ BUTTON ------------------------- */}
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md"
                            onClick={handleFollow}>
                                Follow
                            </button>
                        </div>
                    </div>

                    {/* change to follow :
          เปลี่ยนเป็นสีเขียว
                 <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md">
                Edit
              </button>
            </div>
          </div>

        {/* -------------------------------------------------------- */}

                    {/* About Us Section */}
                    <div className="bg-white rounded-lg shadow-lg mt-10 p-20 space-y-20">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">About Us</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {companyInfo.companyAbout}
                            </p>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Details</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {companyInfo.companyOverview}
                            </p>
                        </div>

                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
}

export default CompanyProfileUser;
