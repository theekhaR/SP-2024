import React, { useEffect, useState } from "react";
import Footer from "../components/footer";
import L_navbar from "../components/L_navbar.jsx";
import { useUserContext } from "../components/UserContext.jsx";
import MissingImagePlaceHolder from "../assets/MissingImagePlaceholder.jpg";

function Bookmark() {
  const { userID } = useUserContext();

  function getStatus(affectiveUntil) {
    const now = new Date();
    const untilDate = new Date(affectiveUntil);

    if (untilDate >= now) {
      return { text: "Open", color: "text-green-500" };
    } else {
      return { text: "Closed", color: "text-red-500" };
    }
  }

  const [bookmarkList, setBookmarkList] = useState([]);

  async function getUserBookmark() {
    try {
      const response = await fetch(
        `http://localhost:5000/get_user_bookmark?userID=${userID}`,
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
        const bookmarks = data.map((bookmark) => ({
          listingID: bookmark.listingID,
          position: bookmark.position,
          companyName: bookmark.companyName,
          companyLogoURL: bookmark.companyLogoURL,
          affectiveUntil: bookmark.affectiveUntil,
        }));

        setBookmarkList(bookmarks); // render immediately

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

  async function applyForListing(applyListingID) {
    try {
      console.log(userID);
      console.log(applyListingID);
      const response = await fetch(
        `http://localhost:5000/add_user_applicantion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: userID,
            listingID: applyListingID,
          }),
        }
      );

      //console.log(response)
      const data = await response.json();

      if (response.status === 409) {
        alert(data.error);
        return [];
      }

      // Unexpected error
      alert(data.error);

      //REMOVE BOOKMARK
      const response2 = await fetch(
        `http://localhost:5000//remove_user_bookmark`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: userID,
            listingID: applyListingID,
          }),
        }
      );

      //console.log(response)
      const data2 = await response2.json();
      if (response.status === 201) {
        window.location.reload();
        return;
      }

      if (response2.status === 409) {
        alert(data2.error);
        return [];
      }
      // Unexpected error
      alert(data2.error);
      return [];
    } catch (error) {
      console.error("Error checking user:", error);
      return [];
    }
  }

  async function removeBookmark(removeListingID) {
    try {
      const response = await fetch(
        `http://localhost:5000//remove_user_bookmark`,
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
    if (!userID) return; // Avoid running if companyID is not ready
    getUserBookmark();
  }, [userID]);

  return (
    <div>
      <L_navbar />
      <div className="min-h-screen bg-[#f7f9fc] py-10 px-4 md:px-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Bookmark</h2>

        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
          {/* Header */}
          <div className="border-b px-6 py-4 flex justify-between font-medium text-gray-600">
            <span>LISTING</span>
            <span className="ml-20">STATUS</span>
            <span>ACTION</span>
          </div>

          {bookmarkList.map((listing, index) => {
            const statusInfo = getStatus(listing.affectiveUntil);

            return (
              <div
                key={index}
                className="flex items-center justify-between px-6 py-4 border-b last:border-b-0"
              >
                {/* Listing */}
                <div className="flex items-center space-x-4">
                  <img
                    src={listing.companyLogoURL || MissingImagePlaceHolder}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <div className="text-gray-900 font-semibold">
                      {listing.position}
                    </div>
                    <div className="text-sm text-gray-500">
                      Listing by: {listing.companyName}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className={`text-sm font-semibold ${statusInfo.color}`}>
                  {statusInfo.text}
                </div>

                {/* Action */}
                <div className="flex items-center space-x-2">
                  {statusInfo.text === "Closed" ? (
                    <button className="w-[144px] py-2 px-4 bg-orange-100 text-orange-500 rounded-lg font-semibold text-sm">
                      Remove
                    </button>
                  ) : (
                    <>
                      <button
                        className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 px-4 rounded-lg"
                        onClick={() => applyForListing(listing.listingID)}
                      >
                        Apply
                      </button>
                      <button
                        className="p-2 rounded-lg bg-orange-100 text-orange-500"
                        onClick={() => removeBookmark(listing.listingID)}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Bookmark;
