import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

function AppStatus() {
  const appliedList = [
    {
      title: "Financial Accounting",
      company: "SCB X",
      status: "Scheduled Interview",
      statusColor: "text-red-500",
      image: "https://via.placeholder.com/80x80.png?text=FA",
      rating: 4.8,
    },
    {
      title: "Digital Marketing",
      company: "RightShift",
      status: "In Consideration",
      statusColor: "text-orange-500",
      image: "https://via.placeholder.com/80x80.png?text=DM",
      rating: 4.8,
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#f7f9fc] py-10 px-4 md:px-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Applied Status
        </h2>

        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
          <div className="border-b px-6 py-4 flex justify-between font-medium text-gray-600">
            <span>LISTING</span>
            <span>STATUS</span>
          </div>

          {appliedList.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-6 py-4 border-b last:border-b-0"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <div className="flex items-center space-x-1 text-sm text-orange-500">
                    <span>★</span>
                    <span className="text-gray-700 font-medium">
                      {item.rating}
                    </span>
                  </div>
                  <div className="text-gray-900 font-semibold">
                    {item.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    Listing by: {item.company}
                  </div>
                </div>
              </div>
              <div className={`text-sm font-semibold ${item.statusColor}`}>
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AppStatus;
