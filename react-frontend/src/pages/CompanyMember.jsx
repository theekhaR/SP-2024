import React from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";

function CompanyMember() {
  const Member = [
    {
      id: "m1",
      Pic: "Picture path kub",
      name: "Vertin",
      position: "CEO",
    },
    {
      id: "m2",
      Pic: "Picture path kub",
      name: "Sonetto",
      position: "HR",
    },
    {
      id: "m3",
      Pic: "Picture path kub",
      name: "Lilya",
      position: "HR",
    },
    {
      id: "m4",
      Pic: "Picture path kub",
      name: "Sotheby",
      position: "HR",
    },
    {
      id: "m5",
      Pic: "Picture path kub",
      name: "Druvis III",
      position: "HR",
    },
  ];
  return (
    <div className="bg-gray-100 min-h-screen">
      <Lnavbar />
      <div className="flex flex-row">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Current Member ({Member.length})
            </h1>
            <button className="bg-orange-500 text-white px-5 py-2 rounded hover:bg-orange-600">
              Add new member
            </button>
          </div>

          <div className="bg-white rounded shadow overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-3 px-6 py-4 bg-gray-50 font-semibold text-gray-600 text-sm">
              <div>Name</div>
              <div>Position</div>
              <div className="text-right">Action</div>
            </div>

            {/* Members */}
            {Member.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-3 items-center px-6 py-4 border-t hover:bg-gray-50"
              >
                {/* Name + Image */}
                <div className="flex items-center space-x-4">
                  <img
                    src={item.Pic}
                    alt="Profile"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <div className="font-medium text-gray-800">{item.name}</div>
                </div>

                {/* Position */}
                <div className="text-gray-800 font-medium">{item.position}</div>

                {/* Actions */}
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
              View All ({Member.length})
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CompanyMember;
