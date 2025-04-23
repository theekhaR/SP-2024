import React, { useState, useEffect, useRef } from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import Pic from "../assets/Login.png";
import { useUserContext } from "../components/UserContext.jsx";

import { supabase } from "../supabaseClient.jsx";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

function createListing() {
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

  //Use on part skill and benefit
  const [skills, setSkills] = useState([""]);
  const [benifits, setBenifits] = useState([""]);

  const addSkill = () => {
    if (skills.length < 8) setSkills([...skills, ""]);
  };

  const addbenifit = () => {
    if (benifits.length < 8) setBenifits([...benifits, ""]);
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const handleBenifitChange = (index, value) => {
    const newBenifits = [...benitfits];
    newBenifits[index] = value;
    setBenifits(newBenifits);
  };

  useEffect(() => {
    getIndustryList().then(setIndustryList);
  }, []);

  const handleCreateCompany = async (event) => {
    event.preventDefault();
    try {
      if (!companyLogo) {
        alert("Please choose a company logo");
      }
      const response = await fetch(`http://localhost:5000/create_company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: companyName,
          companyAbout: companyAbout,
          companyOverview: companyOverview,
          companyLogoURL: companyLogoURL,
          companyLocation: companyLocation,
          industryID: parseInt(industryID),
          createdBy: userID,
          companySize: companySize,
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

    if (data) {
      setCompanyLogo(null);
      setFileName("No file chosen");
    }
    if (error) {
      alert(error.message);
    }
  }

  const handleClick = (event) => {
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
          Create Listing
        </h2>
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <input
              type="text"
              placeholder="Enter company name"
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Work condition */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Work condition
              </label>
              <select
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={industryID}
                onChange={(e) => setIndustryID(e.target.value)}
              >
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Salary */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Salary
              </label>
              <select className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value={1}>1-10</option>
                <option value={2}>11-50</option>
                <option value={3}>51-100</option>
                <option value={4}>100+</option>
              </select>
            </div>

            {/* Period */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Period
              </label>
              <select className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            {/* Location */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className=" text-sm font-medium text-gray-700 mb-1">
              Job description
            </label>
            <textarea
              rows="3"
              placeholder="Your title, profession or small biography"
              onChange={(e) => setCompanyOverview(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        <div className="mt-3 mb-6 ">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-semibold">
              Skill requirements ({skills.length}/8)
            </h3>
            <button
              type="button"
              onClick={addSkill}
              className="text-orange-600 hover:underline text-sm"
            >
              + Add new
            </button>
          </div>
          {skills.map((skill, index) => (
            <input
              key={index}
              type="text"
              placeholder="What is your skill requirement..."
              value={skill}
              onChange={(e) => handleSkillChange(index, e.target.value)}
              className="w-full px-4 py-2 border rounded-md mt-2"
              maxLength={120}
            />
          ))}
        </div>

        {/* Benifits Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-semibold">
              Benefits ({benifits.length}/8)
            </h3>
            <button
              type="button"
              onClick={addbenifit}
              className="text-orange-600 hover:underline text-sm"
            >
              + Add new
            </button>
          </div>
          {benifits.map((item, index) => (
            <input
              key={index}
              type="text"
              placeholder="What is your Welfare..."
              value={item}
              onChange={(e) => handleBenifitChange(index, e.target.value)}
              className="w-full px-4 py-2 border rounded-md mt-2"
              maxLength={120}
            />
          ))}
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

export default createListing;
