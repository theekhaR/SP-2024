import React, { useState, useEffect, useRef } from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import Pic from "../assets/Login.png";
import { useUserContext } from "../components/UserContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../supabaseClient.jsx";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

function CreateCompany() {

  const { userID } = useUserContext();

  const [companyID, setCompanyID] = useState();
  const [companyName, setCompanyName] = useState();
  const [companyAbout, setCompanyAbout] = useState();
  const [companyOverview, setCompanyOverview] = useState();
  const [companyLogoURL, setCompanyLogoURL] = useState();
  const [companyLocation, setCompanyLocation] = useState();
  const [industryID, setIndustryID] = useState("");
  const [companySize, setCompanySize] = useState();
  const [companyLogo, setCompanyLogo] = useState();

  const [industryList, setIndustryList] = useState([]);

  const hiddenFileInput = useRef(null);
  const [fileName, setFileName] = useState("None");

  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getIndustryList().then(setIndustryList);
  }, []);

  const handleCreateCompany = async (event) => {
    event.preventDefault();
    try {
                if (!companyLogo){
                  alert("Please choose a company logo")
                }
                const response = await fetch(`http://localhost:5000/create_company`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      companyName: companyName,
                      companyAbout: companyAbout,
                      companyOverview: companyOverview,
                      companyLogoURL: companyLogoURL,
                      companyLocation: companyLocation,
                      industryID: parseInt(industryID),
                      createdBy: userID,
                      companySize: companySize
                    }),
                });

                if (response.status === 500) {
                    const data = await response.json();
                    alert(data.error);
                }

      if (response.status === 201) {
        const data = await response.json();
        setCompanyID(data.companyID);
        await uploadCompanyLogo(data.companyID); //we need to pass in the companyID manually because
        //setCompanyID won't update companyID until code is finished, so it will be null when we call the func
        console.log("Company Created");
        navigate(`/company`);
      }
    } catch (error) {
      console.error("Error encountered:", error);
    }
  };

  async function getIndustryList() {
    try {
      const response = await fetch(`http://localhost:5000/get_all_industries`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();

        // Map raw data to desired format
        const industries = data.map((industry, index) => ({
          id: industry.industryID,
          name: industry.industryName,
        }));

        console.log("Industries:", industries);
        return industries;
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

  async function uploadCompanyLogo(companyIDforUpload) {
    const { data, error } = await supabase.storage
      .from("company-media")
      .upload(companyIDforUpload + "/logo/" + uuidv4(), companyLogo);

    if (data){
      setCompanyLogo(null);
      setFileName("No file chosen");
    }
    if (error) {
      alert(error.message);
    }
  }

  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  // to handle the user-selected file
  async function handleChange(e) {
    const fileUploaded = e.target.files[0];
    if (fileUploaded) {
      setFileName(fileUploaded.name); // Update the span text with file name
      setCompanyLogo(e.target.files[0]);
      setCompanyLogoPreview(URL.createObjectURL(fileUploaded));
    } else {
      setFileName("No file chosen"); // Reset if no file is selected
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Lnavbar />
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md mt-12">
        <h2 className="text-xl font-bold text-orange-500  mb-6">
          Create New Company
        </h2>

        {/* Put form on this pls when to do a real submit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT: Form Section */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                placeholder="Enter company name"
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <select
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={industryID}
                onChange={(e) => setIndustryID(e.target.value)}
              >
                {industryList.map((industry) => (
                    <option key={industry.id} value={industry.id}>
                      {industry.name}
                    </option>
                ))}
              </select>

              <label className="text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <select className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value={1}>1-10</option>
                <option value={2}>11-50</option>
                <option value={3}>51-100</option>
                <option value={4}>100+</option>
                {/* Add more options as needed */}
              </select>
            </div>

            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="Location"
                onChange={(e) => setCompanyLocation(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1">
                About
              </label>
              <input
                type="text"
                placeholder="About"
                onChange={(e) => setCompanyAbout(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1">
                Overview
              </label>
              <textarea
                rows="3"
                placeholder="Your title, profession or small biography"
                onChange={(e) => setCompanyOverview(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          {/* RIGHT: Image Upload */}
          <div className="flex flex-col items-center text-center bg-gray-100 px-4 py-4 md:p-4 rounded-md space-y-2">
            <img
                src={companyLogoPreview || Pic}
                alt="Company Logo"
                className="w-6/12 h-6/12 object-cover rounded-md mt-16 mb-12"
            />

            <input
              type="file"
              className="hidden"
              id="upload"
              ref={hiddenFileInput}
              onChange={(e) => handleChange(e)}
            />
            <label
              htmlFor="upload"
              className="px-3 py-1 text-white bg-slate-600 hover:bg-gray-800  rounded-md transition"
              onClick={handleClick}
            >
              Choose Your Company Logo
            </label>
            <span id="file-chosen" className="text-gray-600">{fileName}</span>
              {/*{*/}
              {/*  bool?*/}
              {/*      (*/}
              {/*          <label*/}
              {/*              //htmlFor="upload-photo"*/}
              {/*              className="mt-14 text-sm text-white bg-orange-500 hover:bg-gray-800 px-4 py-2 rounded"*/}
              {/*              onClick={}*/}
              {/*          >*/}
              {/*            Upload Photo*/}
              {/*          </label>*/}
              {/*      ) : (*/}
              {/*          <label*/}
              {/*              //htmlFor="upload-photo"*/}
              {/*              className="mt-14 text-sm text-white bg-orange-500 hover:bg-gray-800 px-4 py-2 rounded"*/}
              {/*          >*/}
              {/*            No Image To Upload*/}
              {/*          </label>*/}
              {/*      )*/}

          </div>
        </div>

        <h2 className="text-xl font-bold text-orange-500 mt-6 mb-3">
          Company social profile
        </h2>

        <div className="mb-3">
          <label className=" text-sm font-medium text-gray-700 mb-1">
            Company website
          </label>
          <div className="flex items-center border rounded-md overflow-hidden w-full focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
            <div className="px-4">
              <FontAwesomeIcon
                icon={faGlobe}
                className="text-orange-500 text-lg"
              />
            </div>

            <div className="h-6 w-px bg-gray-200 mr-2" />
            <input
              type="text"
              placeholder="Website"
              className="w-full px-4 py-2 border placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              LinkedIn
            </label>

            <div className="flex items-center border rounded-md overflow-hidden w-full max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
              <div className="px-4">
                <FontAwesomeIcon
                  icon={faLinkedinIn}
                  className="text-orange-500 text-lg"
                />
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-200 mr-2" />

              <input
                type="text"
                placeholder="LinkedIn url"
                className="flex-1 py-2 pr-4 text-gray-500 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Facebook
            </label>

            <div className="flex items-center border rounded-md overflow-hidden w-full max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
              <div className="px-4">
                <FontAwesomeIcon
                  icon={faFacebookF}
                  className="text-orange-500 text-lg"
                />
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-200 mr-2" />

              <input
                type="text"
                placeholder="Facebook url"
                className="flex-1 py-2 pr-4 text-gray-500 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Instragram
            </label>

            <div className="flex items-center border rounded-md overflow-hidden w-full max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
              <div className="px-4">
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="text-orange-500 text-lg"
                />
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-200 mr-2" />

              <input
                type="text"
                placeholder="Instagram url"
                className="flex-1 py-2 pr-4 text-gray-500 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Youtube
            </label>

            <div className="flex items-center border rounded-md overflow-hidden w-full max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
              <div className="px-4">
                <FontAwesomeIcon
                  icon={faYoutube}
                  className="text-orange-500 text-lg"
                />
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-200 mr-2" />

              <input
                type="text"
                placeholder="Youtube url"
                className="flex-1 py-2 pr-4 text-gray-500 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Tiktok
            </label>

            <div className="flex items-center border rounded-md overflow-hidden w-full max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
              <div className="px-4">
                <FontAwesomeIcon
                  icon={faTiktok}
                  className="text-orange-500 text-lg"
                />
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-200 mr-2" />

              <input
                type="text"
                placeholder="Tiktok url"
                className="flex-1 py-2 pr-4 text-gray-500 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-800 mr-4"
            onClick={handleCreateCompany}
          >
            <a href="/Company" className="text-white">
              Save Change
            </a>
          </button>
          <button className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-800 ">
            <a href="/Company" className="text-white">
              Cancel
            </a>
          </button>
        </div>
        {/* End the form this line */}
      </div>
      <Footer />
    </div>
  );
}

export default CreateCompany;
