import React from "react";
import { useState, useEffect } from "react";
import Footer from "../components/footer";
import L_navbar from "../components/L_navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faLocationDot,
  faSuitcase,
  faIndustry,
} from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../supabaseClient";
import axios from "axios";
import { useUserContext } from "../components/UserContext.jsx";
import { Link } from "react-router-dom";

function Listing() {
  const { userID } = useUserContext();
  const [selectedJob, setSelectedJob] = useState(null);

  // Search variable
  const [searchText, setSearchText] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchWorkType, setSearchWorkType] = useState("");
  const [searchWorkCondition, setSearchWorkCondition] = useState("");
  const [searchExperience, setSearchExperience] = useState("");
  const [searchIndustry, setsearchIndustry] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const MatchingSkill = async () => {
      if (!userID) {
        console.error("UserID is not available yet.");
        return;
      }

      try {
        // First try to get matching jobs
        const response = await axios.post("http://localhost:5000/matching", {
          userID: userID,
        });

        if (
          response.status === 200 &&
          response.data.length > 0 &&
          Object.values(response.data[0]).some((val) => val !== null)
        ) {
          console.log("Backend matched jobs:", response.data);
          setResults(response.data);
        } else {
          console.warn("No meaningful match, loading default listings...");
          await fetchDefaultListings();
        }
      } catch (error) {
        console.error("Error calling /matching:", error.message);
        await fetchDefaultListings(); // Fallback on error
      }
    };

    const fetchDefaultListings = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/get_default_listings",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Loaded default listings");
          setResults(data);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch default listings:", errorData.error);
        }
      } catch (error) {
        console.error("Error fetching default listings:", error.message);
      }
    };

    if (userID) {
      MatchingSkill();
    }
  }, [userID]);

  useEffect(() => {
    if (results.length > 0) {
      setSelectedJob(results[0]);
    }
  }, [results]);

  const formatQualification = (qualification) => {
    if (Array.isArray(qualification)) return qualification;
    if (typeof qualification === "string") {
      return qualification
        .split(/,\s(?=[A-Z0-9])/)
        .map((item) => item.trim())
        .filter((item) => item !== "");
    }
    return [];
  };

  const handleSearch = async () => {
    try {
      // Check if all search fields are empty
      const isAllEmpty =
        !searchText.trim() &&
        !searchIndustry.trim() &&
        !searchLocation.trim() &&
        !searchWorkType.trim() &&
        !searchWorkCondition.trim() &&
        !searchExperience.trim();

      let response;

      if (isAllEmpty) {
        // First try to get matching jobs
        try {
          response = await axios.post("http://localhost:5000/matching", {
            userID: userID,
          });

          if (
            response.status === 200 &&
            response.data.length > 0 &&
            Object.values(response.data[0]).some((val) => val !== null)
          ) {
            console.log("Matched jobs from backend:", response.data);
            setResults(response.data);
            return;
          } else {
            console.warn("No meaningful match, loading default listings...");
          }
        } catch (matchError) {
          console.error(
            "Matching failed, loading default listings...",
            matchError.message
          );
        }

        // Fallback to default listings if matching fails
        const defaultResponse = await fetch(
          "http://localhost:5000/get_default_listings",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (defaultResponse.ok) {
          const defaultData = await defaultResponse.json();
          setResults(defaultData);
        } else {
          const errorData = await defaultResponse.json();
          console.error("Failed to fetch default listings:", errorData?.error);
        }
      } else {
        // Handle search with filters
        response = await axios.get("http://localhost:5000/search", {
          params: {
            searchText,
            searchIndustry,
            searchLocation,
            searchWorkType,
            searchWorkCondition,
            searchExperience,
          },
        });

        if (response.status === 200) {
          setResults(response.data);
        } else {
          console.error("Search failed with status:", response.status);
        }
      }

      // Clear search fields after any search
      setSearchText("");
      setsearchIndustry("");
      setSearchLocation("");
      setSearchWorkType("");
      setSearchWorkCondition("");
      setSearchExperience("");
    } catch (error) {
      console.error(
        "Search failed:",
        error.response?.data?.error || error.message
      );
    }
  };

  const handleApplyListing = async (selectlistingID, selectuserID) => {
    try {
      console.log("IN FUNCTION, userID:", selectuserID);
      console.log("IN FUNCTION, listingID:", selectlistingID);
      const response = await fetch(
        `http://localhost:5000/add_user_applicantion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listingID: selectlistingID,
            userID: selectuserID,
          }),
        }
      );
      if (response.status === 201) {
        alert("Applied for the listing");
        return;
      }
    } catch (error) {
      console.error("Error applying for listing:", error);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col">
      <L_navbar />

      <div className=" p-6 grid grid-cols-1 gap-6 ">
        <div className="flex flex-col md:flex-row">
          <div className="">
            <select
              className="border p-2 rounded"
              value={searchWorkType}
              onChange={(e) => setSearchWorkType(e.target.value)}
            >
              <option value="">All Work Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <div className="pt-6 md:pt-0 md:pl-6">
            <select
              className="border p-2 rounded"
              value={searchWorkCondition}
              onChange={(e) => setSearchWorkCondition(e.target.value)}
            >
              <option value="">All Work Conditions</option>
              <option value="Onsite">Onsite</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="pt-6 md:pt-0 md:pl-6">
            <select
              className="border p-2 rounded"
              value={searchExperience}
              onChange={(e) => setSearchExperience(e.target.value)}
            >
              <option value="">All Experience Levels</option>
              <option value="Not Required">Not Required</option>
              <option value="1 - 2 years">1 - 2 years</option>
              <option value="2 - 5 years">2 - 5 years</option>
              <option value="5 - 10 years">5 - 10 years</option>
              <option value="10 years or above">10 years or above</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Text */}
          <div className="flex border rounded bg-white items-center p-2">
            <FontAwesomeIcon
              icon={faSuitcase}
              className="text-orange-500 text-xl mr-4"
            />
            <input
              type="text"
              placeholder="Position or Company name"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-white max-w-full focus:outline-none text-gray-700 w-full"
            />
          </div>

          {/* Industry */}
          <div className="flex border rounded bg-white items-center p-2">
            <FontAwesomeIcon
              icon={faIndustry}
              className="text-orange-500 text-xl mr-4"
            />

            <select
              value={searchIndustry}
              onChange={(e) => setsearchIndustry(e.target.value)}
              className="bg-white focus:outline-none text-gray-700 w-full"
            >
              <option value="">All Industry</option>
              <option value="Technology and IT">Technology and IT</option>
              <option value="Food and Beverage">Food and Beverage</option>
              <option value="Medical">Medical</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>

          {/* Location */}
          <div className="flex border rounded bg-white items-center p-2">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-orange-500 text-xl mr-4"
            />
            <select
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="bg-white focus:outline-none text-gray-700 w-full"
            >
              <option value="">All Locations</option>
              <option value="Bangkok">Bangkok</option>
              <option value="Chiang Mai">Chiang Mai</option>
              <option value="Japan">Japan</option>
              <option value="Songkhla">Songkhla</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md text-lg"
            onClick={handleSearch}
          >
            Find Job
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex h-screen">
        {/* Left - Job List */}
        <div className="w-1/5  overflow-y-auto border border-gray-300 bg-white shadow-md rounded-lg overflow-y-scroll scrollbar-hide ">
          <div className="bg-slate-800 p-3">
            <h2 className="text-lg font-semibold mb-4 text-center text-orange-500">
              Job suggestion
            </h2>
          </div>
          <div className="p-4">
            {results.map((job) => (
              <div
                key={job.listingID}
                className="p-3 border mb-2 cursor-pointer hover:bg-gray-100 flex items-center space-x-4"
                onClick={() =>
                  setSelectedJob({
                    ...job,
                    qualification: formatQualification(job.qualification),
                  })
                }
              >
                {/* Job Image */}
                <img
                  src={job.companyLogoURL}
                  className="w-16 h-16 object-cover rounded-md"
                />

                {/* Job Details */}
                <div>
                  <h3 className="font-medium">{job.position}</h3>
                  <p className="text-sm text-gray-600">{job.companyName}</p>
                  <p className="text-sm text-gray-600">{job.location}</p>
                  <p className="text-sm text-gray-600">{job.salary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle - Job Details */}
        <div className="w-3/5 p-4 bg-white border border-gray-300 shadow-md rounded-lg overflow-y-scroll scrollbar-hide">
          {selectedJob && (
            <div>
              <h2 className="text-xl font-bold text-orange-500">
                {selectedJob.position}
              </h2>

              <p className="font-bold">{selectedJob.companyName}</p>
              <div className="flex mt-3 gap-8 text-gray-600 text-base">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faDollarSign} />
                  <p className="text-gray-600 text-base">
                    {selectedJob.salary}
                  </p>
                  <FontAwesomeIcon icon={faLocationDot} />
                  <p>{selectedJob.location}</p>
                </div>
              </div>

              <p className="mt-6">{selectedJob.description}</p>

              <h2 className="text-xl font-bold mt-3 mb-3">Qualification:</h2>

              {Array.isArray(selectedJob?.qualification) ? (
                selectedJob.qualification.map((qual, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    ➤ {qual}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  No qualifications listed.
                </div>
              )}
              {/* <ul className="text-gray-600 space-y-2">
                {selectedJob.qualification.map((req, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-orange-500 mr-2">✔</span> {req}
                  </li>
                ))}
              </ul> */}
              <h2 className="mt-5 text-xl font-bold mb-3">Other detail:</h2>
              <p className="mt-3">{selectedJob.detail}</p>
            </div>
          )}
        </div>

        {/* Right - Apply Section */}
        <div className="w-1/5 bg-white border border-gray-300 shadow-md rounded-lg">
          <div className="bg-slate-800 p-4">
            <h3 className="text-lg font-semibold text-center text-orange-500">
              Job Details
            </h3>
          </div>
          {selectedJob && (
            <div className="max-w-xs mx-auto pr-4 pl-4">
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Position:</strong> {selectedJob.position}
                </p>
                <p>
                  <strong>Work type:</strong> {selectedJob.workType}
                </p>
                <p>
                  <strong>Salary:</strong> {selectedJob.salary}
                </p>
                <p>
                  <strong>Work condition:</strong> {selectedJob.workCondition}
                </p>
                <p>
                  <strong>Experience:</strong> {selectedJob.experience}
                </p>
                <p>
                  <strong>Location:</strong> {selectedJob.location}
                </p>
              </div>
              <div className="mt-6 space-y-3">
                <button
                  className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                  onClick={() =>
                    handleApplyListing(selectedJob.listingID, userID)
                  }
                >
                  Apply For Position
                </button>

                <Link
                  to={`/companyprofileuser/${selectedJob.companyID}`}
                  className="block w-full text-center border border-orange-500 text-orange-500 py-2 rounded-lg hover:bg-orange-50 transition"
                >
                  Check Company Profile
                </Link>

                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition">
                  Add To Bookmark
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Listing;
