import React from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";

function UserProfile() {
  const User = { image_url: "/images/Tech.png" };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Lnavbar />
      <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-10 bg-white shadow-md rounded-lg">
        {/* Account Settings */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Account Settings</h2>
          <div className="flex flex-row space-x-8">
            {/* Picture Box (a) */}
            <div className="flex flex-col items-center w-64 h-64 border rounded-md p-4 shadow">
              <img
                src={User.image_url}
                alt="Upload"
                className="w-full h-full object-cover rounded"
              />
              {/* Upload Image button */}
              <input type="file" id="upload-photo" className="hidden" />
              <label
                htmlFor="upload-photo"
                className="mt-14 text-sm text-white bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded"
              >
                Upload Photo
              </label>
            </div>

            {/* User Info Form (b) */}
            <div className="flex flex-col flex-grow space-y-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-1/2 px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-1/2 px-3 py-2 border rounded"
                />
              </div>
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-3 py-2 border rounded"
              />
              <input type="date" className="w-full px-3 py-2 border rounded" />

              <div className="flex justify-end space-x-4">
                <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <h2 className="mt-5 text-xl font-bold text-gray-800">
            User Portfolio
          </h2>
          <div className="flex flex-row space-x-4">
            <h3 className="text-gray-600">a</h3>
            <h3 className="text-gray-600">b</h3>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default UserProfile;
