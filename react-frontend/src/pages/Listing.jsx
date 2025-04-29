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
    async function fetchDefault() {
      try {
        let response;

        if (userID) {
          response = await fetch("http://localhost:5000/get_matching_list", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userID }),
          });
          console.log("Step1");
          if (!response.ok) {
            console.warn("Matching list fetch failed using default listings");
            response = await fetch(
              "http://localhost:5000/get_default_listings",
              {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              }
            );
          }
          if (response.ok) {
            const data = await response.json();
            console.log("Listings:", data);
            setResults(data);
          } else {
            const errorData = await response.json();
            console.error("Error fetching listings:", errorData.error);
          }
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error.message);
      }
    }

    fetchDefault();
  }, [userID]);

  useEffect(() => {
    if (results.length > 0) {
      setSelectedJob(results[0]);
    }
  }, [results]);

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
        response = await fetch("http://localhost:5000/get_default_listings", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
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
      }

      if (response.status === 200) {
        const data = (await response.json?.()) || response.data;
        console.log("Search Result:", data);
        setResults(data);
        setSearchText("");
        setsearchIndustry("");
        setSearchLocation("");
        setSearchWorkType("");
        setSearchWorkCondition("");
        setSearchExperience("");
      } else {
        const errorData = await response.json?.();
        console.error("Error:", errorData?.error);
      }
    } catch (error) {
      console.error(
        "Search failed:",
        error.response?.data?.error || error.message
      );
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col">
      <L_navbar />

      <div class=" p-6 grid grid-cols-1 gap-6 ">
        <div class="flex flex-col md:flex-row">
          <div class="">
            <select
              class="border p-2 rounded"
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
          <div class="pt-6 md:pt-0 md:pl-6">
            <select
              class="border p-2 rounded"
              value={searchWorkCondition}
              onChange={(e) => setSearchWorkCondition(e.target.value)}
            >
              <option value="">All Work Conditions</option>
              <option value="Onsite">Onsite</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div class="pt-6 md:pt-0 md:pl-6">
            <select
              class="border p-2 rounded"
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
        <div class="flex justify-center">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md text-lg"
            onClick={handleSearch}
          >
            Find Job
          </button>
        </div>
      </div>

      {/* <div className="p-8 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-center">
        <input
          type="text"
          placeholder="Position or Company name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="p-2 w-full rounded-md border border-gray-300"
        />

        <select
          value={searchIndustry}
          onChange={(e) => setsearchIndustry(e.target.value)}
          className="p-2 w-full rounded-md border border-gray-300"
        >
          <option value="">All Industry</option>
          <option value="Technology and IT">Technology and IT</option>
          <option value="Food and Beverage">Food and Beverage</option>
          <option value="Remote">Medical</option>
        </select>

        <select
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="p-2 w-full rounded-md border border-gray-300"
        >
          <option value="">All Locations</option>
          <option value="Bangkok">Bangkok</option>
          <option value="Chiang Mai">Chiang Mai</option>
          <option value="Japan">Japan</option>
          <option value="Songkhla">Songkhla</option>
        </select>

        <select
          value={searchWorkType}
          onChange={(e) => setSearchWorkType(e.target.value)}
          className="p-2 w-full rounded-md border border-gray-300"
        >
          <option value="">All Work Types</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        <select
          value={searchWorkCondition}
          onChange={(e) => setSearchWorkCondition(e.target.value)}
          className="p-2 w-full rounded-md border border-gray-300"
        >
          <option value="">All Work Conditions</option>
          <option value="Onsite">Onsite</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <select
          value={searchExperience}
          onChange={(e) => setSearchExperience(e.target.value)}
          className="p-2 w-full rounded-md border border-gray-300"
        >
          <option value="">All Experience Levels</option>
          <option value="Not Required">Not Required</option>
          <option value="1 - 2 years">1 - 2 years</option>
          <option value="2 - 5 years">2 - 5 years</option>
          <option value="5 - 10 years">5 - 10 years</option>
          <option value="10 years or above">10 years or above</option>
        </select>

        <div className="md:col-span-3 flex justify-center mt-4">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md text-lg"
            onClick={handleSearch}
          >
            Find Job
          </button>
        </div>
      </div> */}

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
                key={job.listingid}
                className="p-3 border mb-2 cursor-pointer hover:bg-gray-100 flex items-center space-x-4"
                onClick={() => setSelectedJob(job)}
              >
                {/* Job Image */}
                <img
                  src={job.image_url}
                  alt={job.position}
                  className="w-16 h-16 object-cover rounded-md"
                />

                {/* Job Details */}
                <div>
                  <h3 className="font-medium">{job.position}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
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

              <p className="font-bold">{selectedJob.company}</p>
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
              <p className="mt-3 ">{selectedJob.qualification}</p>

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
                  <strong>Work type:</strong> {selectedJob.worktype}
                </p>
                <p>
                  <strong>Salary:</strong> {selectedJob.salary}
                </p>
                <p>
                  <strong>Work condition:</strong> {selectedJob.workcondition}
                </p>
                <p>
                  <strong>Experience:</strong> {selectedJob.experience}
                </p>
                <p>
                  <strong>Location:</strong> {selectedJob.location}
                </p>
              </div>
              <div className="mt-6 space-y-3">
                <button className="w-full bg-orange-500 text-white py-2 rounded-lg">
                  Apply For Position
                </button>
                <button className="w-full border border-orange-500 text-orange-500 py-2 rounded-lg">
                  Have A Conversation
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg">
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
