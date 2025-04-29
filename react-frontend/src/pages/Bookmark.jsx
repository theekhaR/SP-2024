import React from "react";
import Footer from "../components/footer";
import L_navbar from "../components/L_navbar.jsx";

function Bookmark() {
  const appliedList = [
    {
      title: "Financial Accounting",
      company: "SCB X",
      image: "https://via.placeholder.com/80x80.png?text=FA",
      affectiveUntil: "2025-03-31T16:59:00",
    },
    {
      title: "Digital Marketing",
      company: "RightShift",
      image: "https://via.placeholder.com/80x80.png?text=DM",
      affectiveUntil: "2025-06-01T16:59:00",
    },
  ];

  function getStatus(affectiveUntil) {
    const now = new Date();
    const untilDate = new Date(affectiveUntil);

    if (untilDate >= now) {
      return { text: "ONGOING", color: "text-green-500" };
    } else {
      return { text: "OUTDATED", color: "text-red-500" };
    }
  }

  return (
    <div>
      <L_navbar />
      <div className="min-h-screen bg-[#f7f9fc] py-10 px-4 md:px-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Bookmark</h2>

        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
          {/* Header */}
          <div className="border-b px-6 py-4 flex justify-between font-medium text-gray-600">
            <span>LISTING</span>
            <span>STATUS</span>
            <span>ACTION</span>
          </div>

          {appliedList.map((item, index) => {
            const statusInfo = getStatus(item.affectiveUntil);

            return (
              <div
                key={index}
                className="flex items-center justify-between px-6 py-4 border-b last:border-b-0"
              >
                {/* Listing */}
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <div className="text-gray-900 font-semibold">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      Listing by: {item.company}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className={`text-sm font-semibold ${statusInfo.color}`}>
                  {statusInfo.text}
                </div>

                {/* Action */}
                <div className="flex items-center space-x-2">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 px-4 rounded-lg">
                    Apply
                  </button>
                  <button className="p-2 rounded-lg bg-orange-100 text-orange-500">
                    ❤️
                  </button>
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
