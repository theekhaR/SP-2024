import React, {useEffect, useState} from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import MissingImagePlaceHolder from "../assets/MissingImagePlaceholder.jpg"
import {useParams} from "react-router";
import {useUserContext} from "../components/UserContext.jsx";
import ReactMarkdown from 'react-markdown';

function CareerCompass() {

    const { userID } = useUserContext();
    const [ userData, setUserData] =useState([]);
    const [ userCareer , setUserCareer ] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userID)
            getUserData();
        getUserCareer();
    }, [userID]);

    useEffect(() => {
        console.log(userCareer)
    }, [userCareer]);

    const getUserData = async () => {
        fetch(`http://localhost:5000/get_user_profile?userID=${userID}`)
            .then(res => res.json())
            .then(data => {
                setUserData(data);
            })
            .catch(err => {
                console.error("Error fetching user:", err);
            });
    }

    const getUserCareer = async () => {
        console.log("called getPort")
        fetch(`http://localhost:5000/get_career_path?userID=${userID}`)
            .then(res => res.json())
            .then(data => {
                setUserCareer(data);
            })
            .catch(err => {
                console.error("Error fetching user:", err);
            });
    }


    const handleGenerateNewCareer = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/generate_career_path?userID=${userID}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            if (response.status === 200) {
                alert("Career path generated successfully!");
                getUserCareer(); // refresh career list
            }
        } catch (error) {
            console.error("Error generating career path:", error);
        } finally {
            setLoading(false);
        }
    };


    return (

        <div className="flex flex-col min-h-screen bg-gray-100">

            {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="flex flex-col items-center space-y-4">
                    <svg
                        className="animate-spin h-10 w-10 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                    </svg>
                    <p className="text-white text-lg">Generating career path...</p>
                </div>
            </div>
        )}

            <Lnavbar />

            <div className="flex-grow">

                <div className="w-full px-4 space-y-12">
                    {/* Portfolio Section */}
                    <div className="pt-12">
                        <h2 className="text-3xl font-bold mb-4 text-center">Portfolio</h2>
                        {userData?.portfolio?.length > 0 ? (
                            userData.portfolio.map((fileUrl, idx) => (
                                <div key={`portfolio-${idx}`} className="mb-8 text-center">
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

                    <div className="flex flex-col space-y-2">
                        <h2 className="text-xl font-bold text-gray-800">User Skill</h2>

                        {!userData.portfolioSummary || userData.portfolioSummary.length === 0 ? (
                            <h1 className="text-sm text-center text-gray-500">
                                Upload Portfolio to get the list of skills
                            </h1>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {userData.portfolioSummary.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 text-sm bg-orange-500 text-white rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        {loading ? (
                            <button
                                className="w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed"
                                disabled
                            >
                                Generating career path...
                            </button>
                        ) : (
                            <button
                                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                                onClick={handleGenerateNewCareer}
                            >
                                Generate New Career Compass
                            </button>
                        )}
                    </div>
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Career Compass</h2>
                        {userCareer.length === 0 ? (
                            <p className="text-gray-500">No career paths available. Try generating some!</p>
                        ) : (
                            <ul className="space-y-4">
                                {userCareer.map((career, index) => (
                                    <li key={index} className="bg-white p-4 rounded-lg shadow">
                                        <h3 className="text-lg font-semibold text-orange-600">{career.career_name}</h3>
                                        <div className="prose prose-sm text-gray-700 mt-1">
                                            <ReactMarkdown>
                                                {career.explanation}
                                            </ReactMarkdown>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default CareerCompass;
