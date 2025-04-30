import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useCompanyContext } from "../components/CompanyContext.jsx";
import Lnavbar from "../components/L_navbar";
import Sidebar from "../components/sidebar";
import Footer from "../components/footer";
import SoftwareProfilePic from "../assets/manageapp_softwareprofile.jpg";
import { useParams } from "react-router";
import MissingImagePlaceHolder from "../assets/MissingImagePlaceholder.jpg";
import { Link } from "react-router-dom";

function ManageApplication() {
  const [showMore, setShowMore] = useState(false);
  const { listingID } = useParams();
  const [applicantListing, setApplicantListing] = useState([]);
  const [editingTarget, setEditingTarget] = useState(null);
  const [editStatus, setEditStatus] = useState();
  const [editMemo, setEditMemo] = useState();
  const [editScore, setEditScore] = useState();
  const [currentListing, setCurrentListing] = useState();

  async function getListingDetail() {
    try {
      const response = await fetch(
        `http://localhost:5000/get_listing_detail?listingID=${listingID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log(response);
        return await response.json();
      }

      // Unexpected error
      const data = await response.json();
      alert(data.error);
      return [];
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

  async function getApplicantsList() {
    try {
      const response = await fetch(
        `http://localhost:5000/get_listing_application?listingID=${listingID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();

        const applicants = data.map((applicant, index) => ({
          userID: applicant.userID,
          userFirstName: applicant.userFirstName,
          userLastName: applicant.userLastName,
          userEmail: applicant.userEmail,
          appliedOn: applicant.appliedOn,
          status: applicant.status,
          memo: applicant.memo,
          score: applicant.score,
          userPicURL: applicant.userPicURL,
        }));
        return applicants;
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

  const handleManageClick = (applicant) => {
    console.log("Clicked applicant ID:", applicant.userID);
    setEditingTarget(applicant.userID);
  };

  const handleCancel = () => {
    setEditingTarget(null);
  };

  async function handleSave() {
    try {
      const response = await fetch(`http://localhost:5000/edit_applicant`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: editingTarget,
          listingID: listingID,
          score: editScore,
          status: editStatus,
          memo: editMemo,
        }),
      });

      if (response.status === 201) {
        setEditingTarget(null);
        window.location.reload();
        return;
      }

      // Unexpected error
      const data = await response.json();
      alert(data.error);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    getApplicantsList().then(setApplicantListing);
  }, []);

  useEffect(() => {
    getListingDetail().then(setCurrentListing);
  }, []);

  useEffect(() => {
    console.log(currentListing);
  }, [currentListing]);

  if (!currentListing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Lnavbar />

      <div className="flex flex-row">
        <Sidebar />

        <div className="flex-1 p-8">
          {/* breadcum */}
          <div className=" py-4 px-0 text-sm text-gray-500">
            <nav className="flex items-center space-x-1">
              <a href="/course" className="hover:underline">
                Course
              </a>
              <span className="mx-1">/</span>
              <span className="text-gray-700 font-medium">
                {currentListing.position}
              </span>
            </nav>
          </div>

          {/* head page */}
          <h1 className="text-2xl font-bold mb-6">Listing</h1>

          {/* block career that they application */}
          <div className="bg-white rounded-lg shadow-md p-6 flex gap-6">
            {/* Image */}
            <img
              src={currentListing.companyLogoURL || MissingImagePlaceHolder}
              className="w-60 h-40 object-cover rounded-md"
            />

            {/* Job Info */}
            <div className="flex-1">
              {/*<div className="text-sm text-gray-400 mb-1">*/}
              {/*    Uploaded: <span className="text-gray-600">Jan 21, 2020</span> &nbsp; Last Updated: <span className="text-gray-600">Sep 11, 2021</span>*/}
              {/*</div>*/}

              <h2 className="text-xl font-bold text-gray-900">
                {currentListing.position}
              </h2>

              <div className="mt-1 text-gray-500 text-sm border-b border-gray-200 pb-2">
                Job detail
                <span className="ml-2 border-dotted border-b a align-middle"></span>
              </div>

              {/* SEE ALL JOB DETAILS INFO */}
              {/* Expandable Job Detail */}
              <div className="text-sm mt-3 text-gray-700 space-y-2">
                {showMore ? (
                  <>
                    <p>
                      <strong>Company:</strong> {currentListing.companyName}
                    </p>
                    <p>
                      <strong>Location:</strong> {currentListing.location}
                    </p>
                    <p>
                      <strong>Type:</strong> {currentListing.workType}
                    </p>
                    <p>
                      <strong>Condition:</strong> {currentListing.workCondition}
                    </p>
                    <p>
                      <strong>Experience:</strong> {currentListing.experience}
                    </p>
                    <p>
                      <strong>Salary:</strong> {currentListing.salary}
                    </p>

                    <p className="font-semibold mt-2">About the Role</p>
                    <p>{currentListing.roleDescription}</p>

                    <p className="font-semibold mt-2">Details</p>
                    <ul className="list-disc ml-5">{currentListing.detail}</ul>

                    <p className="font-semibold mt-2">Qualification</p>
                    <ul className="list-disc ml-5">
                      {currentListing.qualification}
                    </ul>
                  </>
                ) : (
                  <div className="line-clamp-3 text-gray-500">
                    <p>
                      <strong>Company:</strong> {currentListing.companyName}
                    </p>
                    <p>
                      <strong>Location:</strong> {currentListing.location}
                    </p>
                    <p>
                      <strong>Type:</strong> {currentListing.workType}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setShowMore(!showMore)}
                  className="mt-3 px-4 py-1 text-sm font-semibold border border-orange-500 text-orange-500 rounded hover:bg-orange-500 hover:text-white transition"
                >
                  {showMore ? "View Less" : "View More"}
                </button>
              </div>

              {/* Footer - Applicant Count */}
              <div className="flex justify-between items-center mt-4">
                <div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {applicantListing.length}
                  </div>
                  <div className="text-sm text-gray-500">Applicant</div>
                </div>

                {/* Optional menu button */}
                <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-md">
                  <span className="text-gray-700 text-lg">⋯</span>
                </button>
              </div>
            </div>
          </div>

          {/* ----------------------- Applicant List Box-------------------------- */}

          <div className="bg-white shadow-md rounded-lg p-6 mt-8 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">
              {"Applicant(" + applicantListing.length + ")"}
            </h2>

            <div className="grid grid-cols-[8fr_3fr_3fr_5fr_8fr_3fr] text-sm font-semibold text-gray-500 border-b pb-2">
              <div className="text-left">NAME</div>
              <div className="text-center">SCORE</div>
              <div className="text-center">CV</div>
              <div className="text-center">ACTION</div>
              <div className="text-center">MEMO</div>
              <div className="text-center">EDIT</div>
            </div>

            {/* Table Rows */}
            {applicantListing.map((applicant) => (
              <div
                key={applicant.userID}
                className="grid grid-cols-[8fr_3fr_3fr_5fr_8fr_3fr] items-center py-4 border-b gap-2"
              >
                {/* Name (left aligned) */}
                <div className="flex items-center space-x-4 text-left">
                  <img
                    src={applicant.userPicURL || MissingImagePlaceHolder}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-gray-800 font-medium">
                    {applicant.userFirstName + " " + applicant.userLastName}
                  </div>
                </div>

                {/* Score */}
                <div className="text-center">
                  {editingTarget === applicant.userID ? (
                    <select
                      className="px-4 py-2 border rounded text-gray-700 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      value={applicant.score}
                      onChange={(e) => setEditScore(e.target.value)}
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={10 - i}>{10 - i}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-orange-500 font-medium">
                      {applicant.score}
                    </div>
                  )}
                </div>

                {/* View Button */}
                <div>
                  <Link
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                    to={`/portfolioview/${applicant.userID}`}
                  >
                    View
                  </Link>
                  <div className="flex justify-center mt-6"></div>
                </div>

                {/* Action */}
                <div className="text-center">
                  {editingTarget === applicant.userID ? (
                    <select
                      className="px-4 py-2 border rounded text-gray-700 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      value={applicant.status}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option>Not Processed</option>
                      <option>Processing</option>
                      <option>On-hold</option>
                      <option>Interview Schedule</option>
                      <option>Rejected</option>
                    </select>
                  ) : (
                    <div className="text-orange-500 font-medium">
                      {applicant.status}
                    </div>
                  )}
                </div>

                {/* Memo */}
                <div className="text-center">
                  {editingTarget === applicant.userID ? (
                    <textarea
                      rows="3"
                      defaultValue={applicant.memo}
                      onChange={(e) => setEditMemo(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  ) : (
                    <div>{applicant.memo}</div>
                  )}
                </div>

                {/* Edit Buttons */}
                <div className="text-center">
                  <div className="flex justify-center space-x-2">
                    {editingTarget === applicant.userID ? (
                      <>
                        <button
                          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                        <button
                          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-800 text-sm"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 text-sm"
                        onClick={() => handleManageClick(applicant)}
                      >
                        Edit Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ManageApplication;
