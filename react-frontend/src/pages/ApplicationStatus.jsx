import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import L_navbar from "../components/L_navbar.jsx";
import { useUserContext } from "../components/UserContext.jsx";
import MissingImagePlaceHolder from "../assets/MissingImagePlaceholder.jpg";

function ApplicationStatus() {
  const { userID } = useUserContext();
  const [appliedListing, setAppliedListing] = useState([]);

  async function getUserApplication() {
    try {
      const response = await fetch(
        `http://localhost:5000/get_user_application?userID=${userID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      //console.log(response)
      const data = await response.json();
      if (response.status === 200) {
        // Map raw data to desired format
        const listings = data.map((listing) => ({
          appliedOn: listing.appliedOn,
          companyName: listing.companyName,
          listingID: listing.listingID,
          position: listing.position,
          status: listing.status,
          companyLogoURL: listing.companyLogoURL,
        }));

        setAppliedListing(listings);
        return;
      }

      if (response.status === 409) {
        alert(data.error);
        return [];
      }

      // Unexpected error
      alert(data.error);
      return [];
    } catch (error) {
      console.error("Error checking user:", error);
      return [];
    }
  }

  async function removeApplication(removeListingID) {
    try {
      const response = await fetch(
        `http://localhost:5000/remove_user_application`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: userID,
            listingID: removeListingID,
          }),
        }
      );

      //console.log(response)
      const data = await response.json();
      if (response.status === 201) {
        window.location.reload();
        return;
      }

      if (response.status === 409) {
        alert(data.error);
        return [];
      }

      // Unexpected error
      alert(data.error);
      return [];
    } catch (error) {
      console.error("Error checking user:", error);
      return [];
    }
  }

  useEffect(() => {
    if (userID) getUserApplication();
  }, [userID]);

  return (
    <div>
      <L_navbar />
      <div className="min-h-screen bg-[#f7f9fc] py-10 px-4 md:px-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Applied Status
        </h2>

        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
          {/* Header */}
          <div className="grid grid-cols-3 border-b px-6 py-4 font-medium text-gray-600">
            <span>LISTING</span>
            <span>STATUS</span>
            <span>ACTION</span>
          </div>

          {/* Content Rows */}
          {appliedListing.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 items-center px-6 py-4 border-b last:border-b-0"
            >
              {/* Listing */}
              <div className="flex items-center space-x-4">
                <img
                  src={item.companyLogoURL || MissingImagePlaceHolder}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <div className="text-gray-900 font-semibold">
                    {item.position}
                  </div>
                  <div className="text-sm text-gray-500">
                    Listing by: {item.companyName}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className={`text-sm font-semibold ${item.statusColor}`}>
                {item.status}
              </div>

              {/* Action */}
              <div>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-lg"
                  onClick={() => removeApplication(item.listingID)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ApplicationStatus;
