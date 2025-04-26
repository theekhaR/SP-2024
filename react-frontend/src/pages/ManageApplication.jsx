import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useCompanyContext } from "../components/CompanyContext.jsx";
import Lnavbar from "../components/L_navbar";  // ✅ เพิ่มบรรทัดนี้
import Sidebar from "../components/sidebar";
import Footer from "../components/footer";
import SoftwareProfilePic from "../assets/manageapp_softwareprofile.jpg";
import { useParams } from 'react-router';

function ManageApplication() {

    const [showMore, setShowMore] = useState(false);
    const { listingID }= useParams();
    const [ applicantListing, setApplicantListing ] = useState([]);


  async function getListingDetail() {
      try {
          const response = await fetch(`http://localhost:5000/get_listings_of_company?companyID=${companyID}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          if (response.status === 200) {
              const data = await response.json();

              const listings = data.map((listing, index) => ({
                  listingID: listing.listingID,
                  position: listing.position,
                  createdOn: formatToThaiTime(listing.createdOn),
                  affectiveUntil: formatToThaiTime(listing.affectiveUntil),
                  image_url: null,
              }));
              return listings;
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

  async function getApplicantsList() {
      try {
          const response = await fetch(`http://localhost:5000/get_listing_application?listingID=${listingID}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          if (response.status === 200) {
              const data = await response.json();

              const applicants = data.map((applicant, index) => ({
                  "userFirstName": applicant.userFirstName,
                  "userLastName": applicant.userLastName,
                  "userEmail": applicant.userEmail,
                  "appliedOn": applicant.appliedOn,
                  "status": applicant.status,
                  "memo": applicant.memo,
                  "score": applicant.score
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

    useEffect(() => {
        getApplicantsList().then(setApplicantListing)
    }, []);

    return (
      <div className="bg-gray-100 min-h-screen">
        <Lnavbar />

        <div className="flex flex-row">
          <Sidebar />

          <div className="flex-1 p-8">

              {/* breadcum */}
              <div className=" py-4 px-0 text-sm text-gray-500">
            <nav className="flex items-center space-x-1">
                <a href="/course" className="hover:underline">Course</a>
                <span className="mx-1">/</span>
                <span className="text-gray-700 font-medium">
                Full Stack Developer Intern
                </span>
            </nav>
            </div>

            {/* head page */}
            <h1 className="text-2xl font-bold mb-6">Listing</h1>

            {/* block career that they application */}
            <div className="bg-white rounded-lg shadow-md p-6 flex gap-6">
                {/* Image */}
                <img
                    src={SoftwareProfilePic}
                    alt="Job Banner"
                    className="w-60 h-40 object-cover rounded-md"
                />

                {/* Job Info */}
                <div className="flex-1">
                    <div className="text-sm text-gray-400 mb-1">
                    Uploaded: <span className="text-gray-600">Jan 21, 2020</span> &nbsp; Last Updated: <span className="text-gray-600">Sep 11, 2021</span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900">Full Stack Developer Intern – Entry-Level Opportunity for Aspiring Engineers</h2>

                    <div className="mt-1 text-gray-500 text-sm border-b border-gray-200 pb-2">
                    Job detail
                    <span className="ml-2 border-dotted border-b a align-middle"></span>
                    </div>

                    {/* SEE ALL JOB DETAILS INFO */}
                    {/* Expandable Job Detail */}
                    <div className="text-sm mt-3 text-gray-700 space-y-2">
                    {showMore ? (
                        <>
                        <p><strong>Location:</strong> Hybrid (Remote + Occasional Onsite)</p>
                        <p><strong>Duration:</strong> 3–6 months</p>
                        <p><strong>Start Date:</strong> Flexible</p>
                        <p><strong>Type:</strong> Internship</p>

                        <p className="font-semibold mt-2">About the Role</p>
                        <p>We are seeking a motivated and detail-oriented <strong>Full Stack Developer Intern</strong>...</p>

                        <p className="font-semibold mt-2">Key Responsibilities</p>
                        <ul className="list-disc ml-5">
                            <li>Frontend with React.js</li>
                            <li>Backend API integration</li>
                            <li>Database work</li>
                        </ul>

                        <p className="font-semibold mt-2">Requirements</p>
                        <ul className="list-disc ml-5">
                            <li>HTML/CSS/JS + Framework</li>
                            <li>Git, APIs</li>
                        </ul>

                        <p className="font-semibold mt-2">Nice to Have</p>
                        <ul className="list-disc ml-5">
                            <li>Cloud platforms</li>
                        </ul>

                        <p className="font-semibold mt-2">Benefits</p>
                        <ul className="list-disc ml-5">
                            <li>Mentorship & Certificate</li>
                            <li>Flexible hours</li>
                        </ul>
                        </>
                    ) : (
                        <div className="line-clamp-3 text-gray-500">
                        <p><strong>📍 Location:</strong> Hybrid (Remote + Occasional Onsite)</p>
                        <p><strong>🕒 Duration:</strong> 3–6 months</p>
                        <p><strong>📅 Start Date:</strong> Flexible</p>
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
                        <div className="text-2xl font-semibold text-gray-900">50</div>
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
            <h2 className="text-xl font-semibold mb-4">Applicant (50)</h2>

            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] text-sm font-semibold text-gray-500 border-b pb-2">
                <div>NAME</div>
                <div>RATING</div>
                <div>CV</div>
                <div>ACTION</div>
            </div>

            {applicantListing.map((applicant, i) => (
                <div
                key={i}
                className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center py-4 border-b gap-2"
                >
                {/* Name */}
                <div className="flex items-center space-x-4">
                    <img
                    src={`https://randomuser.me/api/portraits/med/men/${i + 10}.jpg`}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="text-gray-800 font-medium">{applicant.userFirstName}</div>
                </div>

                {/* Rating */}
                <div className="text-orange-500">⭐⭐⭐⭐☆</div>

                {/* View Button */}
                <div>
                    <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
                    View
                    </button>
                </div>

                {/* Action */}
                <div>
                    <select className="px-4 py-2 border rounded text-gray-700 focus:outline-none focus:ring-orange-500 focus:border-orange-500">
                    <option>Approval</option>
                    <option>Interview</option>
                    <option>Rejected</option>
                    </select>
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



