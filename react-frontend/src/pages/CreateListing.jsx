import React, { useState, useEffect, useRef } from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import Pic from "../assets/Login.png";
import { useUserContext } from "../components/UserContext.jsx";

import { supabase } from "../supabaseClient.jsx";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useCompanyContext } from "../components/CompanyContext.jsx";

function CreateListing() {
  const { userID } = useUserContext();
  const { companyID, companyInfo, companyLogoURL, userCompanyData, loadingCompanyContext } = useCompanyContext();

  const [ editPosition, setEditPosition ] = useState();
  const [ editWorkType, setEditWorkType ] = useState();
  const [ editWorkCondition, setEditWorkCondition ] = useState();
  const [ editRoleDescription, setEditRoleDescription] = useState();
  const [ editDetail, setEditDetail ] = useState();
  const [ editQualification, setEditQualification ] = useState();
  const [ editAffectiveUntil, setAffectiveUntil ] = useState();
  const [ editAffectiveHours, setAffectiveHours ] = useState();
  const [ editAffectiveMinute, setAffectiveMinute ] = useState();
  const [ editAffectiveDay, setAffectiveDay ] = useState();
  const [ editAffectiveMonth, setAffectiveMonth ] = useState();
  const [ editAffectiveYear, setAffectiveYear ] = useState();
  const [ editSalary, setEditSalary ] = useState();
  const [ editExperience, setEditExperience ] = useState();

  const [industryList, setIndustryList] = useState([]);

  const hiddenFileInput = useRef(null);
  const [fileName, setFileName] = useState("None");

  const navigate = useNavigate();

  //Use on part skill and benefit
  const [qualification, setQualification] = useState([""]);

  const addQualification = () => {
    if (qualification.length < 10) setQualification([...qualification, ""]);
  };

  const handleQualificationChange = (index, value) => {
    const newQualification = [...qualification];
    newQualification[index] = value;
    setQualification(newQualification);
  };


  const handleCreateListing = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/create_listing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "createdBy": userID,
          "companyID": companyID,
          "position": editPosition,
          "workType": editWorkType,
          "workCondition": editWorkCondition,
          "roleDescription": editRoleDescription,
          "detail": editDetail,
          "qualification": qualification,
          "salary": editSalary,
          "experience": editExperience,
          "affectiveUntil": editAffectiveUntil
        }),
      });

      if (response.status === 201) {
        console.log("Listing Created");
        navigate(`/companylisting`);
      }
      const data = await response.json();
      alert(data.error);
    } catch (error) {
      console.error("Error encountered:", error);
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 ">
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
                  placeholder="Offering Position"
                  onChange={(e) => setEditPosition(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Location */}
            {/*<div>*/}
            {/*  <label className=" text-sm font-medium text-gray-700 mb-1">*/}
            {/*    Location*/}
            {/*  </label>*/}
            {/*  <input*/}
            {/*    type="text"*/}
            {/*    placeholder="Enter your location"*/}
            {/*    onChange={(e) => setEditLocation(e.target.value)}*/}
            {/*    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
            {/*  />*/}
            {/*</div>*/}


            <div className="grid grid-cols-2 gap-6">
              {/* Work type */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Work type
                </label>
                <select
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editWorkType}
                    onChange={(e) => setEditWorkType(e.target.value)}
                >
                  <option value="Fulltime">Full-Time</option>
                  <option value="Parttime">Part-Time</option>
                  <option value="Contact">Per Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Academic Assistantship">Academic Assistantship</option>
                </select>
              </div>

              {/* Salary */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <input
                    type="text"
                    placeholder="Enter Salary"
                    onChange={(e) => setEditSalary(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Work condition */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Work condition
                </label>
                <select
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editWorkCondition}
                    onChange={(e) => setEditWorkCondition(e.target.value)}
                >
                  <option value="onsite">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {/* Experience */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <select
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editExperience}
                    onChange={(e) => setEditExperience(e.target.value)}
                >
                  <option value="Not Required">Not Required</option>
                  <option value="1 - 2 years">1 - 2 years</option>
                  <option value="2 - 5 years">3 - 5 years</option>
                  <option value="5 - 10 years">6 - 10 years</option>
                  <option value="10 years or above">10 years or above</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <label className=" text-sm font-medium text-gray-700 mb-1">
                Listing Affective Until
              </label>
              {/*<input*/}
              {/*    type="datetime-local"*/}
              {/*    value={editAffectiveUntil}*/}
              {/*    onChange={(e) => setAffectiveUntil(e.target.value)}*/}
              {/*    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
              {/*/>*/}

              <div className="flex space-x-4">
                <input
                    value={editAffectiveHours}
                    placeholder="Hour"
                    onChange={(e) => setAffectiveHours(e.target.value)}
                    className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                />
                <input
                    value={editAffectiveMinute}
                    placeholder="Minute"
                    onChange={(e) => setAffectiveMinute(e.target.value)}
                    className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                />
                                <input
                    value={editAffectiveDay}
                    placeholder="Day"
                    onChange={(e) => setAffectiveDay(e.target.value)}
                    className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                />
                <input
                    value={editAffectiveMonth}
                    placeholder="Month"
                    onChange={(e) => setAffectiveMonth(e.target.value)}
                    className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                />
                                <input
                    value={editAffectiveYear}
                    placeholder="Year"
                    onChange={(e) => setAffectiveYear(e.target.value)}
                    className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                />

              </div>
            </div>
            {/* Role description Section */}
            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1">
                Role description
              </label>
              <textarea
                  rows="3"
                  placeholder="Descriptive explanation of the role"
                  onChange={(e) => setEditRoleDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          {/* Other detail Section */}
          <div className="mb-6">
            <label className=" text-sm font-medium text-gray-700 mb-1">
              Additional Details
            </label>
            <textarea
                rows="3"
                onChange={(e) => setEditDetail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Qualification Section */}
          <div className="mt-3 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold">
                Qualification ({qualification.length}/10)
              </h3>
              <button
                  type="button"
                  onClick={addQualification}
                  className="text-orange-600 hover:underline text-sm"
              >
                + Add new
              </button>
            </div>
            {qualification.map((each, index) => (
                <input
                    key={index}
                    type="text"
                    placeholder="What is your skill requirement..."
                    value={each}
                    onChange={(e) => handleQualificationChange(index, e.target.value)}
                    className="w-full px-4 py-2 border rounded-md mt-2"
                    maxLength={120}
                />
            ))}

            <div className="flex justify-end mt-4">
            <button
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-800 mr-4"
                onClick={handleCreateListing}
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
          </div>
          {/* End the form this line */}
        </div>
        <Footer />
      </div>
  );
}

export default CreateListing;
