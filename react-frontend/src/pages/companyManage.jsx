import React from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";

function companyManage() {
  const listings = [
    {
      id: "l1",
      logo: "/logo1.png",
      title: "Website Development",
    },
    {
      id: "l2",
      logo: "/logo2.png",
      title: "Junior Software Development",
    },
    {
      id: "l3",
      logo: "/logo2.png",
      title: "Lorem ipsum dolor sit.",
    },
    {
      id: "l4",
      logo: "/logo2.png",
      title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    },
    {
      id: "l5",
      logo: "/logo2.png",
      title:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, minus.t",
    },
  ];
  return (
    <div className="bg-gray-100 min-h-screen">
      <Lnavbar />

      <div className="flex flex-row">
        <Sidebar />

        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Listing ({listings.length})</h1>
            <button className="bg-orange-500 text-white px-5 py-2 rounded hover:bg-orange-600">
              Create Listing
            </button>
          </div>

          <div className="bg-white rounded shadow overflow-hidden">
            <div className="grid grid-cols-3 px-6 py-4 bg-gray-50 font-semibold text-gray-600 text-sm">
              <div className="col-span-2">Name</div>
              <div className="text-right">Action</div>
            </div>

            {listings.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-3 items-center px-6 py-4 border-t hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4 col-span-2">
                  <img
                    src={item.logo}
                    alt="Company Logo"
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <div className="font-medium text-gray-800">
                      {item.title}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 text-sm">
                    Manage
                  </button>
                  <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-800 text-sm">
                    Kick
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <button className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600">
              View All ({listings.length})
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default companyManage;
