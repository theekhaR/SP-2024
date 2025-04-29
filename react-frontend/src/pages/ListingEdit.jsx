import React, { useState, useEffect, useRef } from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import Pic from "../assets/Login.png";
import { useUserContext } from "../components/UserContext.jsx";

import { supabase } from "../supabaseClient.jsx";
import { v4 as uuidv4 } from "uuid";
import {Link, useNavigate} from "react-router-dom";
import {useCompanyContext} from "../components/CompanyContext.jsx";
import {useParams} from "react-router";

function ListingEdit() {
  const { userID } = useUserContext();
  const { companyID, companyInfo, companyLogoURL, userCompanyData, loadingCompanyContext } = useCompanyContext();
  const hiddenFileInput = useRef(null);
  const [fileName, setFileName] = useState("None");
  const navigate = useNavigate();
  const { listingID }= useParams();

  const [editListing, setEditListing] = useState({
    position: '',
    workType: '',
    workCondition: '',
    roleDescription: '',
    detail: '',
    qualification: [],
    affectiveUntil: '',
    salary: '',
    experience: '',
    affectiveHour: '',
    affectiveMinute: '',
    affectiveDay: '',
    affectiveMonth: '',
    affectiveYear: '',
  });

  const handleEditListing = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/edit_listing`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingID: listingID,
          ...editListing  // Spread the fields directly into the body
        }),
      });

      if (response.status === 200) {
        navigate(`/companylisting`);
        return;
      }
      const data = await response.json();
      alert(data.error);
    } catch (error) {
      console.error("Error encountered:", error);
    }
  };

  const getListing = async (event) => {
    try {
      const response = await fetch(`http://localhost:5000/get_listing_detail?listingID=${listingID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json(); // Moved inside try block

      if (data.error) {
        alert(data.error);
        return;
      }

      setEditListing({
        position: data.position,
        workType: data.workType,
        workCondition: data.workCondition,
        roleDescription: data.roleDescription,
        detail: data.detail,
        qualification: data.qualification || [],
        affectiveUntil: data.affectiveUntil,
        salary: data.salary,
        experience: data.experience,
        affectiveHour: new Date(data.affectiveUntil).getHours(),
        affectiveMinute: new Date(data.affectiveUntil).getMinutes(),
        affectiveDay: new Date(data.affectiveUntil).getDate(),
        affectiveMonth: new Date(data.affectiveUntil).getMonth(),
        affectiveYear: new Date(data.affectiveUntil).getFullYear(),
      });

    } catch (error) {
      console.error("Error encountered:", error);
    }
  };

  // Handle adding a new qualification
  const handleAddQualification = () => {
    setEditListing((prev) => ({
      ...prev,
      qualification: [...prev.qualification, ''], // Add an empty string to the array for a new qualification
    }));
  };

  // Handle removing a qualification
  const handleRemoveQualification = (index) => {
    const updatedQualifications = editListing.qualification.filter((_, i) => i !== index);
    setEditListing((prev) => ({
      ...prev,
      qualification: updatedQualifications,
    }));
  };

  // Handle changing a qualification
  const handleQualificationChange = (index, value) => {
    const updatedQualifications = [...editListing.qualification];
    updatedQualifications[index] = value;
    setEditListing((prev) => ({
      ...prev,
      qualification: updatedQualifications,
    }));
  };

  const handleDeleteListing = async (event) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_listing?listingID=${listingID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json(); // Moved inside try block
      if (data){
        navigate("/companylisting")
      }
      if (data.error) {
        alert(data.error);
        return;
      }
    } catch (error) {
      console.error("Error encountered:", error);
    }
  };

  useEffect( () => {getListing()}, [])

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
                  placeholder="Position Name"
                  value={editListing.position}
                  onChange={(e) => setEditListing({...editListing, position: e.target.value})}
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
                    value={editListing.workType}
                    onChange={(e) => setEditListing({...editListing, workType: e.target.value})}
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
                    value={editListing.salary}
                    onChange={(e) => setEditListing({...editListing, salary: e.target.value})}
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
                    value={editListing.workCondition}
                    onChange={(e) => setEditListing({...editListing, workCondition: e.target.value})}
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
                    value={editListing.experience}
                    onChange={(e) => setEditListing({...editListing, experience: e.target.value})}
                >
                  <option value="Not Required">Not Required</option>
                  <option value="1 - 2 years">1 - 2 years</option>
                  <option value="3 - 5 years">3 - 5 years</option>
                  <option value="6 - 10 years">6 - 10 years</option>
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
                    value={editListing.affectiveHour}
                    placeholder="Hour"
                    onChange={(e) => setEditListing({...editListing, affectiveHour: e.target.value})}
                    className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                />
                <input
                    value={editListing.affectiveMinute}
                    placeholder="Minute"
                    onChange={(e) => setEditListing({...editListing, affectiveMinute: e.target.value})}
                    className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                />
                <input
                    value={editListing.affectiveDay}
                    placeholder="Day"
                    onChange={(e) =>setEditListing({...editListing, affectiveDay: e.target.value})}
                    className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                />
                <input
                    value={editListing.affectiveMonth}
                    placeholder="Month"
                    onChange={(e) => setEditListing({...editListing, affectiveMonth: e.target.value})}
                    className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                />
                <input
                    value={editListing.affectiveYear}
                    placeholder="Year"
                    onChange={(e) => setEditListing({...editListing, affectiveYear: e.target.value})}
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
                  placeholder="Your title, profession or small biography"
                  value={editListing.roleDescription}
                  onChange={(e) => setEditListing({...editListing, roleDescription: e.target.value})}
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
                placeholder="Company advertising or benefit"
                value={editListing.detail}
                onChange={(e) => setEditListing({...editListing, detail: e.target.value})}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/*<div className="mt-3 mb-6 ">*/}
          {/*  <div className="flex justify-between items-center">*/}
          {/*    <h3 className="text-sm font-semibold">*/}
          {/*      Qualification ({skills.length}/8)*/}
          {/*    </h3>*/}
          {/*    <button*/}
          {/*        type="button"*/}
          {/*        onClick={addSkill}*/}
          {/*        className="text-orange-600 hover:underline text-sm"*/}
          {/*    >*/}
          {/*      + Add new*/}
          {/*    </button>*/}
          {/*  </div>*/}
          {/*  {skills.map((skill, index) => (*/}
          {/*      <input*/}
          {/*          key={index}*/}
          {/*          type="text"*/}
          {/*          placeholder="What is your skill requirement..."*/}
          {/*          value={skill}*/}
          {/*          onChange={(e) => handleSkillChange(index, e.target.value)}*/}
          {/*          className="w-full px-4 py-2 border rounded-md mt-2"*/}
          {/*          maxLength={120}*/}
          {/*      />*/}
          {/*  ))}*/}
          {/*</div>*/}

          {/* Qualification Section */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Qualifications
            </label>
            {editListing.qualification.map((qual, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <input
                      type="text"
                      value={qual}
                      onChange={(e) => handleQualificationChange(index, e.target.value)}
                      placeholder="Qualification"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                      type="button"
                      onClick={() => handleRemoveQualification(index)}
                      className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddQualification}
                className="mt-2 text-blue-600 hover:underline"
            >
              + Add new qualification
            </button>
          </div>

          <div className="flex justify-between mt-4">
            {/* Left-aligned Delete button */}
            <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
                onClick={handleDeleteListing}
            >
              Delete Listing
            </button>

            {/* Right-aligned Save and Cancel buttons */}
            <div className="flex space-x-4">
              <button
                  className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-800"
                  onClick={handleEditListing}
              >
                Save
              </button>
              <Link
                  className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-800"
                  to={`/companylisting`}
              >
                Cancel
              </Link>
            </div>
          </div>
          {/* End the form this line */}
        </div>
        <Footer />
      </div>
  );
}

export default ListingEdit;
